import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EmailService } from './email.service';
import { DiscordService } from '../discord/discord.service';

@UseGuards(JwtAuthGuard)
@Controller('gmail-discord')
export class EmailGmailDiscordController {
  constructor(
    private readonly emailService: EmailService,
    private readonly discordService: DiscordService,
  ) {}

  @Post('send-mail-and-notify')
  async sendMailAndNotify(
    @Body() body: { to: string; subject: string; body: string; discordChannelId: string },
    @Req() req: any
  ) {
    console.log('GMAIL-DISCORD DEBUG - Body reçu:', body);
    const userId = req.user?.id;
    const userEmail = req.user?.email;
    await this.emailService.sendEmail(userId, userEmail, body.to, body.subject, body.body);
    await this.discordService.sendChannelMessage(body.discordChannelId, `✉️ Un mail a été envoyé à ${body.to} avec succès !`);
    return { success: true };
  }
}
