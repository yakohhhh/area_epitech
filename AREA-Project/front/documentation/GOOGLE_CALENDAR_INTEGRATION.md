# Google Calendar Integration - ConnectedDashboard

## Vue d'ensemble

L'intégration Google Calendar permet aux utilisateurs de créer des événements et de lister leurs événements directement depuis le ConnectedDashboard de l'application AREA.

## Architecture

### Backend (NestJS)

**Contrôleur:** `back/src/googleCalendar/googleCalendar.controller.ts`
- `POST /google-calendar/create-event` - Crée un événement
- `GET /google-calendar/events` - Liste les événements

**Service:** `back/src/googleCalendar/googleCalendar.service.ts`
- `createEvent()` - Utilise l'API Google Calendar v3
- `listEvents()` - Récupère les événements à venir

**Authentification:**
- OAuth2 avec refresh token (variable d'environnement `GOOGLE_REFRESH_TOKEN`)
- Scopes requis: `https://www.googleapis.com/auth/calendar`

### Frontend (React + TypeScript)

**Service:** `front/src/services/googleCalendarService.ts`
- `createEvent(eventData)` - Envoie une requête POST pour créer un événement
- `listEvents(maxResults?)` - Envoie une requête GET pour lister les événements

**Interface utilisateur:**
- Catalogue de services: `servicesCatalog.ts` - Définit les actions disponibles
- Sidebar: `RightSidebar.tsx` - Gère l'interface de configuration et les tests

## Utilisation dans le Dashboard

### 1. Ajouter le service
- Glisser-déposer "Google Calendar 📅" depuis le catalogue vers la zone de travail

### 2. Connecter le service
- Cliquer sur le service ajouté
- Cliquer sur "Se connecter" dans la sidebar droite
- Note: La connexion utilise automatiquement le refresh token configuré

### 3. Créer un événement

**Champs requis:**
- **Titre** (summary): Nom de l'événement
- **Date de début** (startDateTime): Format ISO 8601 (ex: `2025-01-15T09:00:00`)
- **Date de fin** (endDateTime): Format ISO 8601 (ex: `2025-01-15T10:00:00`)

**Champs optionnels:**
- **Description**: Détails de l'événement
- **Lieu** (location): Adresse ou nom du lieu
- **Participants** (attendees): Emails séparés par virgules (ex: `user1@exemple.com,user2@exemple.com`)

**Étapes:**
1. Sélectionner l'action "Créer un événement"
2. Remplir les champs du formulaire
3. Cliquer sur "Tester" pour créer l'événement immédiatement
4. Feedback affiché: "✅ Événement créé avec succès !"

### 4. Lister les événements

**Champs optionnels:**
- **Nombre maximum d'événements** (maxResults): Par défaut 10

**Étapes:**
1. Sélectionner l'action "Lister les événements"
2. (Optionnel) Spécifier le nombre d'événements à récupérer
3. Cliquer sur "Tester"
4. Les événements sont affichés dans la console du navigateur
5. Feedback: "✅ X événement(s) récupéré(s) !"

## API Backend

### POST /google-calendar/create-event

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "summary": "Réunion d'équipe",
  "description": "Discussion sur le projet AREA",
  "startDateTime": "2025-01-15T09:00:00",
  "endDateTime": "2025-01-15T10:00:00",
  "location": "Salle de conférence A",
  "attendees": ["user1@exemple.com", "user2@exemple.com"]
}
```

**Response (200):**
```json
{
  "success": true,
  "event": {
    "id": "event_id_123",
    "summary": "Réunion d'équipe",
    "start": { "dateTime": "2025-01-15T09:00:00Z" },
    "end": { "dateTime": "2025-01-15T10:00:00Z" },
    "htmlLink": "https://calendar.google.com/calendar/event?eid=..."
  }
}
```

### GET /google-calendar/events

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `maxResults` (optional): Nombre maximum d'événements à retourner (défaut: 10)

**Example:**
```
GET /google-calendar/events?maxResults=5
```

**Response (200):**
```json
{
  "success": true,
  "events": [
    {
      "id": "event_id_123",
      "summary": "Réunion d'équipe",
      "start": { "dateTime": "2025-01-15T09:00:00Z" },
      "end": { "dateTime": "2025-01-15T10:00:00Z" },
      "location": "Salle de conférence A"
    },
    {
      "id": "event_id_456",
      "summary": "Présentation client",
      "start": { "dateTime": "2025-01-16T14:00:00Z" },
      "end": { "dateTime": "2025-01-16T15:30:00Z" }
    }
  ]
}
```

## Tests

### Test manuel via l'interface

1. **Démarrer l'application:**
   ```bash
   cd AREA-Project
   docker-compose up -d
   # Ou en mode développement:
   ./dev.sh
   ```

2. **Accéder au dashboard:**
   - Ouvrir http://localhost:3000
   - Se connecter avec un compte Google

3. **Tester la création d'événement:**
   - Ajouter le service Google Calendar
   - Connecter le service
   - Remplir le formulaire de création d'événement
   - Cliquer sur "Tester"
   - Vérifier dans Google Calendar que l'événement a été créé

4. **Tester la liste des événements:**
   - Sélectionner "Lister les événements"
   - Cliquer sur "Tester"
   - Ouvrir la console du navigateur (F12)
   - Vérifier que les événements sont affichés

### Test manuel via API (curl)

**Créer un événement:**
```bash
curl -X POST http://localhost:5001/google-calendar/create-event \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "summary": "Test Event",
    "startDateTime": "2025-01-20T10:00:00",
    "endDateTime": "2025-01-20T11:00:00"
  }'
```

**Lister les événements:**
```bash
curl http://localhost:5001/google-calendar/events?maxResults=5 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Configuration

### Variables d'environnement (Backend)

Dans `back/.env`:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
```

### Obtenir un refresh token

Utiliser le script fourni:
```bash
cd back
node get-refresh-token.js
```

Ou suivre le guide: https://developers.google.com/identity/protocols/oauth2/web-server

## Gestion des erreurs

### Erreurs courantes

**401 Unauthorized:**
- Cause: Token JWT invalide ou expiré
- Solution: Se reconnecter à l'application

**400 Bad Request:**
- Cause: Données manquantes ou format de date invalide
- Solution: Vérifier que les champs requis sont remplis et que les dates sont au format ISO 8601

**403 Forbidden:**
- Cause: Refresh token invalide ou révoqué
- Solution: Regénérer un nouveau refresh token avec `get-refresh-token.js`

**500 Internal Server Error:**
- Cause: Erreur Google Calendar API (quota dépassé, calendrier non accessible)
- Solution: Vérifier les logs backend et les quotas de l'API Google

### Feedback utilisateur

Le RightSidebar affiche des messages de feedback:
- 📅 "Création de l'événement en cours..." (pendant la requête)
- ✅ "Événement créé avec succès !" (succès)
- ❌ "Erreur : [message]" (échec)
- ℹ️ "Aucun événement trouvé." (liste vide)

## Améliorations futures

1. **Affichage des événements dans l'interface**
   - Créer un composant pour afficher les événements listés
   - Ajouter une vue calendrier interactive

2. **Gestion avancée des événements**
   - Modifier un événement existant
   - Supprimer un événement
   - Gérer les événements récurrents

3. **Rappels et notifications**
   - Configurer des rappels pour les événements
   - Notifications push avant un événement

4. **Gestion multi-calendriers**
   - Sélectionner un calendrier spécifique
   - Créer des événements dans différents calendriers

5. **Import/Export**
   - Importer des événements depuis iCal
   - Exporter des événements

## Ressources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/v3/reference)
- [OAuth 2.0 Google](https://developers.google.com/identity/protocols/oauth2)
- [Backend Controller](../back/src/googleCalendar/googleCalendar.controller.ts)
- [Backend Service](../back/src/googleCalendar/googleCalendar.service.ts)
- [Frontend Service](./src/services/googleCalendarService.ts)
