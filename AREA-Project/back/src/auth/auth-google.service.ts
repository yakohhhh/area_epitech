import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

export interface GoogleLoginResponse {
  id: number;
  email: string;
  username?: string;
  message: string;
  isNewUser: boolean;
  access_token: string;
}

@Injectable()
export class AuthGoogleService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private generateJwtToken(user: { id: number; email: string; username?: string }): string {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username
    };
    return this.jwtService.sign(payload);
  }

  private async generateUniqueUsername(displayName: string, email: string): Promise<string> {
    const username = displayName || email.split('@')[0];
    let usernameToUse = username;
    let suffix = 1;
    while (true) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username: usernameToUse },
      });
      if (!existingUser) {
        break;
      }
      usernameToUse = `${username}${suffix}`;
      suffix++;
    }
    return usernameToUse;
  }
  async googleRegister(profile: any): Promise<GoogleLoginResponse> {
    const { email, displayName, accessToken, refreshToken } = profile;

    if (!email) {
      throw new BadRequestException('Email requis pour l\'authentification Google');
    }
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Un compte avec cet email existe déjà. Veuillez vous connecter.');
    }
    const usernameToUse = await this.generateUniqueUsername(displayName, email);
    const user = await this.prisma.user.create({
      data: {
        email,
        username: usernameToUse,
        passwordHash: null,
        isConfirmed: true,
      },
    });
    await this.storeGoogleTokens(user.id, accessToken, refreshToken);

    const access_token = this.generateJwtToken(user);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      message: 'Compte créé avec succès avec Google',
      isNewUser: true,
      access_token,
    };
  }

  async googleLogin(profile: any): Promise<GoogleLoginResponse> {
    const { email, displayName, accessToken, refreshToken } = profile;

    if (!email) {
      throw new BadRequestException('Email requis pour l\'authentification Google');
    }

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    let isNewUser = false;

    if (!user) {
      const usernameToUse = await this.generateUniqueUsername(displayName, email);
      user = await this.prisma.user.create({
        data: {
          email,
          username: usernameToUse,
          passwordHash: null,
          isConfirmed: true,
        },
      });
      isNewUser = true;
    }
    if (user.passwordHash) {
      throw new BadRequestException('Ce compte utilise une connexion par email/mot de passe. Veuillez utiliser la méthode de connexion classique.');
    }
    await this.storeGoogleTokens(user.id, accessToken, refreshToken);

    const access_token = this.generateJwtToken(user);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      message: isNewUser ? 'Compte créé et connexion réussie avec Google' : 'Connexion réussie avec Google',
      isNewUser,
      access_token,
    };
  }

  private async storeGoogleTokens(userId: number, accessToken: string, refreshToken: string): Promise<void> {
    let googleService = await this.prisma.service.findUnique({
      where: { name: 'google' },
    });

    if (!googleService) {
      googleService = await this.prisma.service.create({
        data: {
          name: 'google',
          displayName: 'Google',
          description: 'Services Google (Gmail, Calendar, Contacts)',
          requiresOauth: true,
        },
      });
    }
    const existingUserService = await this.prisma.userService.findUnique({
      where: {
        userId_serviceId: {
          userId: userId,
          serviceId: googleService.id,
        },
      },
    });

    if (existingUserService) {
      const updateData: any = {};
      if (accessToken) updateData.oauthToken = accessToken;
      if (refreshToken) updateData.refreshToken = refreshToken;

      if (Object.keys(updateData).length > 0) {
        await this.prisma.userService.update({
          where: { id: existingUserService.id },
          data: updateData,
        });
      }
    } else {
      const createData: any = {
        userId: userId,
        serviceId: googleService.id,
      };
      if (accessToken) createData.oauthToken = accessToken;
      if (refreshToken) createData.refreshToken = refreshToken;

      await this.prisma.userService.create({
        data: createData,
      });
    }
  }
}
