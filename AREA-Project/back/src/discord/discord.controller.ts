import { Controller, Post, Body } from '@nestjs/common';
import { DiscordService } from './discord.service';

@Controller('discord')
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  @Post('notify')
  async notify(@Body() body: { channelId: string; message: string }) {
    await this.discordService.sendChannelMessage(body.channelId, body.message);
    return { success: true };
  }
}
