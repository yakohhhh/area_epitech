// features/ConnectedDashboard/types.ts
export type ServiceId = "gmail" | "gcalendar" | "gcontacts" | "gmail-discord";

export interface Service {
  id: ServiceId;
  name: string;
  description?: string;
  icon?: string; // optionnel (emoji / url)
  actions: ActionDescriptor[];
}

export type FieldType = "text" | "textarea" | "toggle" | "email" | "datetime-local";

export interface ActionField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
}

export interface ActionDescriptor {
  id: string; // ex: slack.sendMessage
  label: string;
  description?: string;
  fields: ActionField[];
  successMessage?: string;
  errorMessage?: string;
}

export interface ActiveService {
  uid: string; // unique (pour la liste au centre)
  serviceId: ServiceId;
  connected: boolean;
  name: string;
  selectedActionId?: string;
  valuesByAction: Record<string, Record<string, unknown>>;
}
