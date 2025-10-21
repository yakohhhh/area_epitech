import { Service } from './types';

export const SERVICES_CATALOG: Service[] = [
  {
    id: 'gmail',
    name: 'Gmail + Google Contacts',
    icon: '✉️',
    actions: [
      {
        id: 'gmail.sendEmail',
        label: 'Envoyer un mail',
        description: 'Envoie un email automatiquement.',
        fields: [
          {
            name: 'to',
            label: 'À',
            type: 'email',
            required: true,
            placeholder: 'destinataire@exemple.com',
          },
          { name: 'subject', label: 'Objet', type: 'text', required: true },
          { name: 'body', label: 'Contenu', type: 'textarea', required: true },
        ],
      },
    ],
  },
  {
    id: 'gcalendar',
    name: 'Google Calendar',
    icon: '📅',
    actions: [
      {
        id: 'gcalendar.createEvent',
        label: 'Créer un événement',
        description: 'Crée un nouvel événement dans votre calendrier Google.',
        fields: [
          {
            name: 'summary',
            label: 'Titre',
            type: 'text',
            required: true,
            placeholder: "Réunion d'équipe",
          },
          {
            name: 'description',
            label: 'Description',
            type: 'textarea',
            required: false,
            placeholder: "Détails de l'événement...",
          },
          {
            name: 'startDateTime',
            label: 'Date de début',
            type: 'text',
            required: true,
            placeholder: '2025-01-15T09:00:00',
          },
          {
            name: 'endDateTime',
            label: 'Date de fin',
            type: 'text',
            required: true,
            placeholder: '2025-01-15T10:00:00',
          },
          {
            name: 'location',
            label: 'Lieu',
            type: 'text',
            required: false,
            placeholder: 'Salle de conférence',
          },
          {
            name: 'attendees',
            label: 'Participants (emails séparés par virgule)',
            type: 'text',
            required: false,
            placeholder: 'user1@exemple.com,user2@exemple.com',
          },
        ],
      },
      {
        id: 'gcalendar.listEvents',
        label: 'Lister les événements',
        description: 'Récupère les prochains événements de votre calendrier.',
        fields: [
          {
            name: 'maxResults',
            label: "Nombre maximum d'événements",
            type: 'text',
            required: false,
            placeholder: '10',
          },
        ],
      },
    ],
  },
  {
    id: 'gcontacts',
    name: 'Google Contacts',
    icon: '👤',
    actions: [
      {
        id: 'gcontacts.createContact',
        label: 'Créer un contact',
        description: 'Ajoute un nouveau contact dans Google Contacts.',
        fields: [
          { name: 'name', label: 'Nom complet', type: 'text', required: true, placeholder: 'Jean Dupont' },
          { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'jean.dupont@exemple.com' }
        ]
      }
    ]
  },
  {
    id: 'gmail-discord',
    name: 'Gmail + Discord',
    icon: '✉️💬',
    actions: [
      {
        id: 'gmailDiscord.sendEmailAndNotify',
        label: 'Envoyer un mail + notifier Discord',
        description: 'Envoie un mail via Gmail et notifie un salon Discord si succès.',
        fields: [
          { name: 'to', label: 'À', type: 'email', required: true, placeholder: 'destinataire@exemple.com' },
          { name: 'subject', label: 'Objet', type: 'text', required: true },
          { name: 'body', label: 'Contenu', type: 'textarea', required: true }
        ],
        successMessage: 'Mail envoyé et notification Discord envoyée !',
        errorMessage: "Erreur lors de l'envoi du mail ou de la notification Discord."
      }
    ]
  }
];

export const getServiceById = (id: string) =>
  SERVICES_CATALOG.find(s => s.id === id);
