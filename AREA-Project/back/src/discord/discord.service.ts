import { Injectable } from '@nestjs/common';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';

@Injectable()
export class DiscordService {
  private client: Client;
  private ready: boolean = false;

  constructor() {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
    const token = process.env.DISCORD_BOT_TOKEN;
    if (token) {
      this.client.login(token);
      this.client.once('ready', () => {
        this.ready = true;
        console.log('Discord bot connecté !');
      });
    } else {
      console.warn('DISCORD_BOT_TOKEN non défini');
    }
  }

  async sendChannelMessage(channelId: string, message: string): Promise<void> {
    if (!this.ready) throw new Error('Le bot Discord n\'est pas prêt');
    const channel = await this.client.channels.fetch(channelId);
    if (!channel || !(channel instanceof TextChannel)) throw new Error('Salon Discord introuvable ou invalide');
    await channel.send(message);
  }
}
