import { Module } from '@nestjs/common';
import { GoogleCalendarController } from './googleCalendar.controller';
import { GoogleCalendarService } from './googleCalendar.service';
import { SlackModule } from '../slack/slack.module';

@Module({
  imports: [SlackModule],
  controllers: [GoogleCalendarController],
  providers: [GoogleCalendarService],
  exports: [GoogleCalendarService],
})
export class GoogleCalendarModule {}