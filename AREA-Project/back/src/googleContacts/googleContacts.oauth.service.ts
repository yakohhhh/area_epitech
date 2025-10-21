import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleContactsOAuthService {
  private oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CONTACTS_REDIRECT_URI,
  );

  generateAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/contacts'],
      prompt: 'consent',
    });
  }

  async getToken(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  }
}
