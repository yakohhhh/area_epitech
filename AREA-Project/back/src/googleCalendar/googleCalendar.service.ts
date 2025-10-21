import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { PrismaService } from '../prisma/prisma.service';

export interface CalendarEvent {
  summary: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  attendees?: string[];
}

@Injectable()
export class GoogleCalendarService {
  constructor(private prisma: PrismaService) {}

  private async createOAuth2Client(userId: number) {
    const userService = await this.prisma.userService.findFirst({
      where: {
        userId: userId,
        service: {
          name: 'google'
        }
      },
      include: {
        service: true
      }
    });

    if (!userService || !userService.refreshToken) {
      throw new Error('Utilisateur non connecté avec Google ou tokens manquants');
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL,
    );
    oauth2Client.setCredentials({
      refresh_token: userService.refreshToken,
    });
    return oauth2Client;
  }

  async getAuthUrl(userId: number): Promise<string> {
    const userService = await this.prisma.userService.findFirst({
      where: {
        userId: userId,
        service: {
          name: 'google'
        }
      },
      include: {
        service: true
      }
    });

    if (userService && userService.refreshToken) {
      throw new Error('Utilisateur déjà connecté avec Google');
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL,
    );
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
      ],
      prompt: 'consent',
    });
  }

  async createEvent(userId: number, eventData: CalendarEvent): Promise<any> {
    try {
      const oauth2Client = await this.createOAuth2Client(userId);
      await oauth2Client.getAccessToken();
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      const event = {
        summary: eventData.summary,
        description: eventData.description,
        location: eventData.location,
        start: {
          dateTime: eventData.startDateTime,
          timeZone: 'Europe/Paris',
        },
        end: {
          dateTime: eventData.endDateTime,
          timeZone: 'Europe/Paris',
        },
        attendees: eventData.attendees?.map(email => ({ email })),
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });

      return {
        success: true,
        eventId: response.data.id,
        eventLink: response.data.htmlLink,
        message: 'Événement créé avec succès',
      };
    } catch (error) {
      console.error('Google Calendar Error:', error);
      throw new Error(`Erreur lors de la création de l'événement: ${error.message}`);
    }
  }

  async listEvents(userId: number, maxResults: number = 10): Promise<any> {
    try {
      const oauth2Client = await this.createOAuth2Client(userId);
      await oauth2Client.getAccessToken();
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return {
        success: true,
        events: response.data.items,
      };
    } catch (error) {
      console.error('Google Calendar List Error:', error);
      throw new Error(`Erreur lors de la récupération des événements: ${error.message}`);
    }
  }
}