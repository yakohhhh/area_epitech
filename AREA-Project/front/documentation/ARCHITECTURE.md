# 🏗️ Frontend Architecture - Structure Organisée

## 📁 Structure Globale

```
src/
├── app/                    # Configuration de l'application
│   ├── layout/            # Composants de mise en page globaux
│   ├── pages/             # Pages de l'application
│   ├── providers/         # Fournisseurs de contexte (AuthProvider, etc.)
│   └── router/            # Configuration du routage
├── features/              # Fonctionnalités organisées par domaine métier
│   ├── auth/              # Authentification
│   └── dashboard/         # Tableau de bord
├── shared/                # Code partagé entre les fonctionnalités
│   ├── components/        # Composants UI réutilisables
│   ├── config/            # Configuration globale
│   ├── hooks/             # Hooks React partagés
│   ├── services/          # Services API et utilitaires
│   ├── types/             # Types TypeScript globaux
│   └── utils/             # Fonctions utilitaires
├── assets/                # Ressources statiques
└── styles/                # Styles CSS globaux
```

## 🎯 Principe d'Organisation

### 1. **Feature-First Architecture**
- Chaque fonctionnalité (`auth`, `dashboard`) est auto-contenue
- Contient ses propres composants, hooks, services, et types
- Facilite la maintenance et le développement en équipe

### 2. **Shared Resources**
- Code réutilisable dans `shared/`
- Composants UI generiques (`Button`, `Input`, `Modal`)
- Services communs (API client, configuration)
- Types et utilitaires partagés

### 3. **App Layer**
- Configuration de haut niveau
- Layout global et navigation
- Providers de contexte
- Routage de l'application

## 📋 Détail des Dossiers

### `/app` - Configuration Application
```
app/
├── layout/
│   ├── Layout.tsx         # Layout principal
│   ├── Header.tsx         # En-tête global
│   └── Footer.tsx         # Pied de page
├── pages/
│   ├── HomePage.tsx       # Page d'accueil
│   └── LoginPage.tsx      # Page de connexion
├── providers/             # (À créer)
│   ├── AuthProvider.tsx   # Contexte d'authentification
│   └── ThemeProvider.tsx  # Contexte de thème
└── router/                # (À créer)
    └── AppRouter.tsx      # Configuration des routes
```

### `/features` - Fonctionnalités Métier
```
features/
├── auth/                  # 🔐 Authentification
│   ├── components/
│   │   └── LoginForm.tsx  # Formulaire de connexion
│   ├── hooks/
│   │   └── useAuth.ts     # Hook d'authentification
│   ├── services/
│   │   └── auth.ts        # Service d'authentification
│   └── types/             # (À créer)
│       └── auth.types.ts  # Types spécifiques à l'auth
└── dashboard/             # 📊 Tableau de bord
    ├── components/
    │   └── DashboardHome.tsx
    ├── hooks/             # (À créer)
    ├── services/          # (À créer)
    └── types/             # (À créer)
```

### `/shared` - Code Partagé
```
shared/
├── components/            # 🧩 Composants UI
│   ├── Button.tsx         # Bouton réutilisable
│   ├── Input.tsx          # Champ de saisie
│   ├── Modal.tsx          # Modale
│   ├── Card.tsx           # Carte
│   └── Loading.tsx        # Indicateur de chargement
├── config/
│   ├── env.ts             # Variables d'environnement
│   └── index.ts           # Configuration globale
├── services/
│   ├── api.ts             # Client API
│   └── auth.ts            # Service d'authentification (legacy)
├── types/
│   └── common.ts          # Types globaux
├── utils/
│   └── common.ts          # Utilitaires (format, validation, etc.)
└── hooks/                 # (À créer)
    ├── useLocalStorage.ts # Hook de stockage local
    └── useDebounce.ts     # Hook de debounce
```

## 🚀 Avantages de cette Architecture

### ✅ **Scalabilité**
- Facile d'ajouter de nouvelles fonctionnalités
- Chaque feature est indépendante
- Code réutilisable centralisé

### ✅ **Maintenabilité**
- Séparation claire des responsabilités
- Code organisé par domaine métier
- Imports explicites et tracés

### ✅ **Collaboration**
- Équipes peuvent travailler sur des features séparées
- Moins de conflits de merge
- Code review plus focused

### ✅ **Performance**
- Tree-shaking optimisé
- Lazy loading par feature possible
- Bundle splitting plus efficace

## 📝 Bonnes Pratiques

### 1. **Imports**
```typescript
// ✅ Bon - Import depuis shared
import { Button } from '../../../shared/components';
import { apiClient } from '../../../shared/services';
import type { User } from '../../../shared/types';

// ✅ Bon - Import depuis la même feature
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';

// ❌ Éviter - Import cross-feature direct
import { DashboardCard } from '../../dashboard/components/DashboardCard';
```

### 2. **Exports**
```typescript
// ✅ Chaque dossier a son index.ts
export { LoginForm } from './LoginForm';
export { RegisterForm } from './RegisterForm';
```

### 3. **Types**
```typescript
// ✅ Types globaux dans shared/types
export interface User {
  id: string;
  email: string;
  name: string;
}

// ✅ Types spécifiques dans features/[feature]/types
export interface LoginFormData {
  email: string;
  password: string;
}
```

## 🔄 Migration Progressive

La structure actuelle permet une migration progressive :

1. **Phase 1** ✅ : Structure de base créée
2. **Phase 2** 🔄 : Ajouter React Router et providers
3. **Phase 3** 🔄 : Migrer vers des state managers (Zustand/Redux)
4. **Phase 4** 🔄 : Ajouter les tests par feature

## 📚 Extensions Futures

### Features à Ajouter
- `/features/areas` - Gestion des AREA
- `/features/services` - Services connectés
- `/features/profile` - Profil utilisateur
- `/features/settings` - Paramètres

### Shared à Étendre
- `/shared/hooks` - Plus de hooks réutilisables
- `/shared/constants` - Constantes globales
- `/shared/schemas` - Schémas de validation
- `/shared/providers` - Providers partagés

---

Cette architecture modulaire et scalable permet un développement efficace et maintenable de l'application AREA ! 🎉