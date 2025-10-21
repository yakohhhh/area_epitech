import { authService } from "./authService";

export interface GmailDiscordPayload {
  to: string;
  subject: string;
  body: string;
}

export interface GmailDiscordResponse {
  success: boolean;
}

class GmailDiscordService {
  async sendEmailAndNotify(payload: GmailDiscordPayload): Promise<GmailDiscordResponse> {
    const discordChannelId = "1427942910061449287";
    const token = localStorage.getItem('token');
    return authService["makeRequest"]<GmailDiscordResponse>(
      "/gmail-discord/send-mail-and-notify",
      {
        method: "POST",
        body: JSON.stringify({ ...payload, discordChannelId }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export const gmailDiscordService = new GmailDiscordService();
