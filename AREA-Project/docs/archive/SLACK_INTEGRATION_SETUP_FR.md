# Guide de Configuration de l'Intégration Slack

## Aperçu

Ce guide explique comment configurer et utiliser l'intégration Slack dans l'application AREA. L'intégration permet d'envoyer automatiquement des notifications à Slack lorsque des événements Google Calendar sont créés.

## Fonctionnalités

- ✅ Authentification OAuth2 avec Slack
- ✅ Notifications automatiques lors de la création d'événements Google Calendar
- ✅ Messages formatés avec détails de l'événement (titre, description, heures de début/fin, lieu)
- ✅ Support des canaux personnalisés
- ✅ Stockage sécurisé des tokens dans la base de données

## Prérequis

- Un espace de travail Slack (gratuit ou payant)
- Accès pour créer des applications Slack
- Backend en cours d'exécution sur le port 5001 (ou port configuré)
- ngrok installé (pour les tests HTTPS locaux)

## Étapes de Configuration

### 1. Créer une Application Slack

1. Allez à [Slack API Dashboard](https://api.slack.com/apps)
2. Cliquez sur **"Create New App"** → **"From scratch"**
3. Nom de l'application: `AREA`
4. Sélectionnez votre espace de travail
5. Cliquez sur **"Create App"**

### 2. Configurer l'Utilisateur Bot

1. Allez à **"App Home"** dans la barre latérale
2. Faites défiler jusqu'à **"Your App's Presence"**
3. Cliquez sur **"Add a Bot User"**
4. Configurez le nom d'affichage du bot et les paramètres
5. Cliquez sur **"Add Bot User"**

### 3. Ajouter les Portées OAuth

1. Allez à **"OAuth & Permissions"** dans la barre latérale
2. Faites défiler jusqu'à **"Bot Token Scopes"**
3. Cliquez sur **"Add an OAuth Scope"** et ajoutez ces portées:
   - `chat:write` - Envoyer des messages
   - `channels:read` - Lire les informations des canaux
   - `users:read` - Lire les informations des utilisateurs
4. Cliquez sur **"Save"**

### 4. Ajouter l'URL de Redirection

1. Restez sur la page **"OAuth & Permissions"**
2. Faites défiler jusqu'à **"Redirect URLs"**
3. Cliquez sur **"Add New Redirect URL"**
4. Ajoutez l'URL de rappel (voir Local vs Production ci-dessous)
5. Cliquez sur **"Save URLs"**

### 5. Installer l'Application dans l'Espace de Travail

1. Cliquez sur **"Install App to Workspace"** en haut
2. Vérifiez les permissions
3. Cliquez sur **"Allow"**
4. Vous obtiendrez un **Bot User OAuth Token** (commence par `xoxb-`)
5. Copiez ce token pour la configuration

### 6. Créer le Canal de Notification

1. Dans Slack, créez un nouveau canal: `#area-notifications`
2. Ajoutez le bot à ce canal:
   - Cliquez sur le nom du canal
   - Allez à l'onglet **"Integrations"**
   - Cliquez sur **"Add an app"**
   - Sélectionnez **"AREA"**
   - Cliquez sur **"Add"**

## Configuration

### Développement Local (avec ngrok)

```bash
# Installer ngrok
brew install ngrok

# Démarrer le tunnel ngrok
ngrok http 5001

# Copiez l'URL HTTPS (ex: https://abc123.ngrok-free.dev)
```

Mettez à jour `back/.env`:
```properties
SLACK_CLIENT_ID=votre_id_client_slack
SLACK_CLIENT_SECRET=votre_secret_client_slack
SLACK_REDIRECT_URL=https://abc123.ngrok-free.dev/slack/callback
```

Mettez à jour les paramètres de l'application Slack:
- OAuth & Permissions → Redirect URLs
- Remplacez par votre URL ngrok: `https://abc123.ngrok-free.dev/slack/callback`
- Enregistrez et réinstallez l'application

### Déploiement en Production

Lors du déploiement en production (Railway, Render, etc.):

```properties
SLACK_CLIENT_ID=votre_id_client_slack
SLACK_CLIENT_SECRET=votre_secret_client_slack
SLACK_REDIRECT_URL=https://votredomaine.com/slack/callback
```

Mettez à jour l'URL de redirection Slack vers votre domaine de production.

## Points de Terminaison API

### 1. Obtenir l'URL d'Authentification Slack
```bash
GET /slack/auth-url
Authorization: Bearer {JWT_TOKEN}
```

**Réponse:**
```json
{
  "authUrl": "https://slack.com/oauth/v2/authorize?client_id=...&scope=...&redirect_uri=...&state=19"
}
```

**Utilisation:**
- Ouvrez l'URL retournée dans le navigateur
- Cliquez sur "Allow" pour autoriser
- Le token est automatiquement sauvegardé dans la base de données

### 2. Rappel OAuth Slack
```
GET /slack/callback?code={code}&state={userId}
```

**Automatiquement appelé par Slack** après que l'utilisateur autorise. Aucune action manuelle n'est nécessaire.

### 3. Envoyer une Notification de Test
```bash
POST /slack/send-notification
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "message": "Notification de test",
  "channel": "area-notifications"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Notification envoyée"
}
```

## Intégration Google Calendar

Lorsqu'un utilisateur crée un événement Google Calendar, une notification Slack est automatiquement envoyée:

```bash
POST /google-calendar/create-event
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "summary": "Réunion d'équipe",
  "description": "Discuter des plans Q4",
  "startDateTime": "2025-10-22T14:00:00Z",
  "endDateTime": "2025-10-22T15:00:00Z",
  "location": "Salle de Conférence A"
}
```

**Message Slack Reçu:**
```
📅 *Nouvel événement créé*

*Titre:* Réunion d'équipe
*Description:* Discuter des plans Q4
*Début:* 22/10/2025 14:00:00
*Fin:* 22/10/2025 15:00:00
*Lieu:* Salle de Conférence A
```

## Flux d'Authentification Utilisateur

1. **L'utilisateur se connecte** à l'application AREA
2. **L'utilisateur clique sur "Connecter Slack"**
3. **Le backend retourne une URL OAuth** avec l'ID utilisateur dans le paramètre d'état
4. **L'utilisateur est redirigé vers Slack** pour autoriser l'application
5. **Slack redirige** vers l'URL de rappel avec le code d'authentification
6. **Le backend échange le code pour un token** et le stocke dans la base de données
7. **L'utilisateur est maintenant connecté** - peut recevoir des notifications Slack

## Schéma de Base de Données

Les tokens Slack sont stockés dans la table `user_service`:

```sql
CREATE TABLE user_service (
  id INTEGER PRIMARY KEY,
  userId INTEGER NOT NULL,
  serviceId INTEGER NOT NULL,
  oauthToken TEXT NOT NULL,
  config TEXT, -- Configuration JSON (teamId, teamName, userId)
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (userId) REFERENCES user(id),
  FOREIGN KEY (serviceId) REFERENCES service(id)
);
```

## Dépannage

### Erreur: "channel_not_found"
- **Solution:** Assurez-vous que le bot est ajouté au canal `#area-notifications`
- Vérifiez Slack → Détails du canal → Integrations → Ajouter des applications → AREA

### Erreur: "not_in_channel"
- **Solution:** Identique à ci-dessus - le bot doit être invité au canal

### Erreur: "Utilisateur non connecté avec Slack ou token manquant"
- **Solution:** L'utilisateur n'a pas complété l'authentification OAuth2
- Dirigez l'utilisateur vers le point de terminaison `/slack/auth-url` et complétez l'autorisation

### La Redirection OAuth Échoue
- **Solution:** Vérifiez que l'URL de redirection correspond exactement dans:
  1. Fichier `.env` (`SLACK_REDIRECT_URL`)
  2. Paramètres de l'application Slack (OAuth & Permissions → Redirect URLs)
- Pour localhost: utilisez ngrok pour HTTPS

### L'URL ngrok change au redémarrage
- **Solution:** Mettez à niveau vers un plan payant ngrok pour une URL permanente, OU
- Mettez à jour l'URL de redirection Slack après chaque redémarrage de ngrok

## Architecture

```
┌─────────────────┐
│   Utilisateur   │
│     (Web)       │
└────────┬────────┘
         │
         ├─ POST /auth/login
         │
         ├─ GET /slack/auth-url
         │ (retourne l'URL OAuth)
         │
         └─ L'utilisateur ouvre l'URL et autorise
                    │
                    ▼
            ┌──────────────────┐
            │  Slack OAuth     │
            │  (via ngrok)     │
            └─────────┬────────┘
                      │
                      ├─ Redirige vers le callback
                      │
                      ▼
            ┌──────────────────┐
            │ GET /slack/      │
            │ callback?code=..│
            │ &state=..        │
            └─────────┬────────┘
                      │
                      ├─ Échange le code pour un token
                      │
                      ├─ Stocke le token en BD
                      │
                      ▼
            ┌──────────────────┐
            │  Token Stocké    │
            │ Utilisateur Connecté│
            └──────────────────┘
```

## Fichiers de Service

- `back/src/slack/slack.service.ts` - Logique principale Slack
- `back/src/slack/slack.controller.ts` - Points de terminaison HTTP
- `back/src/slack/slack.module.ts` - Module NestJS
- `back/src/googleCalendar/googleCalendar.controller.ts` - Intégration avec Google Calendar

## Tests

```bash
# 1. Obtenir un token JWT frais
JWT_TOKEN=$(curl -s -X POST http://localhost:5001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' | jq -r '.access_token')

# 2. Obtenir l'URL d'authentification
curl -s -X GET http://localhost:5001/slack/auth-url \
  -H "Authorization: Bearer $JWT_TOKEN" | jq '.authUrl'

# 3. Ouvrir l'URL retournée et autoriser

# 4. Créer un événement de test
curl -s -X POST http://localhost:5001/google-calendar/create-event \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "summary": "Événement de Test",
    "description": "Test de notification Slack",
    "startDateTime": "2025-10-22T14:00:00Z",
    "endDateTime": "2025-10-22T15:00:00Z"
  }' | jq '.'

# 5. Vérifiez le canal Slack #area-notifications pour la notification
```

## Variables d'Environnement

```properties
# Requis
SLACK_CLIENT_ID=votre_id_client_slack
SLACK_CLIENT_SECRET=votre_secret_client_slack
SLACK_REDIRECT_URL=https://votredomaine.com/slack/callback

# Optionnel
# Canal par défaut pour les notifications (actuellement codé en dur à 'area-notifications')
```

## Support

Pour les problèmes ou questions:
1. Consultez la section Dépannage ci-dessus
2. Vérifiez les journaux du backend: `docker logs area_backend_dev`
3. Vérifiez les journaux de l'application Slack: https://api.slack.com/apps/{YOUR_APP_ID}/logs
4. Vérifiez que le token OAuth est stocké: vérifiez la table `user_service` dans la base de données

## Améliorations Futures

- [ ] Canal personnalisé par utilisateur
- [ ] Options de formatage des messages (texte riche, boutons, etc.)
- [ ] Support pour les autres événements Google Calendar (mise à jour, suppression, etc.)
- [ ] Support des commandes Slack
- [ ] Intégration des commandes slash pour les commandes AREA dans Slack
