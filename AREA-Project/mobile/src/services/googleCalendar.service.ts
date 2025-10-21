import { api } from './api';

export interface CalendarEvent {
  summary: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  attendees?: string[];
}

export interface CalendarEventResponse {
  success: boolean;
  eventId?: string;
  eventLink?: string;
  message: string;
}

export interface EventsListResponse {
  success: boolean;
  events: any[];
}

class GoogleCalendarService {
  /**
   * Créer un événement dans Google Calendar
   */
  async createEvent(eventData: CalendarEvent): Promise<CalendarEventResponse> {
    try {
      const { data } = await api.post('/google-calendar/create-event', eventData);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création de l\'événement');
    }
  }

  /**
   * Récupérer la liste des événements Google Calendar
   */
  async listEvents(maxResults: number = 10): Promise<EventsListResponse> {
    try {
      const { data } = await api.get(`/google-calendar/events?maxResults=${maxResults}`);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des événements');
    }
  }
}

export const googleCalendarService = new GoogleCalendarService();