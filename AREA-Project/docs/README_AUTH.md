# 📱 AREA Mobile - Authentification 

## 🎯 Fonctionnalités Implémentées

### ✅ Authentification Complète
- **Inscription** avec email/mot de passe + validation
- **Connexion** avec email/mot de passe
- **Google SSO** (Single Sign-On) intégré
- **Gestion des tokens JWT** avec stockage persistant
- **Guards de routes** pour protéger les pages privées
- **Dashboard** utilisateur après connexion

### 🔧 Architecture Technique
- **Ionic React 8** + Capacitor 6 pour le mobile
- **Zustand** pour la gestion d'état simplifiée
- **React Router v5** (compatible Ionic)
- **Axios** avec intercepteurs JWT automatiques
- **TypeScript** avec configuration bundler
- **Stockage persistant** avec Capacitor Preferences

## 🚀 Démarrage Rapide

### 1. Installer les dépendances
```bash
cd AREA-Project/mobile
npm install
```

### 2. Configurer l'environnement
Le fichier `.env` est déjà configuré avec:
```env
VITE_API_URL=http://localhost:5001
VITE_NODE_ENV=development
```

### 3. Lancer l'application
```bash
# Application mobile
npm run dev

# Ou utiliser le script de développement
./dev.sh local
```

### 4. Tester l'authentification
1. **Page d'accueil**: http://localhost:5175
2. **Inscription**: Cliquer sur "Commencer Gratuitement"
3. **Connexion**: Utiliser le lien "Se connecter"
4. **Google OAuth**: Bouton "Continuer avec Google"

## 📋 Pages Disponibles

| Route | Description | Accès |
|-------|-------------|-------|
| `/` | Page d'accueil avec présentation | Public |
| `/login` | Connexion utilisateur | Public |
| `/register` | Inscription utilisateur | Public |
| `/auth/google/callback` | Callback Google OAuth | Public |
| `/dashboard` | Tableau de bord utilisateur | Privé |

## 🔐 Flux d'Authentification

### Inscription/Connexion Standard
1. L'utilisateur saisit ses informations
2. Requête POST vers `/auth/login` ou `/auth/register`
3. Réception du token JWT + infos utilisateur
4. Stockage automatique avec Capacitor Preferences
5. Redirection vers `/dashboard`

### Google OAuth
1. Clic sur "Continuer avec Google"
2. Redirection vers `${API_URL}/auth/google`
3. Authentification Google + callback backend
4. Redirection vers `/auth/google/callback`
5. Récupération du token + stockage
6. Redirection vers `/dashboard`

## 🛠️ Configuration Backend Requise

Le mobile utilise l'API NestJS existante. Endpoints nécessaires:

```typescript
POST /auth/register
POST /auth/login
GET  /auth/google (OAuth redirect)
GET  /auth/google/callback (OAuth callback)
```

## 📱 Test sur Mobile

### Android
```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

### iOS
```bash
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

## 🐛 Débogage

### Problèmes Courants
1. **Page blanche**: Vérifier que les CSS Ionic sont importés
2. **Erreur 404 API**: Vérifier `VITE_API_URL` dans `.env`
3. **Token non persisté**: Vérifier Capacitor Preferences
4. **Google OAuth**: Vérifier la configuration CORS du backend

### Logs Utiles
```bash
# Console navigateur pour les erreurs frontend
# Terminal backend pour les erreurs API
# Network tab pour les requêtes HTTP
```

## 🔄 Intégration avec le Backend Web

L'application mobile utilise **exactement la même API** que la version web:
- Mêmes endpoints d'authentification
- Même système de tokens JWT
- Même base de données utilisateurs
- Compatible avec les intégrations Google existantes

## 📝 Prochaines Étapes

1. **Tests d'intégration** avec le backend
2. **Déploiement mobile** (Android/iOS)
3. **Notifications push** avec Capacitor
4. **Sync offline** avec état local
5. **Biométrie** pour l'authentification

## 🤝 Utilisation

L'application est prête pour les tests. Lancez le backend NestJS sur le port 5001 et l'application mobile sera automatiquement connectée pour l'authentification complète.