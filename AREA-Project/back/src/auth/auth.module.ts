import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthValidationService } from './auth-validation.service';
import { AuthGoogleService } from './auth-google.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './google.strategy';
import { GoogleRegisterStrategy } from './google-register.strategy';
import { GoogleLoginStrategy } from './google-login.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' }, // Le token expire après 24h
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthValidationService,
    AuthGoogleService,
    GoogleStrategy,
    GoogleRegisterStrategy,
    GoogleLoginStrategy,
    JwtStrategy
  ],
  exports: [AuthService],
})
export class AuthModule {}