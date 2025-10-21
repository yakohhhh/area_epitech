import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';
import { google } from 'googleapis';
import { Request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(private authService: AuthService) {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackURL = process.env.GOOGLE_CALLBACK_URL;

    if (!clientID || !clientSecret) {
      throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are required for Google OAuth');
    }

    super({
      clientID,
      clientSecret,
      callbackURL: callbackURL || '/auth/google/callback',
      scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/contacts'],
      accessType: 'offline',
      prompt: 'consent',
      includeGrantedScopes: true,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    try {
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      const displayName = profile.displayName || profile.name?.givenName || null;

      if (!email) {
        return done(new Error('No email from Google'), null);
      }
      let finalRefreshToken = refreshToken;

      try {
        const code = req?.query?.code as string | undefined;
        if (!finalRefreshToken && code) {
          const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_CALLBACK_URL,
          );
          const { tokens } = await oauth2Client.getToken(code);
          if (tokens.refresh_token) {
            finalRefreshToken = tokens.refresh_token;
            console.log('🔑 Refresh token obtenu via code exchange dans stratégie (validate)');
          }
        }
      } catch (err) {
        console.warn('⚠️ Échec du code-exchange dans stratégie:', err?.message || err);
      }

      const userProfile = {
        email,
        displayName,
        accessToken,
        refreshToken: finalRefreshToken
      };
      const user = await this.authService.googleLogin(userProfile);

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
}
