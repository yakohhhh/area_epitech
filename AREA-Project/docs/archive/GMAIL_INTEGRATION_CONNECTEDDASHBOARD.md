# Gmail Integration - ConnectedDashboard

## ✅ Configuration complète

Le service Gmail est maintenant entièrement connecté entre le backend et le frontend dans le ConnectedDashboard.

## Architecture

### Backend
- **Controller** : `back/src/email/email.controller.ts`
  - Route : `POST /email/send`
  - Paramètres : `{ to, subject, body }`

- **Service** : `back/src/email/email.service.ts`
  - Utilise l'API Gmail de Google
  - Authentification OAuth2 avec refresh token

### Frontend
- **Service** : `front/src/services/gmailService.ts`
  - Méthode : `sendEmail(emailData)`
  - Appelle l'API backend `/email/send`

- **Composant** : `front/src/features/ConnectedDashboard/components/RightSidebar.tsx`
  - Fonction `handleTestAction()` qui appelle le service Gmail
  - Bouton "Tester" fonctionnel

- **Catalogue** : `front/src/features/ConnectedDashboard/components/servicesCatalog.ts`
  - Service Gmail déjà configuré avec l'action "Envoyer un mail"

## Comment utiliser

### 1. Accéder au ConnectedDashboard
```
http://localhost:3000/connected-dashboard
```

### 2. Ajouter Gmail
1. Glissez le service **Gmail** (✉️) depuis la barre latérale gauche
2. Déposez-le dans la zone centrale

### 3. Connecter Gmail
1. Cliquez sur le service Gmail dans la zone centrale
2. Dans la barre latérale droite, cliquez sur **"Se connecter"**
3. Le service passe en mode "connecté"

### 4. Configurer l'action "Envoyer un mail"
1. Sélectionnez l'action **"Envoyer un mail"** dans la liste
2. Remplissez les champs :
   - **À** : `destinataire@exemple.com`
   - **Objet** : `Test depuis AREA`
   - **Contenu** : `Ceci est un test d'envoi d'email`

### 5. Tester l'envoi
1. Cliquez sur le bouton **"Tester"**
2. Vous verrez le message :
   - "📤 Envoi de l'email en cours..."
   - Puis "✅ Email envoyé avec succès !"

## Configuration Backend requise

Le backend nécessite les variables d'environnement suivantes dans `.env` :

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:5001/auth/google/callback
GOOGLE_REFRESH_TOKEN=...
```

### Comment obtenir le GOOGLE_REFRESH_TOKEN

Le refresh token est déjà configuré dans votre `.env` :
```
GOOGLE_REFRESH_TOKEN=1//04Xs9nMNDqFcICgYIARAAGAQSNwF-L9IrOln46NacwH5pFxiQNBq3W1D4YP8M9yDIdK9LIVNUPLTeYYxTtknQGx8rrobkpmscW_k
```

Si vous devez en générer un nouveau, utilisez le script :
```bash
cd AREA-Project/back
node get-refresh-token.js
```

## Flux d'exécution

```
ConnectedDashboard (Frontend)
  ↓ User clique "Tester"
RightSidebar.handleTestAction()
  ↓ Récupère les valeurs du formulaire
gmailService.sendEmail({ to, subject, body })
  ↓ HTTP POST avec token JWT
Backend: /email/send
  ↓ EmailController
EmailService.sendEmail()
  ↓ Google Gmail API
Gmail envoie l'email ✅
  ↓ Réponse
Frontend affiche "✅ Email envoyé avec succès !"
```

## Fonctionnalités

### ✅ Implémenté
- Drag & Drop du service Gmail
- Connexion/Déconnexion du service
- Action "Envoyer un mail" avec formulaire
- Bouton "Tester" fonctionnel
- Appel API backend réel
- Feedback utilisateur (succès/erreur)
- Validation des champs requis

### 🔄 À implémenter (optionnel)
- Action "Marquer comme lu"
- OAuth flow pour que chaque utilisateur utilise son propre compte Gmail
- Gestion des pièces jointes
- Templates d'emails
- Historique des emails envoyés

## Gestion des erreurs

Le composant gère plusieurs types d'erreurs :

1. **Champs manquants** : 
   ```
   ❌ Veuillez remplir tous les champs requis
   ```

2. **Erreur réseau** :
   ```
   ❌ Erreur : Une erreur réseau est survenue
   ```

3. **Erreur backend** :
   ```
   ❌ Erreur : Failed to send email: ...
   ```

4. **Succès** :
   ```
   ✅ Email envoyé avec succès !
   ```

## Sécurité

- Le token JWT de l'utilisateur est envoyé dans le header `Authorization`
- Le backend vérifie l'authentification pour toutes les routes
- Les credentials Google OAuth sont stockés côté backend uniquement
- Le refresh token permet d'envoyer des emails sans re-authentification

## Test manuel

### Scénario complet

1. **Connexion à l'application**
   ```bash
   http://localhost:3000/login
   ```

2. **Accès au ConnectedDashboard**
   ```bash
   http://localhost:3000/connected-dashboard
   ```

3. **Ajouter Gmail**
   - Glisser Gmail depuis la gauche
   - Déposer dans la zone centrale

4. **Configurer**
   - Cliquer sur Gmail
   - Se connecter
   - Sélectionner "Envoyer un mail"
   - Remplir :
     - À : `votre-email@gmail.com`
     - Objet : `Test AREA`
     - Contenu : `Ceci est un test`

5. **Tester**
   - Cliquer sur "Tester"
   - Vérifier le feedback
   - Vérifier la réception de l'email

## Logs

Pour déboguer, vérifiez les logs :

### Backend
```bash
cd AREA-Project
docker-compose logs -f area_backend
```

### Frontend (console navigateur)
- Ouvrir F12
- Onglet Console
- Voir les requêtes réseau dans l'onglet Network

## Fichiers modifiés/créés

### Créés
- ✨ `front/src/services/gmailService.ts`
- 📝 `docs/GMAIL_INTEGRATION_CONNECTEDDASHBOARD.md`

### Modifiés
- 📝 `front/src/features/ConnectedDashboard/components/RightSidebar.tsx`

### Déjà existants (utilisés)
- `back/src/email/email.controller.ts`
- `back/src/email/email.service.ts`
- `front/src/features/ConnectedDashboard/components/servicesCatalog.ts`

## Notes

- Le service Gmail dans le catalogue utilise l'icône ✉️
- Les actions sont définies dans `servicesCatalog.ts`
- Le store Zustand gère l'état des services actifs
- Le drag & drop est géré par l'API HTML5 native

## Support

Si l'envoi d'email ne fonctionne pas :

1. Vérifier que le backend est démarré
2. Vérifier les logs du backend pour les erreurs
3. Vérifier que `GOOGLE_REFRESH_TOKEN` est valide
4. Vérifier que l'utilisateur est bien connecté (token JWT valide)
5. Vérifier la connexion internet

## Prochaines étapes

Pour améliorer l'intégration :

1. **OAuth personnel** : Permettre à chaque utilisateur d'utiliser son propre compte Gmail
2. **Templates** : Créer des templates d'emails réutilisables
3. **Automation** : Intégrer Gmail dans des workflows automatisés (IFTTT-like)
4. **Monitoring** : Ajouter un dashboard pour voir les emails envoyés
