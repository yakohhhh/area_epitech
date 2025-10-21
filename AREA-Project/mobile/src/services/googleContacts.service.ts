import { api } from './api';

export interface CreateContactRequest {
  name: string;
  email: string;
}

export interface ContactResponse {
  success?: boolean;
  message?: string;
  contactId?: string;
}

export interface OAuthUrlResponse {
  url: string;
}

export interface OAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}

class GoogleContactsService {
  /**
   * Créer un contact dans Google Contacts
   */
  async createContact(contactData: CreateContactRequest): Promise<ContactResponse> {
    try {
      const { data } = await api.post('/google-contacts/create', contactData);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du contact');
    }
  }

  /**
   * Générer l'URL d'authentification OAuth Google
   */
  async getOAuthUrl(): Promise<string> {
    try {
      // Redirection vers l'endpoint OAuth du backend
      const baseURL = api.defaults.baseURL || 'http://localhost:5001';
      return `${baseURL}/google-contacts/oauth/login`;
    } catch (error: any) {
      throw new Error('Erreur lors de la génération de l\'URL OAuth');
    }
  }

  /**
   * Gérer le callback OAuth (pour traitement côté backend)
   */
  async handleOAuthCallback(code: string): Promise<OAuthTokenResponse> {
    try {
      const { data } = await api.get(`/google-contacts/oauth/callback?code=${code}`);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors du traitement OAuth');
    }
  }
}

export const googleContactsService = new GoogleContactsService();