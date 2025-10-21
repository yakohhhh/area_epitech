# 🔧 Résolution du Problème d'Authentification Google

## 🚨 Problème Identifié

L'erreur "Request had insufficient authentication scopes" indique que le refresh token actuel n'a pas les bonnes permissions pour accéder aux API Google Calendar et Google Contacts.

## 🔍 Diagnostic

Les services Google nécessitent des **scopes** spécifiques :

### Google Calendar
- `https://www.googleapis.com/auth/calendar`
- `https://www.googleapis.com/auth/calendar.events`

### Google Contacts  
- `https://www.googleapis.com/auth/contacts`
- `https://www.googleapis.com/auth/contacts.readonly`

## 🛠️ Solution - Régénérer le Refresh Token

### Étape 1: Exécuter le script de génération
```bash
cd /home/depop/delivery/semester_tek3/G-DEV-500-STG-5-1-area-1/AREA-Project/back
node scripts/get-google-refresh-token.js
```

### Étape 2: Suivre les instructions
1. Le script affichera une URL d'autorisation
2. Ouvrir l'URL dans un navigateur
3. Se connecter avec votre compte Google
4. **IMPORTANT**: Autoriser TOUTES les permissions demandées
5. Copier le code d'autorisation de l'URL de redirection
6. Coller le code dans le terminal

### Étape 3: Mettre à jour .env  
```bash
# Remplacer dans /back/.env
GOOGLE_REFRESH_TOKEN=nouveau_refresh_token_ici
```

### Étape 4: Redémarrer le backend
```bash
cd /home/depop/delivery/semester_tek3/G-DEV-500-STG-5-1-area-1/AREA-Project
npm run dev
```

## 🧪 Test et Validation

### Via l'application mobile
1. Aller dans **Diagnostics** (nouvelle page)
2. Cliquer sur "Run Diagnostics"
3. Vérifier que tous les tests passent

### Via les endpoints directs
```bash
# Test Google Calendar
curl http://localhost:5001/google-auth/test-calendar

# Test Google Contacts  
curl http://localhost:5001/google-auth/test-contacts
```

## 📋 Endpoints de Test Ajoutés

### Backend (`/google-auth/`)
- `GET /google-auth/test-calendar` - Test auth Calendar
- `GET /google-auth/test-contacts` - Test auth Contacts
- `GET /google-auth/calendar-auth-url` - URL d'auth Calendar
- `GET /google-auth/contacts-auth-url` - URL d'auth Contacts

### Mobile (`/diagnostics`)
- Page complète de diagnostics avec interface graphique
- Tests automatisés de tous les services
- Messages d'erreur détaillés
- Instructions de dépannage

## 🔄 Améliorations Apportées

### Services Backend
- **Gestion des tokens améliorée**: Refresh automatique des access tokens
- **Gestion d'erreurs robuste**: Messages d'erreur détaillés
- **Scopes configurés**: Tous les scopes nécessaires définis
- **Endpoints de test**: Validation facile de l'authentification

### Application Mobile
- **Page de diagnostics**: Interface graphique pour tester les services
- **Gestion d'erreurs**: Messages contextualisés pour l'utilisateur
- **Feedback visuel**: Status indicators pour chaque service
- **Instructions**: Guide de dépannage intégré

## 🎯 Résultats Attendus

Après avoir suivi ces étapes :
- ✅ Création d'événements Google Calendar
- ✅ Création de contacts Google
- ✅ Envoi d'emails automatisés
- ✅ Tests d'intégrations fonctionnels
- ✅ Automatisations opérationnelles

## 🚀 Prochaines Étapes

1. **Régénérer le token** avec le script fourni
2. **Tester** via la page diagnostics
3. **Valider** les intégrations dans l'app mobile
4. **Créer des automatisations** réelles

Le problème d'authentification sera résolu et toutes les fonctionnalités Google seront opérationnelles !