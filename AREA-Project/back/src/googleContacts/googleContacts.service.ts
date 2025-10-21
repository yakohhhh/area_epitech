import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GoogleContactsService {
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
      process.env.GOOGLE_CONTACTS_REDIRECT_URI,
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
      process.env.GOOGLE_CONTACTS_REDIRECT_URI,
    );
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/contacts',
        'https://www.googleapis.com/auth/contacts.readonly'
      ],
      prompt: 'consent',
    });
  }

  async createContact(userId: number, contactData: { name: string; email: string }) {
    try {
      const oauth2Client = await this.createOAuth2Client(userId);
      await oauth2Client.getAccessToken();

      const people = google.people({ version: 'v1', auth: oauth2Client });

      const res = await people.people.createContact({
        requestBody: {
          names: [{ displayName: contactData.name }],
          emailAddresses: [{ value: contactData.email }],
        },
      });
      return {
        success: true,
        contactId: res.data.resourceName,
        message: 'Contact créé avec succès',
        data: res.data
      };
    } catch (error) {
      console.error('Google Contacts Error:', error);
      throw new Error(`Erreur lors de la création du contact: ${error.message}`);
    }
  }
}
