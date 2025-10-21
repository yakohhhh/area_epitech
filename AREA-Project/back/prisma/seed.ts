import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  console.log('Creating services...');
  const gmail = await prisma.service.upsert({
    where: { name: 'gmail' },
    update: {},
    create: {
      name: 'gmail',
      displayName: 'Gmail',
      description: 'Service de messagerie électronique de Google',
      requiresOauth: true,
      oauthConfig: JSON.stringify({
        scopes: ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.readonly'],
      }),
    },
  });

  const googleCalendar = await prisma.service.upsert({
    where: { name: 'google_calendar' },
    update: {},
    create: {
      name: 'google_calendar',
      displayName: 'Google Calendar',
      description: 'Service de gestion d\'agenda de Google',
      requiresOauth: true,
      oauthConfig: JSON.stringify({
        scopes: ['https://www.googleapis.com/auth/calendar'],
      }),
    },
  });

  const googleContacts = await prisma.service.upsert({
    where: { name: 'google_contacts' },
    update: {},
    create: {
      name: 'google_contacts',
      displayName: 'Google Contacts',
      description: 'Service de gestion de contacts de Google',
      requiresOauth: true,
      oauthConfig: JSON.stringify({
        scopes: ['https://www.googleapis.com/auth/contacts'],
      }),
    },
  });

  console.log('✅ Services created');

  console.log('Creating Gmail actions...');
  await prisma.action.upsert({
    where: { serviceId_name: { serviceId: gmail.id, name: 'email_received' } },
    update: {},
    create: {
      serviceId: gmail.id,
      name: 'email_received',
      displayName: 'Email reçu',
      description: 'Se déclenche quand un email est reçu',
      parametersSchema: JSON.stringify({
        type: 'object',
        properties: {
          from: { type: 'string', description: 'Filtrer par expéditeur' },
          subject_contains: { type: 'string', description: 'Le sujet contient' },
        },
      }),
    },
  });

  await prisma.action.upsert({
    where: { serviceId_name: { serviceId: gmail.id, name: 'email_with_attachment' } },
    update: {},
    create: {
      serviceId: gmail.id,
      name: 'email_with_attachment',
      displayName: 'Email avec pièce jointe reçu',
      description: 'Se déclenche quand un email avec pièce jointe est reçu',
      parametersSchema: JSON.stringify({
        type: 'object',
        properties: {
          from: { type: 'string', description: 'Filtrer par expéditeur' },
        },
      }),
    },
  });

  console.log('✅ Gmail actions created');

  console.log('Creating Gmail reactions...');
  await prisma.reaction.upsert({
    where: { serviceId_name: { serviceId: gmail.id, name: 'send_email' } },
    update: {},
    create: {
      serviceId: gmail.id,
      name: 'send_email',
      displayName: 'Envoyer un email',
      description: 'Envoie un email à un destinataire',
      parametersSchema: JSON.stringify({
        type: 'object',
        required: ['to', 'subject', 'body'],
        properties: {
          to: { type: 'string', description: 'Adresse email du destinataire' },
          subject: { type: 'string', description: 'Sujet de l\'email' },
          body: { type: 'string', description: 'Corps de l\'email' },
          html: { type: 'boolean', description: 'Email en HTML', default: false },
        },
      }),
    },
  });

  console.log('✅ Gmail reactions created');

  console.log('Creating Google Calendar actions...');
  await prisma.action.upsert({
    where: { serviceId_name: { serviceId: googleCalendar.id, name: 'event_created' } },
    update: {},
    create: {
      serviceId: googleCalendar.id,
      name: 'event_created',
      displayName: 'Événement créé',
      description: 'Se déclenche quand un nouvel événement est créé',
      parametersSchema: JSON.stringify({
        type: 'object',
        properties: {
          calendar_id: { type: 'string', description: 'ID du calendrier à surveiller' },
        },
      }),
    },
  });

  await prisma.action.upsert({
    where: { serviceId_name: { serviceId: googleCalendar.id, name: 'event_starting_soon' } },
    update: {},
    create: {
      serviceId: googleCalendar.id,
      name: 'event_starting_soon',
      displayName: 'Événement bientôt',
      description: 'Se déclenche quand un événement commence bientôt',
      parametersSchema: JSON.stringify({
        type: 'object',
        properties: {
          hours_before: {
            type: 'number',
            description: 'Nombre d\'heures avant l\'événement',
            default: 1,
          },
        },
      }),
    },
  });

  console.log('✅ Google Calendar actions created');

  console.log('Creating Google Calendar reactions...');
  await prisma.reaction.upsert({
    where: { serviceId_name: { serviceId: googleCalendar.id, name: 'create_event' } },
    update: {},
    create: {
      serviceId: googleCalendar.id,
      name: 'create_event',
      displayName: 'Créer un événement',
      description: 'Crée un nouvel événement dans le calendrier',
      parametersSchema: JSON.stringify({
        type: 'object',
        required: ['summary', 'start', 'end'],
        properties: {
          summary: { type: 'string', description: 'Titre de l\'événement' },
          description: { type: 'string', description: 'Description de l\'événement' },
          start: { type: 'string', description: 'Date/heure de début (ISO 8601)' },
          end: { type: 'string', description: 'Date/heure de fin (ISO 8601)' },
          location: { type: 'string', description: 'Lieu de l\'événement' },
        },
      }),
    },
  });

  await prisma.reaction.upsert({
    where: { serviceId_name: { serviceId: googleCalendar.id, name: 'list_events' } },
    update: {},
    create: {
      serviceId: googleCalendar.id,
      name: 'list_events',
      displayName: 'Lister les événements',
      description: 'Liste les événements à venir',
      parametersSchema: JSON.stringify({
        type: 'object',
        properties: {
          max_results: { type: 'number', description: 'Nombre max d\'événements', default: 10 },
        },
      }),
    },
  });

  console.log('✅ Google Calendar reactions created');

  console.log('Creating Google Contacts actions...');
  await prisma.action.upsert({
    where: { serviceId_name: { serviceId: googleContacts.id, name: 'contact_added' } },
    update: {},
    create: {
      serviceId: googleContacts.id,
      name: 'contact_added',
      displayName: 'Contact ajouté',
      description: 'Se déclenche quand un nouveau contact est ajouté',
      parametersSchema: JSON.stringify({
        type: 'object',
        properties: {},
      }),
    },
  });

  console.log('✅ Google Contacts actions created');

  console.log('Creating Google Contacts reactions...');
  await prisma.reaction.upsert({
    where: { serviceId_name: { serviceId: googleContacts.id, name: 'create_contact' } },
    update: {},
    create: {
      serviceId: googleContacts.id,
      name: 'create_contact',
      displayName: 'Créer un contact',
      description: 'Crée un nouveau contact',
      parametersSchema: JSON.stringify({
        type: 'object',
        required: ['givenName'],
        properties: {
          givenName: { type: 'string', description: 'Prénom' },
          familyName: { type: 'string', description: 'Nom de famille' },
          email: { type: 'string', description: 'Adresse email' },
          phone: { type: 'string', description: 'Numéro de téléphone' },
        },
      }),
    },
  });

  console.log('✅ Google Contacts reactions created');

  console.log('\n🎉 Database seeding completed!');
  console.log('\n📊 Summary:');
  console.log('  - 3 services created (Gmail, Google Calendar, Google Contacts)');
  console.log('  - 4 actions created');
  console.log('  - 4 reactions created');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
