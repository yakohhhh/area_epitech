# Documentation du back (NestJS)

Ce document décrit l'API et la configuration du dossier `back/` du projet (NestJS + Prisma + SQLite).

## Objectif
Fournir une documentation simple et complète pour démarrer, comprendre les modules, les endpoints exposés et comment interagir avec la base de données.

---

## Arborescence importante
- `back/src/`
  - `main.ts` : point d'entrée, démarre l'app sur le port 5001
  - `app.module.ts` : module racine qui importe `PrismaModule`, `UserModule`, `AuthModule`
  - `auth/` : `auth.controller.ts`, `auth.service.ts`, `auth.module.ts`, `google.strategy.ts` (module d'authentification avec inscription, connexion et Google OAuth)
  - `user/` : `user.controller.ts`, `user.service.ts`, `user.module.ts` (CRUD utilisateurs — route POST /user)
  - `prisma/` : `prisma.module.ts`, `prisma.service.ts` (wrapper PrismaClient)
- `back/prisma/schema.prisma` : schéma Prisma (SQLite)
- `back/package.json` : scripts et dépendances

---

## Installation (locale)
Ouvrir un terminal dans `back/` puis :

```bash
cd back
npm install
# Générer le client Prisma
npx prisma generate
# Créer/pousser la DB (optionnel - crée le fichier sqlite s'il n'existe pas)
npx prisma db push
```

Notes :
- Le projet utilise SQLite par défaut, la datasource du fichier `prisma/schema.prisma` pointe vers `file:./database/dev.sqlite`.
- Si vous voulez utiliser une URL d'environnement, remplacez la datasource par `url = env("DATABASE_URL")` et exportez `DATABASE_URL`.

---

## Scripts utiles (depuis `back/`)
- `npm run start:dev` : lance Nest en mode watch (développement)
- `npm run start` : lance Nest en mode normal
- `npm run build` puis `npm run start:prod` : build + lancement production
- `npm test` / `npm run test:watch` : lancer les tests (Jest)
- `npm run lint` : lancer ESLint

Le serveur écoute par défaut sur le port 5001 (défini dans `main.ts`).

---

## Schéma Prisma
Fichier : `back/prisma/schema.prisma`

Modèle principal :

- User
  - `id` Int @id @default(autoincrement())
  - `email` String @unique
  - `name` String
  - `password` String (hashé)

Base (extrait) :
```
datasource db {
  provider = "sqlite"
  url      = "file:./database/dev.sqlite"
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id Int @id @default(autoincrement())
  email String @unique
  name String
  password String
}
```

---

## Endpoints exposés
Basé sur les controllers présents dans `back/src/*`.

1) POST /user
- Description : création d'un nouvel utilisateur.
- Fichier : `back/src/user/user.controller.ts`
- Corps attendu (JSON) :
  - `email` (string)
  - `name` (string)
  - `password` (string)
- Comportement : le mot de passe est hashé avec `bcrypt` côté serveur (saltRounds = 10) avant d'être stocké.
- Réponse (exemple) :
  - `{ "id": 1, "email": "user@example.com", "name": "Mon Nom" }` (le champ `password` n'est pas retourné)

2) /auth
- Description : module d'authentification complet avec inscription, connexion classique et authentification Google OAuth.

### Endpoints d'authentification :

#### POST /auth/register
- Description : Inscription d'un nouvel utilisateur
- Body : `{ "email": string, "username"?: string, "password": string }`
- Réponse : `{ "id": number, "email": string, "username"?: string, "message": string }`

#### POST /auth/login
- Description : Connexion utilisateur classique
- Body : `{ "email": string, "password": string }`
- Réponse : `{ "id": number, "email": string, "username"?: string, "message": string }`

#### GET /auth/google
- Description : Initiation de l'authentification Google OAuth (redirige vers Google)
- Réponse : Redirection vers Google OAuth

#### GET /auth/google/callback
- Description : Callback de Google OAuth (appelé automatiquement par Google)
- Réponse : `{ "success": boolean, "user": object, "message": string }`

### Configuration Google OAuth :
Pour utiliser l'authentification Google, configurez les variables d'environnement :
- `GOOGLE_CLIENT_ID` : ID client Google OAuth
- `GOOGLE_CLIENT_SECRET` : Secret client Google OAuth  
- `GOOGLE_CALLBACK_URL` : URL de callback (par défaut `/auth/google/callback`)

---

## Contrats et shapes (mini-contrat)
- CreateUser (request) : { email: string, name: string, password: string }
- CreateUser (response) : { id: number, email: string, name: string }

Erreurs possibles :
- 400/422 : requête mal formée (actuellement pas de validation DTO/pipe installé)
- 409 : email déjà utilisé (Prisma lèvera une erreur unique constraint — à gérer côté service/controller)

---

## Fichiers clés et responsabilités
- `back/src/main.ts` : démarre Nest (port 5001)
- `back/src/app.module.ts` : assemble les modules
- `back/src/prisma/prisma.service.ts` : classe `PrismaService` qui extends `PrismaClient` et connecte la DB au démarrage
- `back/src/user/user.service.ts` : logique métier de création d'utilisateur (hash password + création via Prisma)
- `back/src/user/user.controller.ts` : callback HTTP POST /user
- `back/src/auth/*` : module d'auth — à compléter (routes, JWT, guards,...)

---

## Exemples d'appels
Créer un utilisateur (curl) :

```bash
curl -X POST http://localhost:5001/user \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","name":"Alice","password":"monsecret"}'
```

Réponse attendue (HTTP 201/200 selon config actuelle) :
```json
{ "id": 1, "email": "alice@example.com", "name": "Alice" }
```

---

## Sécurité / points d'attention
- Les mots de passe sont hashés avec `bcrypt` (saltRounds = 10), bon début.
- Il n'y a pas (encore) de validation DTO/ValidationPipe. Ajouter `class-validator` & DTOs évitera des entrées invalides.
- Le module `auth` est vide : prévoir JWT, Guards, et endpoints `login`/`register` si besoin.
- Gestion d'erreurs Prisma (unique constraint, etc.) : il faut catcher les erreurs et renvoyer des réponses HTTP appropriées.

---

## Tests & Qualité (recommandé)
- Lancer : `npm test` (Jest). Ajouter des tests unitaires pour `UserService` et tests e2e pour les routes.
- Linter : `npm run lint` + `npm run format`.

---

## Améliorations / prochaines étapes recommandées
- Ajouter DTOs + ValidationPipe (`class-validator`, `class-transformer`).
- Compléter `AuthModule` : endpoints `POST /auth/login`, `POST /auth/register`, mise en place de JWT (`@nestjs/jwt`) et guards.
- Centraliser la configuration (port, DB url) via `@nestjs/config` et variables d'environnement.
- Ajouter des tests unitaires et e2e (supertest) pour couvrir les endpoints critiques.
- Remplacer la datasource par une variable d'environnement pour faciliter CI et environnements multiples.

---

## Où creuser dans le code
- `back/src/user/user.controller.ts`
- `back/src/user/user.service.ts`
- `back/src/prisma/prisma.service.ts`
- `back/prisma/schema.prisma`
- `back/src/auth/*` (actuellement minimal)

---

## Contacts / Ressources
- Prisma docs : https://www.prisma.io/docs/
- NestJS docs : https://docs.nestjs.com/

---

Si tu veux, je peux :
- générer automatiquement des DTOs et ajouter `class-validator` et `ValidationPipe` ;
- implémenter des endpoints `auth/login` et `auth/register` avec JWT ;
- ajouter des tests unitaires/e2e basiques pour `UserService` et `POST /user`.

Dis-moi quelle suite tu veux que je fasse et je l'implémente.
