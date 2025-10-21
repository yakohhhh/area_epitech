# 🔓 Résolution du Problème "Access blocked: AREA has not completed the Google verification process"

## 🚨 Problème
Votre application Google Cloud n'est pas vérifiée, ce qui bloque l'accès OAuth pour les utilisateurs non autorisés.

## 🎯 Solution Immédiate - Ajouter des Testeurs

### Étape 1: Accéder à Google Cloud Console
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionnez votre projet "AREA" ou le projet associé à votre Client ID

### Étape 2: Configurer l'écran de consentement OAuth
1. Dans le menu latéral, allez dans **APIs & Services > OAuth consent screen**
2. Vous devriez voir votre application avec le statut "Testing"

### Étape 3: Ajouter des utilisateurs test
1. Descendez jusqu'à la section **"Test users"**
2. Cliquez sur **"+ ADD USERS"**
3. Ajoutez votre email : `keayscops@gmail.com`
4. Cliquez sur **"SAVE"**

### Étape 4: Vérifier les Scopes
Dans la section **"Scopes"**, assurez-vous d'avoir :
- `https://www.googleapis.com/auth/calendar`
- `https://www.googleapis.com/auth/calendar.events`
- `https://www.googleapis.com/auth/contacts`
- `https://www.googleapis.com/auth/contacts.readonly`

## 🔄 Alternative - Créer un Nouveau Projet Google Cloud

Si vous n'avez pas accès au projet existant :

### Créer un nouveau projet
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet : "AREA-Dev-Test"
3. Activez les APIs nécessaires :
   - Google Calendar API
   - People API (pour Contacts)
   - Gmail API

### Configurer OAuth
1. **APIs & Services > Credentials**
2. Créer des identifiants OAuth 2.0
3. Ajouter vos URIs de redirection :
   - `http://localhost:5001/auth/google/callback`
   - `http://localhost:3000/auth/google/callback`

### Configurer l'écran de consentement
1. **APIs & Services > OAuth consent screen**
2. Type d'utilisateur : **External**
3. Statut : **Testing** (permet 100 utilisateurs test)
4. Ajouter votre email comme utilisateur test

### Mettre à jour votre .env
```env
GOOGLE_CLIENT_ID=nouveau_client_id
GOOGLE_CLIENT_SECRET=nouveau_client_secret
GOOGLE_REFRESH_TOKEN=sera_généré_après
```

## 🎯 Approche Rapide - Bypass Temporaire

### Utiliser un compte de service (pour tests uniquement)
Créez un compte de service Google Cloud qui peut accéder aux APIs sans OAuth utilisateur.

## 📋 Checklist de Vérification

- [ ] Projet Google Cloud accessible
- [ ] Email ajouté comme utilisateur test
- [ ] APIs activées (Calendar, People, Gmail)
- [ ] Scopes corrects configurés
- [ ] URIs de redirection corrects
- [ ] Application en mode "Testing"

## 🚀 Après Configuration

1. Réessayez l'URL d'autorisation
2. Votre email devrait maintenant être autorisé
3. Suivez le processus normal de génération du refresh token

## ⚠️ Important

- En mode "Testing", vous pouvez avoir jusqu'à 100 utilisateurs test
- Pour une application en production, vous devriez soumettre à la vérification Google
- Pour le développement, le mode test est suffisant