import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller()
export class AboutController {
  @Get('about.json')
  about(@Req() req: Request) {
    const clientIp =
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || null;
    const services = [
      {
        name: 'gmail',
        actions: [
          {
            name: 'email_received',
            description: 'An email is received by the user'
          },
          {
            name: 'email_with_attachment',
            description: 'An email with attachment is received'
          }
        ],
        reactions: [
          {
            name: 'send_email',
            description: 'Send an email to a recipient'
          }
        ]
      },
      {
        name: 'google_calendar',
        actions: [
          {
            name: 'event_created',
            description: 'A new event is created in the calendar'
          },
          {
            name: 'event_starting_soon',
            description: 'An event is starting in less than X hours'
          }
        ],
        reactions: [
          {
            name: 'create_event',
            description: 'Create a new event in the calendar'
          },
          {
            name: 'list_events',
            description: 'List upcoming events from the calendar'
          }
        ]
      },
      {
        name: 'google_contacts',
        actions: [
          {
            name: 'contact_added',
            description: 'A new contact is added'
          }
        ],
        reactions: [
          {
            name: 'create_contact',
            description: 'Create a new contact'
          }
        ]
      }
    ];

    return {
      client: {
        host: clientIp,
      },
      server: {
        current_time: Math.floor(Date.now() / 1000),
        services,
      },
    };
  }
}
