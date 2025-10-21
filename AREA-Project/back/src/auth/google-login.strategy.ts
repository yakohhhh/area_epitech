import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleLoginStrategy extends PassportStrategy(Strategy, 'google-login') {

  constructor() {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackURL = process.env.GOOGLE_LOGIN_CALLBACK_URL || 'http://localhost:5001/auth/google/login/callback';

    if (!clientID || !clientSecret) {
      throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are required for Google OAuth');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/contacts'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    try {
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      const displayName = profile.displayName || profile.name?.givenName || null;

      if (!email) {
        return done(new Error('No email from Google'), null);
      }

      const userProfile = { email, displayName, accessToken, refreshToken };
      return done(null, userProfile);
    } catch (error) {
      return done(error, null);
    }
  }
}
