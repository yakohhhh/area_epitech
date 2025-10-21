import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { GoogleContactsService } from './googleContacts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('google-contacts')
@UseGuards(JwtAuthGuard)
export class GoogleContactsController {
  constructor(private readonly googleContactsService: GoogleContactsService) {}

  @Get('auth-url')
  async getAuthUrl(@Request() req: any) {
    const userId = req.user.id;
    const url = await this.googleContactsService.getAuthUrl(userId);
    return { authUrl: url };
  }

  @Post('create')
  async createContact(@Request() req: any, @Body() body: { name: string; email: string }) {
    const userId = req.user.id;
    if (!body.name || !body.email) {
      throw new Error('Name and email are required');
    }
    return await this.googleContactsService.createContact(userId, body);
  }
}
