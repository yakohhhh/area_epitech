
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Request } from 'express';
import { google } from 'googleapis';

@Injectable()
export class GoogleRegisterStrategy extends PassportStrategy(Strategy, 'google-register') {

  constructor() {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackURL = process.env.GOOGLE_REGISTER_CALLBACK_URL || 'http://localhost:5001/auth/google/register/callback';

    if (!clientID || !clientSecret) {
      throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are required for Google OAuth');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
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
            process.env.GOOGLE_REGISTER_CALLBACK_URL,
          );
          const { tokens } = await oauth2Client.getToken(code);
          if (tokens.refresh_token) {
            finalRefreshToken = tokens.refresh_token;
            console.log('🔑 Refresh token obtenu via code exchange dans google-register.strategy');
          }
        }
      } catch (err) {
        console.warn('⚠️ Échec du code-exchange dans google-register.strategy:', err?.message || err);
      }

      const userProfile = { email, displayName, accessToken, refreshToken: finalRefreshToken };
      return done(null, userProfile);
    } catch (error) {
      return done(error, null);
    }
  }
}
