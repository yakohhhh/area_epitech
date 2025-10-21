import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthValidationService } from './auth-validation.service';
import { AuthGoogleService, GoogleLoginResponse } from './auth-google.service';
import * as bcrypt from 'bcrypt';

export interface RegisterDto {
  email: string;
  username?: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  username?: string;
  message: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  username?: string;
  message: string;
  access_token: string;
}

export { GoogleLoginResponse };

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private authValidation: AuthValidationService,
    private authGoogle: AuthGoogleService,
  ) {}

  private generateJwtToken(user: { id: number; email: string; username?: string }): string {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username
    };
    return this.jwtService.sign(payload);
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    const { email, username, password } = registerDto;

    this.authValidation.validateRegisterData(email, password, username);

    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    if (username) {
      const existingUserByUsername = await this.prisma.user.findUnique({
        where: { username },
      });

      if (existingUserByUsername) {
        throw new ConflictException('Un utilisateur avec ce nom d\'utilisateur existe déjà');
      }
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        email,
        username: username || null,
        passwordHash,
        isConfirmed: false,
      },
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      message: 'Utilisateur a été créé avec succès',
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    this.authValidation.validateLoginData(email, password);

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Identifiants invalides');
    }

    if (!user.passwordHash) {
      throw new BadRequestException('Cet utilisateur utilise l\'authentification OAuth. Veuillez vous connecter avec Google.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new BadRequestException('Identifiants invalides');
    }

    const access_token = this.generateJwtToken(user);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      message: 'Connexion réussie',
      access_token,
    };
  }

  async googleRegister(profile: any): Promise<GoogleLoginResponse> {
    return this.authGoogle.googleRegister(profile);
  }

  async googleLogin(profile: any): Promise<GoogleLoginResponse> {
    return this.authGoogle.googleLogin(profile);
  }
}
