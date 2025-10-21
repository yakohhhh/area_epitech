# 🛠️ Guide de Configuration Développement - AREA Project

## 📋 Table des matières
- [Vue d'ensemble](#vue-densemble)
- [Configuration automatisée](#configuration-automatisée)
- [Configuration manuelle](#configuration-manuelle)
- [Workflow de développement](#workflow-de-développement)
- [Outils de qualité de code](#outils-de-qualité-de-code)
- [Tests et validation](#tests-et-validation)
- [Déploiement](#déploiement)

## 🎯 Vue d'ensemble

Ce projet utilise une configuration complète d'outils de qualité de code et d'automatisation :

### Stack Technologique
- **Frontend** : React 18 + TypeScript + Vite
- **Backend** : NestJS + TypeScript + Prisma
- **Base de données** : SQLite (dev) / PostgreSQL (prod)
- **Containerisation** : Docker + Docker Compose

### Outils de Qualité de Code
- **ESLint** : Analyse statique et correction automatique
- **Prettier** : Formatage automatique du code
- **Husky** : Git hooks pour l'automatisation
- **lint-staged** : Exécution sur les fichiers staged
- **Commitlint** : Validation des messages de commit (Conventional Commits)
- **Jest** : Tests unitaires
- **TypeScript** : Vérification de types

## 🚀 Configuration automatisée

### Option 1: Docker Compose (Recommandé pour nouveaux développeurs)

```bash
# Clone du repository
git clone <repository-url>
cd G-DEV-500-STG-5-1-area-1/AREA-Project

# Démarrage complet avec Docker
docker-compose up --build
```

**Ce qui est automatiquement configuré :**
- ✅ Installation des dépendances frontend et backend
- ✅ Configuration des hooks Git (Husky)
- ✅ Base de données avec schéma Prisma
- ✅ Variables d'environnement
- ✅ Serveurs de développement (hot-reload)

### Option 2: Script de configuration automatique

```bash
# Exécution du script de setup complet
./build-all.sh
```

## 📦 Configuration manuelle

### Prérequis
- Node.js 18+ 
- npm 9+
- Docker & Docker Compose
- Git

### Installation étape par étape

#### 1. Clone et setup initial
```bash
git clone <repository-url>
cd G-DEV-500-STG-5-1-area-1/AREA-Project
```

#### 2. Configuration des hooks Git (OBLIGATOIRE)
```bash
# À la racine du projet (où se trouve .git)
cd /path/to/G-DEV-500-STG-5-1-area-1
npx husky install
chmod +x .githooks/pre-commit .githooks/commit-msg
```

#### 3. Installation Frontend
```bash
cd AREA-Project/front
npm install
cp .env.example .env
```

#### 4. Installation Backend
```bash
cd ../back
npm install
npx prisma generate
npx prisma db push
```

## 🔄 Workflow de développement

### Commit automatisé avec qualité de code

```bash
# 1. Développement normal
git add .

# 2. Commit (déclenche automatiquement)
git commit -m "feat: add new feature"
```

**Ce qui se passe automatiquement :**
1. **Pre-commit hook** s'exécute
2. **lint-staged** traite les fichiers modifiés
3. **ESLint --fix** corrige les erreurs automatiquement
4. **Prettier --write** formate le code
5. **Commit-msg hook** valide le message avec commitlint
6. ✅ **Commit accepté** si tout passe, ❌ **rejeté** sinon

### Format des messages de commit (Conventional Commits)
```bash
feat: add new feature        ✅
fix: resolve bug            ✅  
docs: update documentation  ✅
style: format code          ✅
refactor: improve code      ✅
test: add unit tests        ✅
chore: update dependencies  ✅

Invalid commit message      ❌
Add feature                 ❌
```

### Commandes de développement

#### Frontend
```bash
cd front/
npm run dev          # Serveur de développement
npm run build        # Build production
npm run test         # Tests Jest
npm run lint         # Vérification ESLint
npm run lint:fix     # Correction ESLint
npm run format       # Formatage Prettier
npm run type-check   # Vérification TypeScript
```

#### Backend
```bash
cd back/
npm run start:dev    # Serveur de développement
npm run build        # Build production
npm run test         # Tests Jest
npm run test:e2e     # Tests end-to-end
```

## 🛡️ Outils de qualité de code

### ESLint
- **Configuration** : `.eslintrc.js`
- **Règles** : TypeScript, React, Accessibilité (jsx-a11y)
- **Auto-fix** : Activé dans pre-commit hook

### Prettier
- **Configuration** : `.prettierrc`
- **Ignore** : `.prettierignore`
- **Intégration** : ESLint + IDE

### Husky + lint-staged
- **Hooks** : `.githooks/pre-commit`, `.githooks/commit-msg`
- **Cible** : Fichiers staged uniquement
- **Performance** : Traitement incrémental

### Commitlint
- **Configuration** : `commitlint.config.js`
- **Standard** : Conventional Commits
- **Validation** : Messages de commit

## 🧪 Tests et validation

### Tests unitaires (Jest)
```bash
npm test                    # Tous les tests
npm test -- --watch        # Mode watch
npm test -- --coverage     # Rapport de couverture
```

### Validation complète avant push
```bash
# Frontend
npm run lint && npm run type-check && npm run test && npm run build

# Backend  
npm run lint && npm run test && npm run build
```

## 🐳 Déploiement

### Développement
```bash
docker-compose up
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up
```

### Scripts disponibles
- `./build-all.sh` : Build complet (front + back)
- `./build-simple.sh` : Build basique
- `./deploy.sh` : Déploiement automatique
- `./security-audit.sh` : Audit de sécurité
- `./security-test.sh` : Tests de sécurité

## ❓ FAQ

### Q: Les hooks Git ne fonctionnent pas ?
**R:** Assurez-vous que Husky est installé à la racine du projet Git :
```bash
cd /path/to/G-DEV-500-STG-5-1-area-1
npx husky install
```

### Q: ESLint/Prettier ne s'exécutent pas automatiquement ?
**R:** Vérifiez que les hooks sont exécutables :
```bash
chmod +x .githooks/pre-commit .githooks/commit-msg
```

### Q: Les tests Jest échouent ?
**R:** Vérifiez la configuration des variables d'environnement et des mocks Vite.

### Q: Erreur TypeScript sur import.meta ?
**R:** Le fichier `vite-env.d.ts` doit être présent dans `src/`.

## 📞 Support

Pour toute question ou problème :
1. Vérifiez cette documentation
2. Consultez les logs d'erreur
3. Vérifiez la configuration des outils
4. Contactez l'équipe de développement

---

*Documentation mise à jour le $(date)*