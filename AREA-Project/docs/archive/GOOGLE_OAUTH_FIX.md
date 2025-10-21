# Fix de l'authentification Google OAuth

## Problème identifié

Lors de l'inscription via Google dans le front-end, l'utilisateur était redirigé vers une page 404 et le compte n'était pas créé.

### Cause

La route de callback `/auth/google/callback` n'existait pas dans le front-end React. Le backend redirige vers cette route après l'authentification Google réussie, mais sans cette route, React Router affichait la page 404.

## Solution implémentée

### 1. Création de la page GoogleCallbackPage

**Fichier créé:** `AREA-Project/front/src/pages/GoogleCallbackPage.tsx`

Cette page :
- Récupère les paramètres de l'URL (token, email, username, id, isNewUser)
- Stocke le token et les informations utilisateur dans le localStorage
- Met à jour le contexte d'authentification
- Redirige l'utilisateur vers le dashboard

### 2. Ajout de la route dans App.tsx

**Modification:** `AREA-Project/front/src/App.tsx`

```tsx
<Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
```

### 3. Correction des types TypeScript

**Modifications dans:**
- `AREA-Project/front/src/contexts/AuthContext.tsx`
  - Changement de `id: string` → `id: number`
  - Changement de `username: string` → `username: string | null`
  - Ajout du champ `access_token?: string`

- `AREA-Project/front/src/services/authService.ts`
  - Création de l'interface `LoginResponse extends AuthResponse`
  - Ajout du champ `access_token: string` dans LoginResponse
  - Mise à jour du type de retour de la fonction `login()`

- `AREA-Project/front/src/pages/LoginPage.tsx`
  - Correction pour utiliser `response.id` (number) au lieu de le convertir en string
  - Utilisation de `response.username` au lieu de `formData.username`
  - Ajout du passage du token JWT

- `AREA-Project/front/src/pages/RegisterPage.tsx`
  - Correction pour utiliser `response.id` (number) au lieu de le convertir en string
  - Utilisation de `response.username` au lieu de `formData.username`

## Flux d'authentification Google

```
1. Utilisateur clique sur "Se connecter avec Google"
   ↓
2. Redirection vers /auth/google (backend)
   ↓
3. Google OAuth (authentification externe)
   ↓
4. Callback vers /auth/google/callback (backend)
   ↓
5. Backend crée/récupère l'utilisateur et génère un JWT
   ↓
6. Redirection vers /auth/google/callback (frontend) avec les données
   ↓
7. GoogleCallbackPage traite les données et authentifie
   ↓
8. Redirection vers /dashboard
```

## Configuration requise

### Backend (.env)
```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5001/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

### Frontend
- La route `/auth/google/callback` doit être accessible (non protégée)
- Le AuthContext doit être configuré pour gérer les tokens JWT

## Test de la fonctionnalité

1. Démarrer le backend : `cd AREA-Project/back && npm run dev`
2. Démarrer le frontend : `cd AREA-Project/front && npm run dev`
3. Accéder à la page de login : `http://localhost:3000/login`
4. Cliquer sur "Se connecter avec Google"
5. S'authentifier avec un compte Google
6. Vérifier la redirection vers le dashboard
7. Vérifier que l'utilisateur est bien créé dans la base de données

## Vérifications

- ✅ La route `/auth/google/callback` existe dans le front
- ✅ Les types TypeScript sont cohérents (id: number, username: string | null)
- ✅ Le token JWT est correctement stocké et passé au contexte
- ✅ La redirection vers le dashboard fonctionne
- ✅ Les utilisateurs existants et nouveaux sont gérés différemment

## Fichiers modifiés

- ✨ **Nouveau:** `front/src/pages/GoogleCallbackPage.tsx`
- 📝 `front/src/App.tsx`
- 📝 `front/src/contexts/AuthContext.tsx`
- 📝 `front/src/services/authService.ts`
- 📝 `front/src/pages/LoginPage.tsx`
- 📝 `front/src/pages/RegisterPage.tsx`

## Notes importantes

- Le compte Google est créé automatiquement lors de la première connexion (`isConfirmed: true`)
- Les utilisateurs Google n'ont pas de mot de passe (`passwordHash: null`)
- Le token JWT est valide pendant 24h (configurable via `JWT_EXPIRATION`)
