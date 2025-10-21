# Architecture du module Auth

## Structure des fichiers

Le module d'authentification a été découpé en plusieurs fichiers pour améliorer la maintenabilité et respecter le principe de responsabilité unique (SRP).

### Fichiers principaux

#### 1. `auth.service.ts` (172 lignes)
**Responsabilité:** Service principal d'orchestration de l'authentification

**Fonctionnalités:**
- Inscription classique (`register`)
- Connexion classique (`login`)
- Délégation vers les services spécialisés
- Génération de JWT tokens

**Dépendances:**
- `PrismaService` - Accès à la base de données
- `JwtService` - Génération de tokens JWT
- `AuthValidationService` - Validation des données
- `AuthGoogleService` - Gestion OAuth Google

---

#### 2. `auth-validation.service.ts` (86 lignes)
**Responsabilité:** Validation des données d'authentification

**Fonctionnalités:**
- `isValidEmail()` - Validation du format email
- `isValidUsername()` - Validation du nom d'utilisateur avec règles métier:
  - Pas de caractères @ ou .
  - Pas de chiffres
  - Minimum 3 caractères
  - Uniquement lettres, tirets et underscores
- `validateRegisterData()` - Validation complète pour l'inscription
- `validateLoginData()` - Validation complète pour la connexion

**Avantages:**
- Logique de validation centralisée
- Réutilisable dans d'autres services
- Tests unitaires facilités

---

#### 3. `auth-google.service.ts` (143 lignes)
**Responsabilité:** Gestion de l'authentification Google OAuth

**Fonctionnalités:**
- `googleRegister()` - Création de compte via Google
- `googleLogin()` - Connexion via Google
- `generateUniqueUsername()` - Génération de usernames uniques avec suffixes
- `generateJwtToken()` - Génération de tokens JWT pour utilisateurs Google

**Logique métier:**
- Vérification de l'existence de l'utilisateur
- Génération de usernames uniques (username1, username2, etc.)
- Différenciation entre utilisateurs OAuth et classiques
- Pas de mot de passe pour les utilisateurs Google

---

#### 4. `auth.module.ts`
**Responsabilité:** Configuration du module NestJS

**Providers enregistrés:**
- `AuthService` - Service principal
- `AuthValidationService` - Service de validation
- `AuthGoogleService` - Service Google OAuth
- Strategies Passport (Google, JWT)

**Exports:**
- `AuthService` - Disponible pour les autres modules

---

## Flux d'authentification

### Inscription classique (Email/Mot de passe)

```
Client → AuthController.register()
          ↓
        AuthService.register()
          ↓
        AuthValidationService.validateRegisterData()
          ↓
        PrismaService (vérification unicité)
          ↓
        bcrypt.hash() (hashage du mot de passe)
          ↓
        PrismaService.create()
          ↓
        Response → Client
```

### Connexion classique

```
Client → AuthController.login()
          ↓
        AuthService.login()
          ↓
        AuthValidationService.validateLoginData()
          ↓
        PrismaService.findUnique()
          ↓
        bcrypt.compare() (vérification du mot de passe)
          ↓
        JwtService.sign() (génération du token)
          ↓
        Response + JWT → Client
```

### Inscription Google OAuth

```
Client → Google OAuth2
          ↓
        GoogleStrategy (Passport)
          ↓
        AuthController.googleCallback()
          ↓
        AuthService.googleRegister()
          ↓
        AuthGoogleService.googleRegister()
          ↓
        AuthGoogleService.generateUniqueUsername()
          ↓
        PrismaService.create()
          ↓
        JwtService.sign()
          ↓
        Redirect + JWT → Client
```

---

## Interfaces TypeScript

### Interfaces partagées

```typescript
// DTOs
interface RegisterDto {
  email: string;
  username?: string;
  password: string;
}

interface LoginDto {
  email: string;
  password: string;
}

// Responses
interface RegisterResponse {
  id: number;
  email: string;
  username?: string;
  message: string;
}

interface LoginResponse {
  id: number;
  email: string;
  username?: string;
  message: string;
  access_token: string;
}

interface GoogleLoginResponse {
  id: number;
  email: string;
  username?: string;
  message: string;
  isNewUser: boolean;
  access_token: string;
}
```

---

## Règles de validation

### Email
- Format: `utilisateur@domaine.com`
- Doit contenir `@` et un domaine valide
- Regex: `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`

### Username
- ❌ Pas de caractère `@`
- ❌ Pas de caractère `.`
- ❌ Pas de chiffres
- ✅ Minimum 3 caractères
- ✅ Uniquement lettres, tirets (`-`) et underscores (`_`)
- Regex: `/^[a-zA-Z_-]+$/`

### Mot de passe
- Minimum 6 caractères
- Hashé avec bcrypt (10 salt rounds)

---

## Gestion des erreurs

### Erreurs communes

| Code | Message | Cause |
|------|---------|-------|
| 400 | Email et mot de passe sont requis | Champs manquants |
| 400 | Format d'email invalide | Email mal formé |
| 400 | Le nom d'utilisateur ne peut pas contenir... | Username invalide |
| 400 | Le mot de passe doit contenir au moins 6 caractères | Mot de passe trop court |
| 400 | Identifiants invalides | Email ou mot de passe incorrect |
| 400 | Cet utilisateur utilise l'authentification OAuth | Tentative de connexion classique sur compte Google |
| 409 | Un utilisateur avec cet email existe déjà | Email déjà utilisé |
| 409 | Un utilisateur avec ce nom d'utilisateur existe déjà | Username déjà utilisé |

---

## Tests

### Tests unitaires suggérés

**AuthValidationService:**
- ✅ Validation email valide
- ❌ Validation email invalide
- ✅ Validation username valide
- ❌ Validation username avec @
- ❌ Validation username avec .
- ❌ Validation username avec chiffres
- ❌ Validation username trop court

**AuthGoogleService:**
- ✅ Création compte Google avec username unique
- ✅ Génération username avec suffixe (username1, username2)
- ✅ Connexion compte Google existant
- ❌ Erreur si compte n'existe pas

**AuthService:**
- ✅ Inscription réussie
- ❌ Inscription avec email existant
- ✅ Connexion réussie
- ❌ Connexion avec mauvais mot de passe
- ❌ Connexion OAuth sur compte classique

---

## Avantages de cette architecture

### 1. **Séparation des responsabilités**
- Chaque service a une responsabilité unique et claire
- Facilite la maintenance et les modifications

### 2. **Testabilité**
- Services isolés plus faciles à tester unitairement
- Mocking simplifié des dépendances

### 3. **Réutilisabilité**
- `AuthValidationService` peut être utilisé dans d'autres modules
- Logique Google OAuth isolée et réutilisable

### 4. **Lisibilité**
- Fichiers de moins de 200 lignes
- Code plus facile à comprendre et à naviguer

### 5. **Évolutivité**
- Facile d'ajouter d'autres providers OAuth (Facebook, GitHub, etc.)
- Possibilité d'ajouter de nouvelles validations sans impacter le reste

---

## Migration depuis l'ancienne version

L'ancien fichier `auth.service.ts` (294 lignes) a été sauvegardé dans `auth.service.old.ts`.

### Changements dans les imports

**Avant:**
```typescript
import { AuthService } from './auth/auth.service';
```

**Après:**
```typescript
// Aucun changement nécessaire !
import { AuthService } from './auth/auth.service';
```

L'API publique de `AuthService` reste identique, seule l'implémentation interne a changé.

---

## Prochaines améliorations possibles

1. **Ajouter d'autres providers OAuth**
   - Facebook, GitHub, Microsoft, etc.
   - Créer `auth-facebook.service.ts`, etc.

2. **Améliorer la validation**
   - Validation de la force du mot de passe
   - Vérification email jetable
   - Rate limiting

3. **Gestion des sessions**
   - Refresh tokens
   - Révocation de tokens
   - Sessions multiples

4. **Email de confirmation**
   - Service d'envoi d'emails
   - Vérification du compte

5. **Réinitialisation du mot de passe**
   - Tokens temporaires
   - Envoi d'emails de réinitialisation

---

## Ressources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Passport.js](http://www.passportjs.org/)
- [JWT.io](https://jwt.io/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
