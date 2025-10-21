import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { GoogleCalendarService } from '../googleCalendar/googleCalendar.service';
import { GoogleContactsService } from '../googleContacts/googleContacts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('google-auth')
@UseGuards(JwtAuthGuard)
export class GoogleAuthController {
  constructor(
    private readonly googleCalendarService: GoogleCalendarService,
    private readonly googleContactsService: GoogleContactsService,
  ) {}

  @Get('test-calendar')
  async testCalendarAuth(@Request() req: any) {
    try {
      const userId = req.user.id;
      const result = await this.googleCalendarService.listEvents(userId, 1);
      return {
        success: true,
        message: 'Google Calendar authentication is working',
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: 'Google Calendar authentication failed',
        error: error.message,
        details: 'Make sure you have the correct scopes: calendar, calendar.events'
      };
    }
  }

  @Get('test-contacts')
  async testContactsAuth(@Request() req: any) {
    try {
      const userId = req.user.id;
      const oauth2Client = await (this.googleContactsService as any).createOAuth2Client(userId);
      await oauth2Client.getAccessToken();
      return {
        success: true,
        message: 'Google Contacts authentication is working',
        details: 'OAuth2 client can get access token successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Google Contacts authentication failed',
        error: error.message,
        details: 'Make sure you have the correct scopes: contacts, contacts.readonly'
      };
    }
  }

  @Get('calendar-auth-url')
  async getCalendarAuthUrl(@Request() req: any) {
    try {
      const userId = req.user.id;
      const authUrl = await this.googleCalendarService.getAuthUrl(userId);
      return { authUrl };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('contacts-auth-url')
  async getContactsAuthUrl(@Request() req: any) {
    try {
      const userId = req.user.id;
      const authUrl = await this.googleContactsService.getAuthUrl(userId);
      return { authUrl };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}