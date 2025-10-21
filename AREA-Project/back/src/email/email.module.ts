import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { EmailGmailDiscordController } from './email-gmail-discord.controller';
import { DiscordModule } from '../discord/discord.module';

@Module({
  imports: [DiscordModule],
  controllers: [EmailController, EmailGmailDiscordController],
  providers: [EmailService],
})
export class EmailModule {}