# 🚀 Guide de test rapide - Gmail dans ConnectedDashboard

## Test en 5 étapes

### 1. Démarrer l'application
```bash
cd AREA-Project
docker-compose up -d
```

### 2. Se connecter
- Allez sur `http://localhost:3000/login`
- Connectez-vous avec vos identifiants

### 3. Accéder au ConnectedDashboard
- Allez sur `http://localhost:3000/connected-dashboard`
- Ou cliquez sur le lien dans le menu

### 4. Ajouter et configurer Gmail
1. **Glisser-déposer** : Prenez l'icône ✉️ Gmail dans la barre de gauche et déposez-la au centre
2. **Connecter** : Cliquez sur le service Gmail au centre, puis sur "Se connecter" à droite
3. **Sélectionner l'action** : Cliquez sur "Envoyer un mail"
4. **Remplir le formulaire** :
   - À : `votre-email@gmail.com` (remplacez par votre email)
   - Objet : `Test AREA - ConnectedDashboard`
   - Contenu : `Ceci est un email de test envoyé depuis le ConnectedDashboard !`

### 5. Tester l'envoi
1. Cliquez sur le bouton **"Tester"**
2. Vous verrez :
   - "📤 Envoi de l'email en cours..."
   - Puis "✅ Email envoyé avec succès !"
3. Vérifiez votre boîte mail pour confirmer la réception

## Résultat attendu

✅ Email reçu dans votre boîte de réception
✅ Message de succès affiché dans l'interface
✅ Aucune erreur dans la console

## Dépannage

### "❌ Erreur : Failed to send email"
→ Vérifiez que `GOOGLE_REFRESH_TOKEN` est configuré dans `back/.env`

### "❌ Veuillez remplir tous les champs requis"
→ Assurez-vous que tous les champs (À, Objet, Contenu) sont remplis

### "Service non connecté"
→ Cliquez d'abord sur le bouton "Se connecter"

### L'email n'arrive pas
→ Vérifiez vos spams
→ Vérifiez les logs backend : `docker-compose logs area_backend`

## Capture d'écran du flux

```
┌────────────────────────────────────────────────────────────┐
│  Services        │    Tableau Central    │  Configuration  │
│                  │                        │                 │
│  ✉️ Gmail        │   [Gmail ✉️]          │  Configurer:    │
│  📁 Drive        │                        │  Gmail          │
│  💬 Slack        │   Glissez ici →        │                 │
│  🗒️ Notion       │                        │  [Se connecter] │
│                  │                        │                 │
│  [Rechercher...] │                        │  Actions:       │
│                  │                        │  • Envoyer mail │
│                  │                        │                 │
│                  │                        │  À: test@...    │
│                  │                        │  Objet: ...     │
│                  │                        │  Contenu: ...   │
│                  │                        │                 │
│                  │                        │  [Tester]       │
│                  │                        │  [Enregistrer]  │
└────────────────────────────────────────────────────────────┘
```

## Vidéo de démonstration suggérée

1. Ouvrir ConnectedDashboard
2. Glisser Gmail au centre
3. Cliquer sur Gmail
4. Se connecter
5. Sélectionner "Envoyer un mail"
6. Remplir le formulaire
7. Cliquer sur "Tester"
8. Montrer le feedback de succès
9. Ouvrir la boîte mail et montrer l'email reçu

## Temps estimé : 2 minutes ⏱️
