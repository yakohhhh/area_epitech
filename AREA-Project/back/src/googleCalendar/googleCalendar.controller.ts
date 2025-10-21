import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { GoogleCalendarService, CalendarEvent } from './googleCalendar.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SlackService } from '../slack/slack.service';

@Controller('google-calendar')
export class GoogleCalendarController {
  constructor(
    private readonly googleCalendarService: GoogleCalendarService,
    private readonly slackService: SlackService,
  ) {}

  @Get('auth-url')
  @UseGuards(JwtAuthGuard)
  async getAuthUrl(@Request() req: any) {
    const userId = req.user.id;
    const url = await this.googleCalendarService.getAuthUrl(userId);
    return { authUrl: url };
  }

  @Post('create-event')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createEvent(@Request() req: any, @Body() eventData: CalendarEvent) {
    const userId = req.user.id;
    const result = await this.googleCalendarService.createEvent(userId, eventData);
    
    // Envoyer une notification Slack
    try {
      await this.slackService.sendEventNotification(userId, eventData);
    } catch (error) {
      // Log l'erreur mais ne fait pas échouer la création de l'événement
      console.error('Erreur lors de l\'envoi de la notification Slack:', error.message);
    }
    
    return result;
  }

  @Get('events')
  @UseGuards(JwtAuthGuard)
  async getEvents(@Request() req: any, @Query('maxResults') maxResults?: string) {
    const userId = req.user.id;
    const limit = maxResults ? parseInt(maxResults, 10) : 10;
    return this.googleCalendarService.listEvents(userId, limit);
  }
}