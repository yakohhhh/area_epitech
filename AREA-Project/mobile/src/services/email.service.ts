import { api } from './api';

export interface SendEmailRequest {
  to: string;
  subject: string;
  body: string;
}

export interface EmailResponse {
  message: string;
  success?: boolean;
}

class EmailService {
  /**
   * Envoyer un email
   */
  async sendEmail(emailData: SendEmailRequest): Promise<EmailResponse> {
    try {
      const { data } = await api.post('/email/send', emailData);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi de l\'email');
    }
  }
}

export const emailService = new EmailService();