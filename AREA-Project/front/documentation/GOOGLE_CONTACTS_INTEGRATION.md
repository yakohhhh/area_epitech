# Google Contacts Integration - ConnectedDashboard

## Vue d'ensemble

L'intégration Google Contacts permet aux utilisateurs de créer des contacts directement depuis le ConnectedDashboard de l'application AREA.

## Architecture

### Backend (NestJS)

**Contrôleur:** `back/src/googleContacts/googleContacts.controller.ts`
- `POST /google-contacts/create` - Crée un nouveau contact

**Service:** `back/src/googleContacts/googleContacts.service.ts`
- `createContact()` - Utilise l'API Google People v1

**Authentification:**
- OAuth2 avec refresh token (variable d'environnement `GOOGLE_REFRESH_TOKEN`)
- Scopes requis: `https://www.googleapis.com/auth/contacts`
- **Note:** Utilise le même mécanisme que Gmail et Calendar (refresh token partagé)

### Frontend (React + TypeScript)

**Service:** `front/src/services/googleContactsService.ts`
- `createContact(contactData)` - Envoie une requête POST pour créer un contact

**Interface utilisateur:**
- Catalogue de services: `servicesCatalog.ts` - Définit l'action "Créer un contact"
- Sidebar: `RightSidebar.tsx` - Gère l'interface de configuration et les tests

## Utilisation dans le Dashboard

### 1. Ajouter le service
- Glisser-déposer "Google Contacts 👤" depuis le catalogue vers la zone de travail

### 2. Connecter le service
- Cliquer sur le service ajouté
- Cliquer sur "Se connecter" dans la sidebar droite
- Note: La connexion utilise automatiquement l'access token obtenu via OAuth

### 3. Créer un contact

**Champs requis:**
- **Nom complet** (name): Prénom et nom du contact (ex: "Jean Dupont")
- **Email**: Adresse email du contact (ex: "jean.dupont@exemple.com")

**Étapes:**
1. Sélectionner l'action "Créer un contact"
2. Remplir les champs du formulaire
3. Cliquer sur "Tester" pour créer le contact immédiatement
4. Feedback affiché: "✅ Contact créé avec succès !"

## API Backend

### POST /google-contacts/create

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Jean Dupont",
  "email": "jean.dupont@exemple.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "contact": {
    "resourceName": "people/c1234567890123456789",
    "etag": "%EgUBAj03LhoEAQIFByIMWXRBcGZHdjBaNzQ9",
    "names": [
      {
        "displayName": "Jean Dupont",
        "familyName": "Dupont",
        "givenName": "Jean"
      }
    ],
    "emailAddresses": [
      {
        "value": "jean.dupont@exemple.com"
      }
    ]
  }
}
```

**Erreurs possibles:**

- **400 Bad Request:** Champs requis manquants
  ```json
  {
    "statusCode": 400,
    "message": "Name and email are required"
  }
  ```

- **401 Unauthorized:** Token JWT invalide
  ```json
  {
    "statusCode": 401,
    "message": "Unauthorized"
  }
  ```

- **403 Forbidden:** Refresh token invalide ou scopes insuffisants
  ```json
  {
    "statusCode": 403,
    "message": "Invalid credentials or insufficient permissions"
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

3. **Tester la création de contact:**
   - Ajouter le service Google Contacts
   - Connecter le service
   - Remplir le formulaire:
     - Nom complet: "Test Contact"
     - Email: "test@exemple.com"
   - Cliquer sur "Tester"
   - Vérifier dans Google Contacts que le contact a été créé

4. **Vérification:**
   - Aller sur https://contacts.google.com
   - Chercher le contact créé par nom ou email

### Test manuel via API (curl)

**Créer un contact:**
```bash
curl -X POST http://localhost:5001/google-contacts/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Contact",
    "email": "test@exemple.com"
  }'
```

### Test avec script

Créer un fichier `test-contacts.sh`:
```bash
#!/bin/bash

# Obtenir un token JWT (remplacer avec votre méthode d'authentification)
JWT_TOKEN="your_jwt_token_here"

# Créer un contact
echo "Création d'un contact..."
curl -X POST http://localhost:5001/google-contacts/create \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Contact Test API",
    "email": "contact.test@exemple.com"
  }' | jq .

echo "Contact créé avec succès !"
```

Rendre le script exécutable et le lancer:
```bash
chmod +x test-contacts.sh
./test-contacts.sh
```

## Configuration

### Variables d'environnement (Backend)

Dans `back/.env`:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
```

**Note:** Google Contacts utilise le même refresh token que Gmail et Calendar. Tous les contacts seront créés dans le compte Google associé à ce refresh token.

### Scopes OAuth2

Assurez-vous que votre application OAuth2 a les scopes suivants:
- `https://www.googleapis.com/auth/contacts` (lecture et écriture)
- Ou `https://www.googleapis.com/auth/contacts.readonly` (lecture seule)

### Configuration Google Cloud Console

1. Aller sur https://console.cloud.google.com
2. Sélectionner votre projet
3. Activer l'API "People API"
4. Configurer l'écran de consentement OAuth
5. Ajouter les scopes nécessaires

## Gestion des erreurs

### Erreurs courantes

**401 Unauthorized:**
- Cause: Token JWT invalide ou expiré
- Solution: Se reconnecter à l'application

**400 Bad Request:**
- Cause: Champs "name" ou "email" manquants
- Solution: Vérifier que tous les champs requis sont remplis

**403 Forbidden:**
- Cause: Refresh token invalide, expiré ou scopes insuffisants
- Solution: 
  - Vérifier que l'API People est activée dans Google Cloud Console
  - Vérifier que les scopes OAuth incluent `contacts`
  - Regénérer le refresh token avec `get-refresh-token.js`

**500 Internal Server Error:**
- Cause: Erreur Google People API
- Solution: Vérifier les logs backend pour plus de détails

### Feedback utilisateur

Le RightSidebar affiche des messages de feedback:
- 👤 "Création du contact en cours..." (pendant la requête)
- ✅ "Contact créé avec succès !" (succès)
- ❌ "Erreur : [message]" (échec)
- ❌ "Veuillez remplir tous les champs requis" (validation)

## Code Examples

### Frontend - Appel du service

```typescript
import { googleContactsService } from '../services/googleContactsService';

async function handleCreateContact() {
  try {
    const response = await googleContactsService.createContact({
      name: "Jean Dupont",
      email: "jean.dupont@exemple.com"
    });
    console.log("Contact créé:", response);
  } catch (error) {
    console.error("Erreur:", error);
  }
}
```

### Backend - Structure de la réponse Google API

```typescript
// Structure simplifiée de la réponse de Google People API
interface GoogleContact {
  resourceName: string;        // "people/c1234567890123456789"
  etag: string;
  names: Array<{
    displayName: string;
    familyName?: string;
    givenName?: string;
  }>;
  emailAddresses: Array<{
    value: string;
    type?: string;
  }>;
}
```

## Améliorations futures

1. **Champs supplémentaires**
   - Numéro de téléphone
   - Adresse postale
   - Date d'anniversaire
   - Organisation/entreprise
   - Notes

2. **Gestion avancée des contacts**
   - Lister les contacts existants
   - Rechercher un contact
   - Modifier un contact
   - Supprimer un contact
   - Créer des groupes de contacts

3. **Import/Export**
   - Importer des contacts depuis CSV
   - Exporter des contacts
   - Synchronisation bidirectionnelle

4. **Validation avancée**
   - Vérification du format email
   - Détection de doublons
   - Validation du numéro de téléphone

5. **Interface améliorée**
   - Afficher la liste des contacts créés
   - Aperçu du contact avant création
   - Édition en ligne

## Différences avec Gmail et Calendar

| Aspect | Gmail | Calendar | **Contacts** |
|--------|-------|----------|-------------|
| Token utilisé | Refresh token (backend) | Refresh token (backend) | **Refresh token (backend)** |
| Configuration | `.env` backend | `.env` backend | **`.env` backend** |
| API utilisée | Gmail API v1 | Calendar API v3 | **People API v1** |
| Scope OAuth | `gmail.send` | `calendar` | **`contacts`** |

**Note importante:** Les trois services (Gmail, Calendar et Contacts) utilisent maintenant le même refresh token configuré dans le backend. Tous les contacts seront créés dans le compte Google associé à ce refresh token, tout comme les emails sont envoyés depuis ce compte et les événements sont créés dans son calendrier.

## Ressources

- [Google People API Documentation](https://developers.google.com/people)
- [People API - Create Contact](https://developers.google.com/people/api/rest/v1/people/createContact)
- [OAuth 2.0 Google](https://developers.google.com/identity/protocols/oauth2)
- [Backend Controller](../back/src/googleContacts/googleContacts.controller.ts)
- [Backend Service](../back/src/googleContacts/googleContacts.service.ts)
- [Frontend Service](./src/services/googleContactsService.ts)

## Dépannage

### Le contact n'apparaît pas dans Google Contacts

1. Vérifier que la requête a retourné un code 200
2. Attendre quelques secondes (synchronisation)
3. Rafraîchir la page Google Contacts
4. Vérifier les logs backend pour d'éventuelles erreurs

### Erreur "Insufficient permissions"

1. Vérifier que l'API People est activée dans Google Cloud Console
2. Vérifier les scopes OAuth de l'application
3. Se déconnecter et se reconnecter pour obtenir les nouveaux scopes
4. Vérifier que l'utilisateur a accepté les permissions

### Le token expire rapidement

Les refresh tokens sont de longue durée et se renouvellent automatiquement. Si vous rencontrez des erreurs:
1. Vérifier que le refresh token est correctement configuré dans `.env`
2. Regénérer un nouveau refresh token avec `get-refresh-token.js` si nécessaire
3. Redémarrer le backend après modification du `.env`

## Support

Pour toute question ou problème:
1. Vérifier les logs backend: `docker-compose logs -f back`
2. Vérifier la console navigateur (F12)
3. Consulter la documentation Google People API
4. Contacter l'équipe de développement
