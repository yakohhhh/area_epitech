
import { Controller, Post, Body, HttpCode, HttpStatus, Get, Req, Res, UseGuards, Query } from '@nestjs/common';
import { AuthService, RegisterDto, RegisterResponse, LoginDto, LoginResponse, GoogleLoginResponse } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { google } from 'googleapis';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponse> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }

  @Get('google')
  async googleAuth(@Req() req: Request, @Res() res: Response) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/auth/google/callback';
    const scopes = [
      'profile',
      'email',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/contacts',
    ].join(' ');

    // Conserver l'origine (mobile ou web) dans le state
    const origin = (req.query.origin as string) || 'web';
    const platform = (req.query.platform as string) || origin;
    const stateData = { origin, platform };
    const state = Buffer.from(JSON.stringify(stateData)).toString('base64');

    const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
      `client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scopes)}` +
      `&access_type=offline` +
      `&prompt=consent` +
      `&state=${encodeURIComponent(state)}` +
      `&include_granted_scopes=true`;

    return res.redirect(authUrl);
  }

  @Get('google/register')
  async googleRegisterAuth(@Req() req: Request, @Res() res: Response) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REGISTER_CALLBACK_URL || 'http://localhost:5001/auth/google/register/callback';
    const scopes = [
      'profile',
      'email',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/contacts',
    ].join(' ');

    // Conserver l'origine (mobile ou web) dans le state
    const origin = (req.query.origin as string) || 'web';
    const platform = (req.query.platform as string) || origin;
    const stateData = { origin, platform };
    const state = Buffer.from(JSON.stringify(stateData)).toString('base64');

    const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
      `client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scopes)}` +
      `&access_type=offline` +
      `&prompt=consent` +
      `&state=${encodeURIComponent(state)}` +
      `&include_granted_scopes=true`;

    return res.redirect(authUrl);
  }
  @Get('google/url')
  @UseGuards(JwtAuthGuard)
  async getGoogleAuthUrl(@Req() req: any) {
    const user = req.user;
    const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_CODE_CALLBACK_URL || `${process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001'}/auth/google/code-callback`;
    const scopes = [
      'profile',
      'email',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/contacts',
    ].join(' ');

    const state = this.jwtService.sign({ sub: user.sub || user.id }, { expiresIn: '10m' });

    const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
      `client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scopes)}` +
      `&access_type=offline` +
      `&prompt=consent` +
      `&state=${encodeURIComponent(state)}`;

    return { authUrl };
  }

  @Get('google/code-callback')
  async googleCodeCallback(@Req() req: Request, @Res() res: Response, @Query('code') code?: string, @Query('state') state?: string) {
    try {
      if (!code) {
        return res.status(400).send('Missing code');
      }
      if (!state) {
        return res.status(400).send('Missing state');
      }

      let payload: any;
      try {
        payload = this.jwtService.verify(state);
      } catch (err) {
        return res.status(400).send('Invalid state token');
      }

      const userId = payload.sub;
      if (!userId) {
        return res.status(400).send('Invalid state payload');
      }

      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CODE_CALLBACK_URL || `${process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001'}/auth/google/code-callback`
      );

      const { tokens } = await oauth2Client.getToken(code);

      console.log('Google code exchange tokens:', {
        has_access_token: !!tokens.access_token,
        has_refresh_token: !!tokens.refresh_token,
      });

      let googleService = await this.prisma.service.findUnique({ where: { name: 'google' } });
      if (!googleService) {
        googleService = await this.prisma.service.create({ data: { name: 'google', displayName: 'Google', requiresOauth: true } });
      }

      const existing = await this.prisma.userService.findFirst({ where: { userId: Number(userId), serviceId: googleService?.id } });
      if (existing) {
        const updateData: any = {};
        if (tokens.access_token) updateData.oauthToken = tokens.access_token;
        if (tokens.refresh_token) updateData.refreshToken = tokens.refresh_token;
        if (Object.keys(updateData).length > 0) {
          await this.prisma.userService.update({ where: { id: existing.id }, data: updateData });
        }
      } else {
        const createData: any = { userId: Number(userId), serviceId: googleService?.id };
        if (tokens.access_token) createData.oauthToken = tokens.access_token;
        if (tokens.refresh_token) createData.refreshToken = tokens.refresh_token;
        await this.prisma.userService.create({ data: createData });
      }

      // Redirect back to frontend
      const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontend}/profile?connected=google`);
    } catch (error: any) {
      console.error('Google code exchange error:', error);
      return res.status(500).send('Token exchange failed');
    }
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const googleProfile = req.user as any;

      const userProfile = {
        ...googleProfile,
        accessToken: googleProfile.accessToken,
        refreshToken: googleProfile.refreshToken,
      };

      let user: GoogleLoginResponse | any;
      let isNewUser = false;

      try {
        user = await this.authService.googleLogin(userProfile);
      } catch (e) {
        user = await this.authService.googleRegister(userProfile);
        isNewUser = true;
      }

      // Récupérer l'origine depuis le state parameter
      let origin = '';
      if (req.query.state) {
        try {
          const stateData = JSON.parse(Buffer.from(req.query.state as string, 'base64').toString());
          origin = stateData.origin || '';
        } catch (e) {
          // Si le parsing échoue, on continue avec les autres méthodes de détection
        }
      }

      // Fallback: essayer de détecter l'origine depuis d'autres sources
      if (!origin) {
        const referer = req.get('Referer') as string || '';
        const userAgent = req.get('User-Agent') as string || '';
        origin = referer?.includes('5175') || referer?.includes('mobile') || 
                 req.query.platform === 'mobile' || userAgent?.includes('Mobile') ? 'mobile' : '';
      }

      const isMobile = origin === 'mobile' || origin?.includes('5175') || origin?.includes('mobile');
      
      let frontendUrl = process.env.FRONTEND_WEB_URL || 'http://localhost:3000';
      if (isMobile) {
        frontendUrl = process.env.FRONTEND_MOBILE_URL || 'http://localhost:5175';
      }

      const safeUserPayload = {
        id: user.id,
        email: user.email,
        username: user.username || (user.email ? user.email.split('@')[0] : ''),
      };

      const callbackUrl = `${frontendUrl}/auth/google/callback?token=${encodeURIComponent(
        user.access_token,
      )}&user=${encodeURIComponent(JSON.stringify(safeUserPayload))}&isNewUser=${isNewUser}`;
      res.redirect(callbackUrl);
    } catch (error: any) {
      const origin = (req.query.origin as string) || (req.get('Referer') as string) || '';
      const isMobile = origin?.includes('5175') || origin?.includes('mobile');
      const frontendUrl = isMobile 
        ? (process.env.FRONTEND_MOBILE_URL || 'http://localhost:5175')
        : (process.env.FRONTEND_WEB_URL || 'http://localhost:3000');
      const errorMessage = error?.message || 'Erreur lors de l\'authentification Google';
      res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent(errorMessage)}`,
      );
    }
  }

  @Get('google/register/callback')
  @UseGuards(AuthGuard('google-register'))
  async googleRegisterCallback(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const googleProfile = req.user as any;
      const userProfile = {
        ...googleProfile,
        accessToken: googleProfile.accessToken,
        refreshToken: googleProfile.refreshToken,
      };

      const user = await this.authService.googleRegister(userProfile);

      // Récupérer l'origine depuis le state parameter
      let origin = '';
      if (req.query.state) {
        try {
          const stateData = JSON.parse(Buffer.from(req.query.state as string, 'base64').toString());
          origin = stateData.origin || '';
        } catch (e) {
          // Si le parsing échoue, on continue avec les autres méthodes de détection
        }
      }

      // Fallback: essayer de détecter l'origine depuis d'autres sources
      if (!origin) {
        const referer = req.get('Referer') as string || '';
        const userAgent = req.get('User-Agent') as string || '';
        origin = referer?.includes('5175') || referer?.includes('mobile') || 
                 req.query.platform === 'mobile' || userAgent?.includes('Mobile') ? 'mobile' : '';
      }

      const isMobile = origin === 'mobile' || origin?.includes('5175') || origin?.includes('mobile');
      
      let frontendUrl = process.env.FRONTEND_WEB_URL || 'http://localhost:3000';
      if (isMobile) {
        frontendUrl = process.env.FRONTEND_MOBILE_URL || 'http://localhost:5175';
      }

      const safeUserPayload = {
        id: user.id,
        email: user.email,
        username: user.username || (user.email ? user.email.split('@')[0] : ''),
      };

      const callbackUrl = `${frontendUrl}/auth/google/callback?token=${encodeURIComponent(
        user.access_token,
      )}&user=${encodeURIComponent(JSON.stringify(safeUserPayload))}&isNewUser=true`;
      res.redirect(callbackUrl);
    } catch (error: any) {
      const origin = (req.query.origin as string) || (req.get('Referer') as string) || '';
      const isMobile = origin?.includes('5175') || origin?.includes('mobile');
      const frontendUrl = isMobile 
        ? (process.env.FRONTEND_MOBILE_URL || 'http://localhost:5175')
        : (process.env.FRONTEND_WEB_URL || 'http://localhost:3000');
      const errorMessage = error?.message || 'Erreur lors de l\'inscription Google';
      res.redirect(
        `${frontendUrl}/register?error=${encodeURIComponent(errorMessage)}`,
      );
    }
  }
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    return {
      message: 'Accès autorisé avec JWT',
      user: req.user
    };
  }
}