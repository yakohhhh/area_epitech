import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { SlackService } from './slack.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('slack')
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Get('auth-url')
  @UseGuards(JwtAuthGuard)
  async getAuthUrl(@Request() req: any) {
    const userId = req.user.userId;
    const redirectUrl = `${process.env.SLACK_REDIRECT_URL || 'https://localhost:5001/slack/callback'}`;
    const url = await this.slackService.getAuthUrl(userId, redirectUrl);
    return { authUrl: url };
  }

  @Get('callback')
  async handleCallback(@Query('code') code: string, @Query('state') state: string) {
    if (!code) {
      throw new Error('Code manquant');
    }
    const userId = parseInt(state, 10);
    if (isNaN(userId)) {
      throw new Error('User ID invalide');
    }
    const result = await this.slackService.handleOAuthCallback(code, userId);
    return { success: true, message: 'Slack authentification réussie', data: result };
  }

  @Post('send-notification')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async sendNotification(@Request() req: any, @Body() data: { message: string; channel?: string }) {
    const userId = req.user.userId;
    await this.slackService.sendNotification(userId, data.message, data.channel);
    return { success: true, message: 'Notification envoyée' };
  }
}
