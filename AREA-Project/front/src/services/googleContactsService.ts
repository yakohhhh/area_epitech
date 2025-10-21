const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export interface CreateContactRequest {
  name: string;
  email: string;
}

export interface CreateContactResponse {
  success: boolean;
  contact?: Record<string, unknown>;
  message: string;
}

class GoogleContactsService {
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

  async createContact(
    contactData: CreateContactRequest
  ): Promise<CreateContactResponse> {
    return this.makeRequest<CreateContactResponse>('/google-contacts/create', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }
}

export const googleContactsService = new GoogleContactsService();
