import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SlackService {
  constructor(private prisma: PrismaService) {}

  async sendNotification(userId: number, message: string, channel?: string): Promise<void> {
    try {
      const userService = await this.prisma.userService.findFirst({
        where: {
          userId: userId,
          service: {
            name: 'slack'
          }
        },
        include: {
          service: true
        }
      });

      if (!userService || !userService.oauthToken) {
        throw new Error('Utilisateur non connecté avec Slack ou token manquant');
      }

      const accessToken = userService.oauthToken;
      const config = userService.config ? JSON.parse(userService.config) : {};
      // Send to area-notifications channel by default
      const targetChannel = channel || config.defaultChannel || 'area-notifications';

      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          channel: targetChannel,
          text: message,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Erreur Slack: ${error.error}`);
      }

      const result = await response.json();
      if (!result.ok) {
        throw new Error(`Slack error: ${result.error}`);
      }
    } catch (error) {
      console.error('Slack Notification Error:', error);
      throw new Error(`Erreur lors de l'envoi du message Slack: ${error.message}`);
    }
  }

  async sendEventNotification(userId: number, eventData: {
    summary: string;
    description?: string;
    startDateTime: string;
    endDateTime: string;
    location?: string;
  }): Promise<void> {
    const message = this.formatEventMessage(eventData);
    await this.sendNotification(userId, message);
  }

  private formatEventMessage(eventData: any): string {
    return `📅 *Nouvel événement créé*\n\n` +
      `*Titre:* ${eventData.summary}\n` +
      `${eventData.description ? `*Description:* ${eventData.description}\n` : ''}` +
      `*Début:* ${new Date(eventData.startDateTime).toLocaleString('fr-FR')}\n` +
      `*Fin:* ${new Date(eventData.endDateTime).toLocaleString('fr-FR')}\n` +
      `${eventData.location ? `*Lieu:* ${eventData.location}\n` : ''}`;
  }

  async getAuthUrl(userId: number, redirectUrl: string): Promise<string> {
    const clientId = process.env.SLACK_CLIENT_ID;
    if (!clientId) {
      throw new Error('SLACK_CLIENT_ID non configuré');
    }

    const scopes = [
      'chat:write',
      'channels:read',
      'users:read'
    ];

    const params = new URLSearchParams({
      client_id: clientId,
      scope: scopes.join(','),
      redirect_uri: redirectUrl,
      state: `${userId}`,
    });

    return `https://slack.com/oauth/v2/authorize?${params.toString()}`;
  }

  async handleOAuthCallback(code: string, userId: number): Promise<any> {
    try {
      const clientId = process.env.SLACK_CLIENT_ID;
      const clientSecret = process.env.SLACK_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error('Slack credentials not configured');
      }

      const response = await fetch('https://slack.com/api/oauth.v2.access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }).toString(),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const result = await response.json();

      if (!result.ok) {
        throw new Error(`OAuth error: ${result.error}`);
      }

      // Sauvegarder le token dans la base de données
      await this.prisma.userService.upsert({
        where: {
          userId_serviceId: {
            userId: userId,
            serviceId: (await this.getSlackServiceId()),
          }
        },
        update: {
          oauthToken: result.access_token,
          config: JSON.stringify({
            teamId: result.team.id,
            teamName: result.team.name,
            userId: result.authed_user.id,
          })
        },
        create: {
          userId: userId,
          serviceId: await this.getSlackServiceId(),
          oauthToken: result.access_token,
          config: JSON.stringify({
            teamId: result.team.id,
            teamName: result.team.name,
            userId: result.authed_user.id,
          })
        }
      });

      return {
        success: true,
        message: 'Slack connecté avec succès',
      };
    } catch (error) {
      console.error('Slack OAuth Error:', error);
      throw new Error(`Erreur lors de la connexion à Slack: ${error.message}`);
    }
  }

  private async getSlackServiceId(): Promise<number> {
    let service = await this.prisma.service.findUnique({
      where: {
        name: 'slack'
      }
    });

    if (!service) {
      service = await this.prisma.service.create({
        data: {
          name: 'slack',
          description: 'Slack messaging service',
        }
      });
    }

    return service.id;
  }
}
