# Configuration Google Cloud Console - URIs de redirection

## ⚠️ ACTION REQUISE

Les nouvelles routes OAuth Google nécessitent d'ajouter les URIs de redirection dans Google Cloud Console.

## Étapes de configuration

### 1. Accéder à Google Cloud Console

1. Allez sur https://console.cloud.google.com
2. Connectez-vous avec le compte Google qui gère le projet
3. Sélectionnez votre projet dans la liste déroulante en haut

### 2. Accéder aux Credentials

1. Dans le menu de gauche, cliquez sur **"APIs & Services"**
2. Cliquez sur **"Credentials"**
3. Trouvez votre **"OAuth 2.0 Client ID"** dans la liste
4. Cliquez sur le nom du client pour l'éditer

### 3. Ajouter les URIs de redirection

Dans la section **"Authorized redirect URIs"**, ajoutez :

```
http://localhost:5001/auth/google/register/callback
http://localhost:5001/auth/google/login/callback
```

**Pour la production**, ajoutez également :
```
https://votredomaine.com/auth/google/register/callback
https://votredomaine.com/auth/google/login/callback
```

### 4. Sauvegarder

1. Cliquez sur **"Save"** en bas de la page
2. Attendez quelques secondes pour que les changements se propagent

## URIs de redirection complètes

Voici la liste complète des URIs à configurer :

### Développement (localhost)
- `http://localhost:5001/auth/google/register/callback` ✨ **NOUVEAU**
- `http://localhost:5001/auth/google/login/callback` ✨ **NOUVEAU**
- `http://localhost:5001/auth/google/callback` (ancienne, peut être supprimée)

### Production
- `https://votredomaine.com/auth/google/register/callback` ✨ **NOUVEAU**
- `https://votredomaine.com/auth/google/login/callback` ✨ **NOUVEAU**

## Vérification

Pour vérifier que la configuration est correcte :

1. Démarrez votre application
2. Essayez de vous inscrire avec Google
3. Si vous voyez une erreur **"redirect_uri_mismatch"**, vérifiez :
   - Que les URIs sont exactement identiques (pas d'espace, pas de / en trop)
   - Que vous avez sauvegardé les changements
   - Attendez 1-2 minutes et réessayez

## Erreurs communes

### "redirect_uri_mismatch"
**Cause** : L'URI de redirection n'est pas configurée dans Google Cloud Console

**Solution** : Ajoutez l'URI exacte dans les "Authorized redirect URIs"

### "access_denied"
**Cause** : L'utilisateur a refusé l'autorisation

**Solution** : Normale, l'utilisateur doit accepter les permissions

### "invalid_client"
**Cause** : CLIENT_ID ou CLIENT_SECRET incorrect

**Solution** : Vérifiez les variables dans `.env`

## Client ID actuel

Selon votre fichier `.env` :
```
GOOGLE_CLIENT_ID=812695795081-6o5u5qqb9v2je384n41dkksqegigvlnf.apps.googleusercontent.com
```

Cherchez ce Client ID dans Google Cloud Console pour le configurer.

## Capture d'écran de référence

Dans Google Cloud Console, la section devrait ressembler à :

```
OAuth 2.0 Client ID
Name: [Votre nom de client]
Client ID: 812695795081-6o5u5qqb9v2je384n41dkksqegigvlnf.apps.googleusercontent.com
Client secret: GOCSPX-...

Authorized JavaScript origins
  http://localhost:3000
  http://localhost:5001

Authorized redirect URIs
  http://localhost:5001/auth/google/register/callback ✓
  http://localhost:5001/auth/google/login/callback ✓
```

## Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs du backend pour voir l'erreur exacte
2. Vérifiez que les variables d'environnement sont correctes
3. Assurez-vous que le projet Google Cloud est actif
4. Vérifiez que l'API "Google+ API" est activée
