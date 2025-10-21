# 🚀 AREA - Scripts de Développement Unifiés

Ce projet dispose maintenant d'un système de scripts unifié pour lancer facilement tous les services de développement.

## 📋 Scripts Disponibles

### 🎯 Script Principal : `start-all.sh`
**Lance automatiquement tous les services (Backend + Frontend + Mobile)**

```bash
# Lancement standard (mode dev)
./start-all.sh

# Nettoyage complet
./start-all.sh clean

# Mode docker (utilise l'ancien dev.sh)
./start-all.sh docker
```

**Fonctionnalités :**
- ✅ Vérification automatique des dépendances
- ✅ Installation automatique des packages manquants
- ✅ Vérification et libération des ports occupés
- ✅ Démarrage coordonné des 3 services
- ✅ Surveillance continue des processus
- ✅ Arrêt propre avec Ctrl+C
- ✅ Interface colorée et informative

### 🎮 Script de Raccourcis : `quick.sh`
**Commandes rapides pour les tâches courantes**

```bash
# Voir toutes les commandes disponibles
./quick.sh help

# Lancer tous les services
./quick.sh start

# Lancer un service spécifique
./quick.sh backend    # Backend uniquement (port 5001)
./quick.sh frontend   # Frontend uniquement (port 5173)
./quick.sh mobile     # Mobile uniquement (port 5174)

# Tests et développement mobile
./quick.sh test-mobile   # Lance mobile + backend dans des onglets séparés
./quick.sh test-auth     # Guide pour tester l'authentification
./quick.sh test-api      # Teste la connectivité de l'API

# Utilitaires
./quick.sh status        # Statut des ports/services
./quick.sh health        # Santé des services avec tests HTTP
./quick.sh kill-ports    # Libère les ports 5001, 5173, 5174
./quick.sh logs          # Affiche les logs récents

# Maintenance
./quick.sh install       # Installe toutes les dépendances
./quick.sh clean         # Nettoie caches et node_modules
./quick.sh update        # Met à jour les dépendances
./quick.sh audit         # Audit de sécurité
```

## 🏗️ Architecture des Services

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **Backend** | 5001 | http://localhost:5001 | API NestJS avec authentification |
| **Frontend** | 5173 | http://localhost:5173 | Application web React |
| **Mobile** | 5174 | http://localhost:5174 | Application mobile Ionic React |

## 🔧 Configuration CORS

Le backend est configuré pour accepter les requêtes depuis :
- `http://localhost:3000` (Frontend React - développement)
- `http://localhost:5173` (Frontend React - Vite)
- `http://localhost:5174` (Mobile Ionic - développement)
- `http://localhost:5175` (Mobile Ionic - production)
- `ionic://localhost` (Mobile Ionic - capacitor)
- `capacitor://localhost` (Mobile Ionic - capacitor)

## 🚀 Démarrage Rapide

### Option 1 : Tout-en-un (Recommandé)
```bash
./start-all.sh
```
Cette commande va :
1. Vérifier les dépendances
2. Installer les packages manquants
3. Libérer les ports si nécessaire
4. Démarrer les 3 services
5. Afficher les URLs d'accès

### Option 2 : Services individuels
```bash
# Dans 3 terminaux différents :
./quick.sh backend
./quick.sh frontend  
./quick.sh mobile
```

### Option 3 : Test mobile prioritaire
```bash
./quick.sh test-mobile
```
Lance backend + mobile dans des onglets séparés (pour développement mobile)

## 🧪 Tests Suggérés

Après le démarrage, testez dans cet ordre :

1. **Santé de l'API** : http://localhost:5001/mobile/health
2. **Frontend Web** : http://localhost:5173
3. **Application Mobile** : http://localhost:5174
4. **Authentification Mobile** :
   - Allez sur http://localhost:5174
   - Cliquez sur "S'inscrire" ou "Se connecter"
   - Testez Google OAuth
5. **Connectivité Cross-Origin** : Vérifiez que le mobile peut appeler l'API

## 🛠️ Résolution de Problèmes

### Ports occupés
```bash
./quick.sh kill-ports  # Libère tous les ports
./quick.sh status      # Vérifie l'état des ports
```

### Dépendances manquantes
```bash
./quick.sh install     # Installe tout
./quick.sh clean       # Nettoie et réinstalle
```

### Services qui plantent
```bash
./quick.sh health      # Teste la santé des services
./quick.sh logs        # Affiche les logs récents
```

### Problèmes CORS
- Vérifiez que le backend écoute sur le port 5001
- Vérifiez la configuration CORS dans `back/src/main.ts`
- Les URLs mobiles incluent `ionic://` et `capacitor://`

## 📦 Structure des Scripts

```
start-all.sh          # Script principal - lance tout
quick.sh              # Raccourcis et utilitaires
AREA-Project/
├── back/             # Backend NestJS (port 5001)
├── front/            # Frontend React (port 5173) 
├── mobile/           # Mobile Ionic React (port 5174)
└── dev.sh            # Ancien script Docker (toujours disponible)
```

## ⚡ Scripts Existants

Les anciens scripts restent disponibles :
- `AREA-Project/dev.sh` : Orchestration Docker
- `test-mobile-auth.sh` : Test mobile (gnome-terminal)
- `test-api-connectivity.sh` : Test API

## 🎯 Workflow Recommandé

### Développement Standard
```bash
./start-all.sh        # Lance tout
# Développer...
# Ctrl+C pour arrêter tout proprement
```

### Développement Mobile Intensif
```bash
./quick.sh test-mobile # Mobile + Backend seulement
# Développer l'app mobile...
```

### Debug/Investigation
```bash
./quick.sh status      # État général
./quick.sh health      # Tests de connectivité
./quick.sh logs        # Logs récents
```

### Maintenance
```bash
./quick.sh clean       # Nettoyage périodique
./quick.sh update      # Mise à jour des packages
./quick.sh audit       # Sécurité
```

---

🎉 **Prêt à développer !** Les scripts gèrent tout automatiquement. Lancez `./start-all.sh` et c'est parti !