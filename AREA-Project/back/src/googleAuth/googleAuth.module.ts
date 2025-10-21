import { Module } from '@nestjs/common';
import { GoogleAuthController } from './googleAuth.controller';
import { GoogleCalendarModule } from '../googleCalendar/googleCalendar.module';
import { GoogleContactsModule } from '../googleContacts/googleContacts.module';

@Module({
  imports: [GoogleCalendarModule, GoogleContactsModule],
  controllers: [GoogleAuthController],
})
export class GoogleAuthModule {}