# AREA Project - Documentation Centrale

**Dernière mise à jour** : 21 octobre 2025

## 📚 Table des matières

### 🚀 Démarrage Rapide
- [Guide de démarrage](#guide-de-démarrage)
- [Installation](#installation)
- [Configuration](#configuration)

### 🏗️ Architecture
- [Vue d'ensemble](#architecture-générale)
- [Backend (NestJS)](#backend)
- [Frontend (React)](#frontend)
- [Mobile (Ionic)](#mobile)

### 🔧 Développement
- [Setup environnement](#setup-développement)
- [CI/CD](#cicd)
- [Git Hooks](#git-hooks)
- [Tests](#tests)

### 🔌 Intégrations
- [Gmail](#gmail-integration)
- [Google Calendar](#google-calendar)
- [Google Contacts](#google-contacts)
- [Slack](#slack) *(En cours)*

### 📖 Guides
- [Authentication](#authentification)
- [Mobile Backend Integration](#mobile-backend)
- [Sécurité](#sécurité)

---

## Guide de démarrage

### Installation rapide

```bash
# 1. Cloner le repo
git clone git@github.com:yakohhhh/area_epitech.git
cd area_epitech

# 2. Installer les hooks Git
./AREA-Project/scripts/setup-hooks.sh

# 3. Lancer tous les services
./start-all-final.sh
```

### Prérequis

- **Node.js** : v20+
- **npm** : v10+
- **Docker** : v24+ (optionnel)
- **PostgreSQL** : v14+ (ou SQLite en dev)

---

## Architecture Générale

### Stack Technique

```
┌─────────────────────────────────────────────┐
│                                             │
│  Mobile (Ionic React)   Frontend (React)   │
│      :5175                  :3000           │
│         │                     │             │
│         └─────────┬───────────┘             │
│                   │                         │
│                   ▼                         │
│         Backend (NestJS :5001)              │
│                   │                         │
│         ┌─────────┴─────────┐               │
│         │                   │               │
│    PostgreSQL          Google APIs          │
│    (Prisma)         (Gmail, Calendar, etc)  │
│                                             │
└─────────────────────────────────────────────┘
```

### Services

- **Backend** : API REST NestJS + Prisma ORM
- **Frontend** : React 18 + TypeScript + Vite
- **Mobile** : Ionic React + Capacitor
- **Base de données** : PostgreSQL (prod) / SQLite (dev)

---

## Backend

### Structure

```
back/
├── src/
│   ├── auth/          # Authentification (JWT, OAuth)
│   ├── email/         # Service Gmail
│   ├── googleCalendar/
│   ├── googleContacts/
│   ├── slack/         # En cours
│   ├── areas/         # AREA logique
│   └── prisma/        # ORM
├── prisma/
│   └── schema.prisma
└── package.json
```

### Lancer le backend

```bash
cd AREA-Project/back

# Installation
npm install

# Dev mode
npm run start:dev

# Build
npm run build

# Production
npm run start:prod
```

### Variables d'environnement

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your_jwt_secret"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_REDIRECT_URI="http://localhost:5001/auth/google/callback"
```

---

## Frontend

### Structure

```
front/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   ├── ConnectedDashboard/
│   │   └── dashboard/
│   ├── pages/
│   ├── services/      # API calls
│   ├── components/
│   └── styles/
└── package.json
```

### Lancer le frontend

```bash
cd AREA-Project/front

npm install
npm run dev           # http://localhost:3000
npm run build
```

### Pages principales

- `/` - Homepage
- `/login` - Connexion
- `/register` - Inscription
- `/dashboard` - Dashboard connecté
- `/about` - À propos
- `/help` - Aide

---

## Mobile

### Structure

```
mobile/
├── src/
│   ├── pages/
│   ├── components/
│   ├── services/
│   └── state/
└── package.json
```

### Lancer le mobile

```bash
cd AREA-Project/mobile

npm install
npm run dev           # http://localhost:5175

# Build pour iOS/Android
npm run build
npx cap sync
```

---

## CI/CD

### Double système CI/CD

1. **Git Hooks Locaux** (gratuit, rapide)
   - `pre-commit` : ESLint
   - `pre-push` : Build verification
   - `commit-msg` : Format validation

2. **GitHub Actions** (cloud, centralisé)
   - Lint parallèle (back + front + mobile)
   - Build parallèle
   - PR checks automatiques

### Installation hooks

```bash
./AREA-Project/scripts/setup-hooks.sh
```

### Désactiver temporairement

```bash
git commit --no-verify
git push --no-verify
```

---

## Git Hooks

### Pre-commit

Vérifie ESLint sur les fichiers modifiés :

```bash
# Test manuel
.githooks/pre-commit
```

### Pre-push

Vérifie les builds complets :

```bash
# Test manuel
.githooks/pre-push
```

### Commit-msg

Valide le format conventional commits :

```
feat(back): add feature
fix(front): correct bug
docs: update README
```

---

## Gmail Integration

### Configuration

1. **Google Cloud Console**
   - Créer un projet
   - Activer Gmail API
   - Créer OAuth 2.0 credentials

2. **Backend `.env`**
   ```env
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   ```

3. **Tester**
   ```bash
   # Via frontend
   - Se connecter avec Google
   - Aller sur Dashboard
   - Tester "Send Email"
   ```

### Endpoints

- `POST /email/send` - Envoyer un email
- `GET /email/list` - Lister les emails

---

## Google Calendar

### Configuration

1. Activer Google Calendar API dans Google Cloud
2. Utiliser les mêmes OAuth credentials

### Endpoints

- `POST /google-calendar/create-event` - Créer événement
- `GET /google-calendar/list-events` - Lister événements

### Exemple

```typescript
// Frontend
await googleCalendarService.createEvent({
  summary: "Meeting",
  startDateTime: "2025-10-21T10:00:00",
  endDateTime: "2025-10-21T11:00:00",
  attendees: ["email@example.com"]
});
```

---

## Google Contacts

### Configuration

1. Activer People API dans Google Cloud
2. Scopes requis : `contacts.readonly`, `contacts`

### Endpoints

- `POST /google-contacts/create` - Créer contact
- `GET /google-contacts/list` - Lister contacts

---

## Slack

**Statut** : 🚧 En cours de développement

Configuration prévue :
- Webhook URL pour notifications
- OAuth integration

---

## Authentification

### Système

- **JWT** pour sessions
- **OAuth 2.0** pour Google
- **Refresh tokens** pour persistance

### Flow OAuth

```
1. User clique "Login with Google"
2. Redirection vers Google
3. User autorise
4. Callback vers backend
5. Backend génère JWT
6. Frontend stocke token
7. Requêtes API avec token
```

### Endpoints Auth

- `POST /auth/register` - Inscription classique
- `POST /auth/login` - Connexion classique
- `GET /auth/google` - OAuth Google
- `GET /auth/google/callback` - Callback OAuth

---

## Mobile Backend

### Intégration

Le mobile communique avec le backend via :

```typescript
// mobile/src/services/api.ts
const API_URL = "http://localhost:5001";

export const apiService = {
  setAuthToken(token: string) {
    // Stocker le token
  },
  
  async get(endpoint: string) {
    return fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};
```

### Capacitor

Pour accès natif (caméra, notifications, etc) :

```bash
npx cap add ios
npx cap add android
npx cap sync
```

---

## Sécurité

### Bonnes pratiques

✅ **Fait**
- JWT avec expiration
- CORS configuré
- Helmet.js pour headers
- Rate limiting
- Input validation (class-validator)

⚠️ **À faire**
- HTTPS en production
- Secrets rotation
- Audit logs
- 2FA (optionnel)

### Secrets

**NE JAMAIS COMMITER** :
- `.env` files
- API keys
- Tokens
- Passwords

Utiliser `.env.example` comme template.

---

## Tests

### Backend

```bash
cd AREA-Project/back
npm run test           # Unit tests
npm run test:e2e       # E2E tests
npm run test:cov       # Coverage
```

### Frontend

```bash
cd AREA-Project/front
npm run test
npm run test:coverage
```

---

## Scripts Utiles

### Développement

```bash
# Tout démarrer
./start-all-final.sh

# Vérifier tout
./check-all.sh

# Guide rapide
./AREA-Project/scripts/QUICKSTART.sh
```

### Migration

```bash
# Vers repo public
./migrate-to-public.sh
```

### Docker

```bash
# Mode dev avec Docker
cd AREA-Project
./dev.sh start

# Logs
./dev.sh logs

# Stop
./dev.sh stop
```

---

## Troubleshooting

### Port déjà utilisé

```bash
# Trouver le process
lsof -i :5001    # Backend
lsof -i :3000    # Frontend
lsof -i :5175    # Mobile

# Kill le process
kill -9 <PID>
```

### npm install échoue

```bash
# Nettoyer le cache
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Prisma erreurs

```bash
cd AREA-Project/back
npx prisma generate
npx prisma migrate dev
```

### OAuth Google erreur

1. Vérifier les redirect URIs dans Google Cloud
2. Vérifier les scopes demandés
3. Tester avec un Google account test

---

## Commandes Rapides

```bash
# Setup complet
./AREA-Project/scripts/setup-hooks.sh
cd AREA-Project/back && npm install
cd ../front && npm install
cd ../mobile && npm install

# Lancer en dev
./start-all-final.sh

# Build tout
cd AREA-Project/back && npm run build
cd ../front && npm run build
cd ../mobile && npm run build

# Tests
./check-all.sh
```

---

## Support

- **Issues** : https://github.com/yakohhhh/area_epitech/issues
- **Wiki** : https://github.com/yakohhhh/area_epitech/wiki
- **Docs CI/CD** : `/GITHUB-ACTIONS-README.md`

---

## Changelog

### 2025-10-21 - Initial Release

✅ **Ajouts**
- Backend NestJS complet
- Frontend React avec dashboard
- Mobile Ionic
- Gmail integration
- Google Calendar integration
- Google Contacts integration
- CI/CD dual (Hooks + GitHub Actions)
- Documentation centralisée

🚧 **En cours**
- Slack integration
- Tests E2E complets
- Docker production optimisé

---

**Dernière mise à jour** : 21 octobre 2025
**Version** : 1.0.0
**Auteurs** : Team AREA @ Epitech
