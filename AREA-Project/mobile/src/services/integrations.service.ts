import { api } from './api';
import { googleCalendarService, CalendarEvent } from './googleCalendar.service';
import { googleContactsService, CreateContactRequest } from './googleContacts.service';
import { emailService, SendEmailRequest } from './email.service';

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'available' | 'coming-soon';
  category: string;
  actions: IntegrationAction[];
}

export interface IntegrationAction {
  id: string;
  name: string;
  description: string;
  type: 'trigger' | 'action';
  params: ActionParam[];
}

export interface ActionParam {
  id: string;
  name: string;
  type: 'text' | 'email' | 'datetime' | 'select';
  required: boolean;
  options?: string[];
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: {
    integrationId: string;
    actionId: string;
    params: Record<string, any>;
  };
  actions: Array<{
    integrationId: string;
    actionId: string;
    params: Record<string, any>;
  }>;
  status: 'active' | 'inactive';
  lastRun?: string;
  runCount: number;
}

class IntegrationsService {
  /**
   * Récupérer la liste des intégrations disponibles
   */
  async getAvailableIntegrations(): Promise<Integration[]> {
    // Pour l'instant, retourne des données statiques basées sur les services backend disponibles
    return [
      {
        id: 'google-calendar',
        name: 'Google Calendar',
        description: 'Créez et gérez vos événements Google Calendar',
        icon: '📅',
        status: 'connected',
        category: 'Productivité',
        actions: [
          {
            id: 'create-event',
            name: 'Créer un événement',
            description: 'Crée un nouvel événement dans votre calendrier',
            type: 'action',
            params: [
              { id: 'summary', name: 'Titre', type: 'text', required: true },
              { id: 'description', name: 'Description', type: 'text', required: false },
              { id: 'startDateTime', name: 'Date/heure de début', type: 'datetime', required: true },
              { id: 'endDateTime', name: 'Date/heure de fin', type: 'datetime', required: true },
              { id: 'location', name: 'Lieu', type: 'text', required: false }
            ]
          },
          {
            id: 'list-events',
            name: 'Lister les événements',
            description: 'Récupère la liste de vos événements à venir',
            type: 'trigger',
            params: [
              { id: 'maxResults', name: 'Nombre maximum', type: 'text', required: false }
            ]
          }
        ]
      },
      {
        id: 'google-contacts',
        name: 'Google Contacts',
        description: 'Gérez vos contacts Google',
        icon: '👥',
        status: 'connected',
        category: 'Contacts',
        actions: [
          {
            id: 'create-contact',
            name: 'Créer un contact',
            description: 'Ajoute un nouveau contact à votre carnet d\'adresses',
            type: 'action',
            params: [
              { id: 'name', name: 'Nom', type: 'text', required: true },
              { id: 'email', name: 'Email', type: 'email', required: true }
            ]
          }
        ]
      },
      {
        id: 'email',
        name: 'Email',
        description: 'Envoyez des emails automatiquement',
        icon: '📧',
        status: 'connected',
        category: 'Communication',
        actions: [
          {
            id: 'send-email',
            name: 'Envoyer un email',
            description: 'Envoie un email à une adresse spécifiée',
            type: 'action',
            params: [
              { id: 'to', name: 'Destinataire', type: 'email', required: true },
              { id: 'subject', name: 'Sujet', type: 'text', required: true },
              { id: 'body', name: 'Corps du message', type: 'text', required: true }
            ]
          }
        ]
      },
      {
        id: 'slack',
        name: 'Slack',
        description: 'Intégration avec Slack (à venir)',
        icon: '💬',
        status: 'coming-soon',
        category: 'Communication',
        actions: []
      },
      {
        id: 'discord',
        name: 'Discord',
        description: 'Intégration avec Discord (à venir)',
        icon: '🎮',
        status: 'coming-soon',
        category: 'Communication',
        actions: []
      }
    ];
  }

  /**
   * Tester une intégration
   */
  async testIntegration(integrationId: string, actionId: string, params: Record<string, any>): Promise<any> {
    switch (integrationId) {
      case 'google-calendar':
        if (actionId === 'create-event') {
          return await googleCalendarService.createEvent(params as CalendarEvent);
        } else if (actionId === 'list-events') {
          return await googleCalendarService.listEvents(params.maxResults || 10);
        }
        break;
      
      case 'google-contacts':
        if (actionId === 'create-contact') {
          return await googleContactsService.createContact(params as CreateContactRequest);
        }
        break;
      
      case 'email':
        if (actionId === 'send-email') {
          return await emailService.sendEmail(params as SendEmailRequest);
        }
        break;
      
      default:
        throw new Error(`Intégration ${integrationId} non supportée`);
    }
  }

  /**
   * Connecter une intégration (OAuth flow)
   */
  async connectIntegration(integrationId: string): Promise<string> {
    switch (integrationId) {
      case 'google-contacts':
        return await googleContactsService.getOAuthUrl();
      
      default:
        throw new Error(`Connexion ${integrationId} non supportée`);
    }
  }
}

class AutomationsService {
  /**
   * Récupérer la liste des automatisations (mock pour l'instant)
   */
  async getAutomations(): Promise<Automation[]> {
    // Pour l'instant, retourne des données d'exemple
    return [
      {
        id: '1',
        name: 'Email vers Calendrier',
        description: 'Crée un événement de calendrier quand un email important arrive',
        trigger: {
          integrationId: 'email',
          actionId: 'receive-email',
          params: { subject: 'URGENT' }
        },
        actions: [
          {
            integrationId: 'google-calendar',
            actionId: 'create-event',
            params: {
              summary: 'Email urgent reçu',
              description: 'Traiter l\'email urgent'
            }
          }
        ],
        status: 'active',
        lastRun: '2025-10-07T10:30:00Z',
        runCount: 12
      }
    ];
  }

  /**
   * Créer une nouvelle automatisation
   */
  async createAutomation(automation: Omit<Automation, 'id' | 'runCount' | 'lastRun'>): Promise<Automation> {
    // Pour l'instant, simulation de création
    const newAutomation: Automation = {
      ...automation,
      id: Date.now().toString(),
      runCount: 0
    };
    
    return newAutomation;
  }

  /**
   * Exécuter une automatisation manuellement
   */
  async runAutomation(automationId: string): Promise<{ success: boolean; message: string }> {
    // Simulation d'exécution
    return {
      success: true,
      message: `Automatisation ${automationId} exécutée avec succès`
    };
  }
}

export const integrationsService = new IntegrationsService();
export const automationsService = new AutomationsService();