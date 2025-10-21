import { gmailDiscordService } from "../../../services/gmailDiscordService";
import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useDashboardStore } from "../store/dashboard.store";
import { getServiceById } from "./servicesCatalog";
import { gmailService } from "../../../services/gmailService";
import { googleCalendarService } from "../../../services/googleCalendarService";
import { googleContactsService } from "../../../services/googleContactsService";

const RightSidebar: React.FC = () => {
  const { user } = useAuth();
  const {
    activeServices,
    selectedUid,
    selectActiveService,
    toggleConnection,
    setSelectedAction,
    setValue
  } = useDashboardStore();

  const [feedback, setFeedback] = useState<string | null>(null);

  const current = activeServices.find(s => s.uid === selectedUid);
  if (!current)
    return <aside className="cd-sidebar-right cd-sidebar-right--empty" />;

  const serviceDef = getServiceById(current.serviceId)!;
  const selectedAction = serviceDef.actions.find(
    a => a.id === current.selectedActionId
  );

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    window.setTimeout(() => setFeedback(null), 2500);
  };

  const handleTestAction = async () => {
    // Injecter le token d'authentification pour chaque appel API
    if (user && (window as any).apiService) {
      const token = localStorage.getItem('token');
      if (token) {
        (window as any).apiService.setAuthToken(token);
      }
    }
    if (!selectedAction) return;

    const values = (current.valuesByAction[selectedAction.id] ?? {}) as Record<
      string,
      string
    >;

    try {
            if (selectedAction.id === "gmail.sendEmail") {
              if (!values.to || !values.subject || !values.body) {
                showFeedback("❌ Veuillez remplir tous les champs requis");
                return;
              }

              setFeedback("📤 Envoi de l'email en cours...");
              await gmailService.sendEmail({
                to: values.to,
                subject: values.subject,
                body: values.body
              });
              showFeedback("✅ Email envoyé avec succès !");
            }
            else if (selectedAction.id === "gcalendar.createEvent") {
              if (!values.summary || !values.startDateTime || !values.endDateTime) {
                showFeedback("❌ Veuillez remplir les champs requis (titre, dates)");
                return;
              }

              setFeedback("📅 Création de l'événement en cours...");
              const attendeesArray = values.attendees 
                ? values.attendees.split(',').map(email => email.trim()).filter(e => e)
                : undefined;

              await googleCalendarService.createEvent({
                summary: values.summary,
                description: values.description || undefined,
                startDateTime: values.startDateTime,
                endDateTime: values.endDateTime,
                location: values.location || undefined,
                attendees: attendeesArray
              });
              showFeedback("✅ Événement créé avec succès !");
            }
            else if (selectedAction.id === "gcalendar.listEvents") {
              setFeedback("📅 Récupération des événements en cours...");
              const maxResults = values.maxResults ? parseInt(values.maxResults, 10) : undefined;
              const response = await googleCalendarService.listEvents(maxResults);
        
              if (response.events && response.events.length > 0) {
                showFeedback(`✅ ${response.events.length} événement(s) récupéré(s) !`);
              } else {
                showFeedback("ℹ️ Aucun événement trouvé.");
              }
            }
            else if (selectedAction.id === "gcontacts.createContact") {
              if (!values.name || !values.email) {
                showFeedback("❌ Veuillez remplir tous les champs requis");
                return;
              }

              setFeedback("👤 Création du contact en cours...");
              await googleContactsService.createContact({
                name: values.name,
                email: values.email
              });
              showFeedback("✅ Contact créé avec succès !");

            }
            else if (selectedAction.id === "gmailDiscord.sendEmailAndNotify") {
              if (!values.to || !values.subject || !values.body) {
                showFeedback("❌ Veuillez remplir tous les champs requis");
                return;
              }
              setFeedback("✉️💬 Envoi du mail et notification Discord en cours...");
              await gmailDiscordService.sendEmailAndNotify({
                to: values.to,
                subject: values.subject,
                body: values.body
              });
              showFeedback("✅ Mail envoyé et notification Discord envoyée !");
            } else {
              showFeedback("⚠️ Action non implémentée (mock).");
            }
    } catch (error) {
      showFeedback(`❌ Erreur : ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  return (
    <aside className="cd-sidebar-right">
      <header className="cd-sidebar-header">
        <h3>Configurer : {current.name}</h3>
        <button
          className="cd-btn cd-btn-ghost"
          onClick={() => selectActiveService(undefined)}
        >
          ✕
        </button>
      </header>

      <section className="cd-section">
        <h4>Connexion</h4>
        <p className="cd-muted">
          {current.connected
            ? 'Ce service est connecté. Vous pouvez configurer les actions.'
            : 'Ce service n’est pas encore connecté.'}
        </p>
        <button
          className={`cd-btn ${current.connected ? 'cd-btn-secondary' : 'cd-btn-primary'}`}
          onClick={() => {
            toggleConnection(current.uid, !current.connected);
            showFeedback(
              current.connected ? 'Service déconnecté.' : 'Service connecté !'
            );
          }}
        >
          {current.connected ? 'Déconnecter' : 'Se connecter'}
        </button>
      </section>

      <section className="cd-section">
        <h4>Actions disponibles</h4>
        <div className="cd-actions-list">
          {serviceDef.actions.map(a => (
            <button
              key={a.id}
              className={`cd-action-item ${current.selectedActionId === a.id ? 'is-active' : ''}`}
              onClick={() => setSelectedAction(current.uid, a.id)}
              disabled={!current.connected}
              title={!current.connected ? "Connectez d'abord le service" : ''}
            >
              {a.label}
            </button>
          ))}
        </div>
      </section>

      {selectedAction && (
        <section className="cd-section">
          <h4>Paramètres : {selectedAction.label}</h4>
          <form
            className="cd-form"
            onSubmit={e => {
              e.preventDefault();
              showFeedback('Configuration enregistrée (mock).');
            }}
          >
            {selectedAction.fields.map(f => {
              const values = (current.valuesByAction[selectedAction.id] ??
                {}) as Record<string, unknown>;
              const v = values[f.name] as string | boolean | undefined;
              return (
                <div className="cd-field" key={f.name}>
                  <label htmlFor={f.name}>
                    {f.label}
                    {f.required ? ' *' : ''}
                  </label>
                  {f.type === 'textarea' ? (
                    <textarea
                      id={f.name}
                      placeholder={f.placeholder}
                      value={(v as string) ?? ''}
                      onChange={e =>
                        setValue(
                          current.uid,
                          selectedAction.id,
                          f.name,
                          e.target.value
                        )
                      }
                    />
                  ) : f.type === 'toggle' ? (
                    <input
                      id={f.name}
                      type="checkbox"
                      checked={Boolean(v)}
                      onChange={e =>
                        setValue(
                          current.uid,
                          selectedAction.id,
                          f.name,
                          e.target.checked
                        )
                      }
                    />
                  ) : f.type === "datetime-local" ? (
                    <input
                      id={f.name}
                      type="datetime-local"
                      value={(v as string) ?? ""}
                      onChange={(e) => setValue(current.uid, selectedAction.id, f.name, e.target.value)}
                    />
                  ) : (
                    <input
                      id={f.name}
                      type={f.type === 'email' ? 'email' : 'text'}
                      placeholder={f.placeholder}
                      value={(v as string) ?? ''}
                      onChange={e =>
                        setValue(
                          current.uid,
                          selectedAction.id,
                          f.name,
                          e.target.value
                        )
                      }
                    />
                  )}
                </div>
              );
            })}
            <div className="cd-form-actions">
              <button
                className="cd-btn cd-btn-secondary"
                type="button"
                onClick={handleTestAction}
              >
                Tester
              </button>
              <button className="cd-btn cd-btn-primary" type="submit">
                Enregistrer
              </button>
            </div>
          </form>
          {feedback && (
            <p className="cd-muted" style={{ marginTop: 8 }}>
              {feedback}
            </p>
          )}
        </section>
      )}
    </aside>
  );
};

export default RightSidebar;
