const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export interface CalendarEventRequest {
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

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

export interface EventsListResponse {
  success: boolean;
  events: CalendarEvent[];
}

class GoogleCalendarService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur réseau est survenue');
    }
  }

  async createEvent(
    eventData: CalendarEventRequest
  ): Promise<CalendarEventResponse> {
    return this.makeRequest<CalendarEventResponse>(
      '/google-calendar/create-event',
      {
        method: 'POST',
        body: JSON.stringify(eventData),
      }
    );
  }

  async listEvents(maxResults: number = 10): Promise<EventsListResponse> {
    return this.makeRequest<EventsListResponse>(
      `/google-calendar/events?maxResults=${maxResults}`
    );
  }
}

export const googleCalendarService = new GoogleCalendarService();
