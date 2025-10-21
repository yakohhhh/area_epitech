import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailService {
  constructor(private prisma: PrismaService) {}

  async sendEmail(userId: number | undefined, userEmail: string | undefined, to: string, subject: string, body: string): Promise<{ message: string; contact?: { created?: boolean; exists?: boolean; error?: string } }> {
  console.log('sendEmail called with userId:', userId, 'userEmail:', userEmail);
  let userService = null as any;
    if (userId) {
      userService = await this.prisma.userService.findFirst({
        where: {
          userId: userId,
          serviceId: 1
        }
      });
    }

    if (!userService && userEmail) {
      const user = await this.prisma.user.findUnique({ where: { email: userEmail } });
      if (user) {
        userService = await this.prisma.userService.findFirst({
          where: {
            userId: user.id,
            serviceId: 1
          }
        });
      }
    }

    if (!userService || !userService.refreshToken) {
      throw new Error('Utilisateur non connecté avec Google ou tokens manquants. Demandez à l\'utilisateur de reconnecter son compte Google.');
    }

    console.log(`EmailService: sending as userId=${userId} (serviceId=${userService.serviceId}) - hasRefresh=${!!userService.refreshToken}`);

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    oauth2Client.setCredentials({
      refresh_token: userService.refreshToken,
    });

    try {
      const { token } = await oauth2Client.getAccessToken() as any;
      if (!token) {
        throw new Error('Unable to obtain access token from refresh token');
      }
      console.log('EmailService: obtained access token (ok)');
    } catch (err: any) {
      console.error('EmailService: failed to refresh/access token for user', userId, err?.message || err);
      throw new Error('Impossible d\'obtenir un access token avec le refresh token enregistré. Demandez à l\'utilisateur de reconnecter son compte Google.');
    }

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });


    console.log('GMAIL DEBUG - Destinataire (to):', JSON.stringify(to));
    const message = [
      `To: ${to}`,
      'Subject: ' + subject,
      '',
      body,
    ].join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    let contactResult: { created?: boolean; exists?: boolean; error?: string } | undefined = undefined;

    try {
      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });
      try {
        const people = google.people({ version: 'v1', auth: oauth2Client });
        let toEmail = to;
        let toName: string | undefined;
        const match = to.match(/^(.*)<([^>]+)>$/);
        if (match) {
          toName = match[1].trim().replace(/^"|"$/g, '');
          toEmail = match[2].trim();
        } else if (to.includes('@')) {
          toEmail = to.trim();
          const local = toEmail.split('@')[0];
          toName = local.replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        }

        let alreadyExists = false;
        try {
          const searchRes: any = await people.people.searchContacts({
            query: toEmail,
            readMask: 'emailAddresses'
          });
          if (searchRes?.data?.results && searchRes.data.results.length > 0) {
            for (const r of searchRes.data.results) {
              const person = r.person;
              const emails = person.emailAddresses || [];
              if (emails.some((e: any) => (e.value || '').toLowerCase() === toEmail.toLowerCase())) {
                alreadyExists = true;
                break;
              }
            }
          }
        } catch (err: any) {
          console.warn('People API searchContacts failed:', err?.message || err);
          contactResult = { error: `search failed: ${err?.message || err}` };
        }

        if (!alreadyExists) {
          try {
            await people.people.createContact({
              requestBody: {
                names: toName ? [{ displayName: toName }] : undefined,
                emailAddresses: [{ value: toEmail }],
              }
            });
            console.log('EmailService: created Google Contact for', toEmail);
            contactResult = { created: true };
          } catch (err: any) {
            console.warn('People API createContact failed:', err?.message || err);
            contactResult = { error: `create failed: ${err?.message || err}` };
          }
        } else {
          console.log('EmailService: contact already exists for', toEmail);
          contactResult = { exists: true };
        }
      } catch (err: any) {
        console.warn('EmailService: contacts sync failed:', err?.message || err);
        contactResult = { error: err?.message || String(err) };
      }
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { message: 'Email sent successfully', contact: contactResult };
  }
}