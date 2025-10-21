# Séparation Register et Login pour Google OAuth

## Changements effectués

Le système d'authentification Google a été modifié pour séparer explicitement les flux d'inscription (register) et de connexion (login).

### Avant
- Une seule route `/auth/google` qui créait automatiquement un compte si l'email n'existait pas

### Après
- **Deux routes distinctes** :
  - `/auth/google/register` - Pour l'inscription
  - `/auth/google/login` - Pour la connexion

## Architecture Backend

### Nouvelles routes (auth.controller.ts)

```typescript
// INSCRIPTION
GET /auth/google/register
GET /auth/google/register/callback

// CONNEXION  
GET /auth/google/login
GET /auth/google/login/callback
```

### Nouvelles stratégies Passport

1. **GoogleRegisterStrategy** (`google-register.strategy.ts`)
   - Gère l'inscription via Google
   - Callback: `http://localhost:5001/auth/google/register/callback`

2. **GoogleLoginStrategy** (`google-login.strategy.ts`)
   - Gère la connexion via Google
   - Callback: `http://localhost:5001/auth/google/login/callback`

### Méthodes du service (auth.service.ts)

#### `googleRegister(profile)`
```typescript
- Vérifie que l'email n'existe PAS déjà
- Si existe → throw ConflictException
- Génère un username unique
- Crée l'utilisateur
- Retourne le token JWT
```

#### `googleLogin(profile)`
```typescript
- Vérifie que l'email EXISTE
- Si n'existe pas → throw BadRequestException
- Vérifie que c'est un compte Google (passwordHash === null)
- Retourne le token JWT
```

## Architecture Frontend

### Service d'authentification (authService.ts)

```typescript
// Nouvelle méthode
async registerWithGoogle(): Promise<string> {
  return `${API_BASE_URL}/auth/google/register`;
}

// Méthode existante modifiée
async loginWithGoogle(): Promise<string> {
  return `${API_BASE_URL}/auth/google/login`;
}
```

### Pages mises à jour

1. **LoginPage.tsx**
   - Bouton Google utilise `loginWithGoogle()`
   - Affiche les erreurs de l'URL

2. **RegisterPage.tsx**
   - Bouton Google utilise `registerWithGoogle()`
   - Affiche les erreurs de l'URL

3. **GoogleCallbackPage.tsx**
   - Gère le paramètre `action` ('register' ou 'login')
   - Redirige vers la bonne page en cas d'erreur

## Configuration

### Variables d'environnement (.env)

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REGISTER_CALLBACK_URL=http://localhost:5001/auth/google/register/callback
GOOGLE_LOGIN_CALLBACK_URL=http://localhost:5001/auth/google/login/callback
FRONTEND_URL=http://localhost:3000
```

## Flux d'authentification

### Inscription avec Google

```
1. Utilisateur clique sur "S'inscrire avec Google" (RegisterPage)
   ↓
2. Redirection vers /auth/google/register
   ↓
3. Google OAuth (authentification)
   ↓
4. Callback vers /auth/google/register/callback
   ↓
5. Backend: authService.googleRegister()
   - Vérifie que l'email n'existe pas
   - Crée le compte
   - Génère le JWT
   ↓
6. Redirection vers /auth/google/callback?action=register&...
   ↓
7. Frontend: stocke le token et redirige vers /dashboard
```

### Connexion avec Google

```
1. Utilisateur clique sur "Se connecter avec Google" (LoginPage)
   ↓
2. Redirection vers /auth/google/login
   ↓
3. Google OAuth (authentification)
   ↓
4. Callback vers /auth/google/login/callback
   ↓
5. Backend: authService.googleLogin()
   - Vérifie que l'email existe
   - Vérifie que c'est un compte Google
   - Génère le JWT
   ↓
6. Redirection vers /auth/google/callback?action=login&...
   ↓
7. Frontend: stocke le token et redirige vers /dashboard
```

## Messages d'erreur

### Register
- ✅ "Compte créé avec succès avec Google"
- ❌ "Un compte avec cet email existe déjà. Veuillez vous connecter."

### Login
- ✅ "Connexion réussie avec Google"
- ❌ "Aucun compte trouvé avec cet email. Veuillez d'abord vous inscrire."
- ❌ "Ce compte utilise une connexion par email/mot de passe. Veuillez utiliser la méthode de connexion classique."

## Sécurité

### Protections mises en place

1. **Pas de création automatique de compte**
   - L'utilisateur doit explicitement s'inscrire

2. **Validation du type de compte**
   - Un compte Google (passwordHash = null) ne peut pas se connecter avec email/password
   - Un compte classique ne peut pas utiliser Google Login

3. **Username unique**
   - Génération automatique de suffixes en cas de conflit

4. **Gestion des erreurs**
   - Messages clairs pour guider l'utilisateur
   - Redirection vers la bonne page en cas d'erreur

## Test

### 1. Test d'inscription
```bash
# Supprimer les utilisateurs de test si nécessaire
cd AREA-Project/back
npx prisma studio

# Tester l'inscription
1. Aller sur http://localhost:3000/register
2. Cliquer sur "S'inscrire avec Google"
3. Choisir un compte Google
4. Vérifier la création du compte et la redirection vers /dashboard
```

### 2. Test de connexion avec compte existant
```bash
1. Aller sur http://localhost:3000/login
2. Cliquer sur "Se connecter avec Google"
3. Utiliser le même compte Google
4. Vérifier la connexion réussie
```

### 3. Test d'erreur: Login sans inscription
```bash
1. Supprimer le compte de test dans la DB
2. Aller sur http://localhost:3000/login
3. Cliquer sur "Se connecter avec Google"
4. Vérifier le message: "Aucun compte trouvé... Veuillez d'abord vous inscrire"
5. Redirection vers /login avec le message d'erreur
```

### 4. Test d'erreur: Register avec compte existant
```bash
1. S'inscrire une première fois avec Google
2. Aller sur http://localhost:3000/register
3. Cliquer sur "S'inscrire avec Google"
4. Utiliser le même compte
5. Vérifier le message: "Un compte avec cet email existe déjà"
6. Redirection vers /register avec le message d'erreur
```

## Fichiers modifiés

### Backend
- ✨ **Nouveau:** `back/src/auth/google-register.strategy.ts`
- ✨ **Nouveau:** `back/src/auth/google-login.strategy.ts`
- 📝 `back/src/auth/auth.controller.ts`
- 📝 `back/src/auth/auth.service.ts`
- 📝 `back/src/auth/auth.module.ts`
- 📝 `back/.env`

### Frontend
- 📝 `front/src/services/authService.ts`
- 📝 `front/src/pages/LoginPage.tsx`
- 📝 `front/src/pages/RegisterPage.tsx`
- 📝 `front/src/pages/GoogleCallbackPage.tsx`

## Configuration Google Cloud Console

⚠️ **Important** : Il faut ajouter les nouvelles URIs de redirection dans Google Cloud Console :

1. Aller sur https://console.cloud.google.com
2. Sélectionner votre projet
3. Aller dans "APIs & Services" > "Credentials"
4. Éditer votre OAuth 2.0 Client ID
5. Ajouter dans "Authorized redirect URIs" :
   - `http://localhost:5001/auth/google/register/callback`
   - `http://localhost:5001/auth/google/login/callback`

## Notes

- Les deux stratégies utilisent le même `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET`
- Seules les URLs de callback changent
- L'ancienne stratégie `GoogleStrategy` peut être supprimée si elle n'est plus utilisée
