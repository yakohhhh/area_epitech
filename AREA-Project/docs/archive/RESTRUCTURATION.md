# Restructuration du projet AREA

## 📁 Nouvelle organisation

Le projet a été réorganisé pour une meilleure maintenabilité :

### Structure avant
```
AREA-Project/
├── build-all.sh
├── build-simple.sh
├── deploy.sh
├── setup-dev.sh
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── docker-compose.yml
├── Dockerfile.setup
├── DEVELOPMENT_SETUP.md
├── FINAL_VALIDATION.md
├── FRONTEND_REORGANIZATION.md
├── ONBOARDING.md
├── security-audit.sh
├── security-test.sh
├── package-lock.json (orphelin)
├── AREA-Project/ (dossier dupliqué vide)
├── back/
├── front/
└── README.md
```

### Structure après
```
AREA-Project/
├── 📁 back/               # Backend NestJS
├── 📁 front/              # Frontend React
├── 📁 docker/             # Configuration Docker
│   ├── docker-compose.dev.yml
│   ├── docker-compose.prod.yml
│   ├── docker-compose.yml
│   └── Dockerfile.setup
├── 📁 scripts/            # Scripts de build et déploiement
│   ├── build-all.sh
│   ├── build-simple.sh
│   ├── deploy.sh
│   └── setup-dev.sh
├── 📁 docs/              # Documentation
│   ├── DEVELOPMENT_SETUP.md
│   ├── FINAL_VALIDATION.md
│   ├── FRONTEND_REORGANIZATION.md
│   └── ONBOARDING.md
├── 📁 tools/             # Outils de sécurité
│   ├── security-audit.sh
│   └── security-test.sh
├── dev.sh                # Script de raccourci
├── .dockerignore
├── .gitignore
└── README.md
```

## 🔧 Nouveaux raccourcis

Un script `dev.sh` a été créé pour simplifier l'utilisation :

```bash
./dev.sh setup    # Configuration initiale
./dev.sh start     # Démarre les services
./dev.sh stop      # Arrête les services
./dev.sh logs      # Affiche les logs
./dev.sh shell     # Shell dans le frontend
./dev.sh build     # Build complet
./dev.sh deploy    # Déploiement
./dev.sh security  # Audit de sécurité
```

## ✅ Modifications apportées

1. **Organisation des fichiers** :
   - Scripts → `scripts/`
   - Documentation → `docs/`
   - Configuration Docker → `docker/`
   - Outils de sécurité → `tools/`

2. **Mise à jour des chemins** :
   - Tous les scripts utilisent les nouveaux chemins
   - Script `dev.sh` pour faciliter l'utilisation
   - README mis à jour avec la nouvelle structure

3. **Nettoyage** :
   - Suppression du dossier `AREA-Project/` dupliqué
   - Suppression du `package-lock.json` orphelin
   - Permissions correctes sur tous les scripts

## 🚀 Utilisation

### Pour démarrer le projet :
```bash
# Configuration initiale (une seule fois)
./dev.sh setup

# Démarrage quotidien
./dev.sh start
```

### Pour le développement :
```bash
# Voir les logs
./dev.sh logs

# Accéder au container
./dev.sh shell

# Arrêter les services
./dev.sh stop
```

Cette restructuration rend le projet plus propre, plus facile à naviguer et plus professionnel !