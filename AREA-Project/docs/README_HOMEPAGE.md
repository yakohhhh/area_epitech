# Nouvelle Homepage Non Connectée - Mobile

## Vue d'ensemble

Cette mise à jour ajoute une nouvelle homepage pour les utilisateurs non connectés avec une navigation complète et des restrictions d'accès appropriées.

## Nouveaux Composants

### 1. UnconnectedHomepage (`/src/components/home/UnconnectedHomepage.tsx`)
- Homepage principale avec contenu adaptatif selon le statut de connexion
- Sections : Hero, Services, Étapes, Fonctionnalités, CTA
- Navigation intégrée avec TopBar et SideNavbar

### 2. TopBar (`/src/components/ui/TopBar.tsx`)
- Barre de navigation supérieure
- Affiche le menu hamburger et les actions de connexion/profil
- Adaptatif selon le statut d'authentification

### 3. SideNavbar (`/src/components/ui/SideNavbar.tsx`)
- Menu latéral avec navigation complète
- Gestion des accès restreints pour les utilisateurs non connectés
- Indications visuelles pour les fonctionnalités nécessitant une connexion

## Nouvelles Pages

### Pages Protégées (nécessitent une authentification)
- `AutomationsPage` - Gestion des automatisations
- `IntegrationsPage` - Configuration des intégrations
- `ProfilePage` - Gestion du profil utilisateur

### Pages Publiques
- `DemoPage` - Démonstration de la plateforme

## Structure de Navigation

```
/ (Homepage) - Accessible à tous
├── /auth - Connexion/Inscription
├── /demo - Démonstration
├── /dashboard - Protégé ⚠️
├── /automations - Protégé ⚠️
├── /integrations - Protégé ⚠️
├── /profile - Protégé ⚠️
└── /settings - Protégé ⚠️
```

## Fonctionnalités

### Gestion des Accès
- **Utilisateurs connectés** : Accès complet à toutes les fonctionnalités
- **Utilisateurs non connectés** : 
  - Accès à la homepage, démo, et authentification
  - Redirection automatique vers `/auth` pour les pages protégées
  - Indications visuelles des restrictions

### Interface Adaptative
- Contenu différent selon le statut de connexion
- Messages et boutons adaptatifs
- Bannière d'information pour les utilisateurs non connectés

### Navigation
- Menu hamburger avec toutes les sections
- Indications visuelles pour les pages protégées
- Boutons de navigation contextuels

## Utilisation

### Pour les utilisateurs non connectés
1. Accès à la homepage avec présentation complète
2. Navigation possible mais avec restrictions
3. Encouragement à créer un compte
4. Accès à la démonstration

### Pour les utilisateurs connectés
1. Accès direct au dashboard depuis la homepage
2. Navigation complète sans restrictions
3. Profil accessible depuis la TopBar

## Styles et Design

- Design cohérent avec le thème existant
- Gradients et couleurs de la charte graphique
- Interface responsive et mobile-first
- Icônes Ionicons pour la cohérence

## Installation et Démarrage

```bash
cd mobile
npm install
npm start
```

## Notes Techniques

- Utilise React avec Ionic React
- Gestion d'état avec le store d'authentification existant
- Navigation avec React Router
- Composants protégés avec ProtectedRoute
- TypeScript pour la sécurité des types

## Prochaines Étapes

1. Implémentation des pages protégées (dashboard, automations, etc.)
2. Ajout de contenu réel dans la démonstration
3. Intégration avec l'API backend
4. Tests et optimisations