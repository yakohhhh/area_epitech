import { DiscordModule } from './discord/discord.module';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AboutModule } from './about/about.module';
import { EmailModule } from './email/email.module';
import { GoogleCalendarModule } from './googleCalendar/googleCalendar.module';
import { GoogleContactsModule } from './googleContacts/googleContacts.module';
import { GoogleAuthModule } from './googleAuth/googleAuth.module';
import { MobileModule } from './mobile/mobile.module';
import { ServicesModule } from './services/services.module';
import { ActionsModule } from './actions/actions.module';
import { ReactionsModule } from './reactions/reactions.module';
import { UserServicesModule } from './user-services/user-services.module';
import { AreasModule } from './areas/areas.module';
import { SlackModule } from './slack/slack.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    AboutModule,
    EmailModule,
    GoogleCalendarModule,
    GoogleContactsModule,
    GoogleAuthModule,
    DiscordModule,
    SlackModule,
    MobileModule,
    ServicesModule,
    ActionsModule,
    ReactionsModule,
    UserServicesModule,
    AreasModule,
    PassportModule.register({ session: true })
  ],
})
export class AppModule {}
