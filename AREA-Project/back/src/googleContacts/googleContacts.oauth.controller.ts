import { Controller, Get, Query, Res } from '@nestjs/common';
import { GoogleContactsOAuthService } from './googleContacts.oauth.service';
import { Response } from 'express';

@Controller('google-contacts/oauth')
export class GoogleContactsOAuthController {
  constructor(private readonly oauthService: GoogleContactsOAuthService) {}

  @Get('login')
  login(@Res() res: Response) {
    const url = this.oauthService.generateAuthUrl();
    return res.redirect(url);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    const tokens = await this.oauthService.getToken(code);
    return res.json(tokens);
  }
}
