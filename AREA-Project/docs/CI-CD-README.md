# AREA Project CI/CD Pipeline

Ce repository contient une pipeline CI/CD professionnelle complète pour le projet AREA, incluant un backend NestJS, un frontend React/Vite, et une application mobile Ionic.

## 🚀 Pipeline CI/CD Features

### ✅ CI/CD Workflows

1. **Backend CI/CD** (`backend-ci.yml`)
   - Tests automatisés avec Jest
   - Linting et vérifications TypeScript
   - Build et déploiement Docker
   - Scanning de sécurité avec Trivy
   - Couverture de code avec Codecov

2. **Frontend CI/CD** (`frontend-ci.yml`)
   - Tests unitaires et de régression visuelle
   - Audit de performance avec Lighthouse
   - Build et optimisation Vite
   - Déploiement automatisé

3. **Mobile CI/CD** (`mobile-ci.yml`)
   - Build Capacitor pour iOS et Android
   - Tests PWA et performance
   - Publication sur les stores (automatique)

4. **Docker Multi-Service** (`docker-build.yml`)
   - Build coordonné de tous les services
   - Tests d'intégration multi-services
   - Scanning de sécurité des images
   - Registry management avec GHCR

5. **Quality Gates** (`quality-gates.yml`)
   - Couverture de code minimale (80%)
   - Analyse SonarQube
   - Scan des vulnérabilités
   - Vérification des licences
   - Analyse de complexité du code

6. **Deployment** (`deployment.yml`)
   - Déploiement automatisé staging/production
   - Rollback automatique en cas d'échec
   - Health checks et smoke tests
   - Migrations de base de données

7. **Release Management** (`release.yml`)
   - Versioning sémantique automatique
   - Génération de changelog
   - Publication GitHub Releases
   - Build et tag des images Docker

## 🔧 Configuration Required

### GitHub Secrets

Ajoutez ces secrets dans les paramètres de votre repository GitHub :

```bash
# Container Registry
GITHUB_TOKEN (automatic)

# Security Scanning
SNYK_TOKEN=your_snyk_token
SONAR_TOKEN=your_sonar_token

# Cloud Deployment (si vous utilisez AWS)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_aws_region

# Database
STAGING_DATABASE_URL=your_staging_db_url
PROD_DATABASE_URL=your_prod_db_url

# Notifications (optionnel)
SLACK_WEBHOOK_URL=your_slack_webhook
DEPLOYMENT_TOKEN=your_deployment_token
```

### Environment Setup

1. **SonarQube Setup**
   ```bash
   # Créer un projet sur SonarCloud.io
   # Ajouter SONAR_TOKEN aux secrets
   ```

2. **Snyk Security Setup**
   ```bash
   # S'inscrire sur snyk.io
   # Obtenir le token API et l'ajouter aux secrets
   ```

3. **Container Registry**
   ```bash
   # GitHub Container Registry est configuré automatiquement
   # Les images seront disponibles sur ghcr.io
   ```

## 📋 Branch Strategy

- **`main`** : Production releases
- **`develop`** : Staging deployments  
- **`feature/*`** : Feature development
- **`hotfix/*`** : Emergency fixes

### Conventional Commits

Utilisez le format de commit conventionnel pour le versioning automatique :

```bash
feat: add user authentication
fix: resolve login issue
docs: update README
style: format code
refactor: improve performance
test: add integration tests
chore: update dependencies
```

## 🔄 Workflow Triggers

### Automatic Triggers

- **Push to main/develop** : Full CI/CD pipeline
- **Pull Request** : Quality checks et tests
- **Daily at 2 AM** : Security scans
- **New tag** : Release deployment

### Manual Triggers

- **Deployment** : Déploiement manuel vers staging/prod
- **Release** : Création manuelle de release
- **Quality Gates** : Scan de qualité à la demande

## 📊 Quality Requirements

### Code Coverage
- **Minimum** : 80% pour tous les services
- **Target** : 90%+ pour les nouvelles features

### Performance
- **Backend** : P95 < 100ms pour les APIs
- **Frontend** : Lighthouse score > 80 pour toutes les métriques
- **Mobile** : PWA score > 90

### Security
- **Vulnérabilités** : Aucune vulnérabilité HIGH/CRITICAL
- **Licences** : Uniquement des licences approuvées
- **Secrets** : Aucun secret hardcodé

## 🚀 Deployment Process

### Staging
1. Push vers `develop`
2. Pipeline CI/CD automatique
3. Déploiement vers staging
4. Tests d'intégration
5. Notification équipe

### Production
1. Merge vers `main`
2. Quality gates validation
3. Build release images
4. Déploiement production
5. Health checks
6. Monitoring alerts

## 📱 Mobile Deployment

### Android
- Build APK automatique
- Publication Google Play (internal testing)
- Production release manual

### iOS
- Build sur macOS runner
- Upload vers TestFlight
- App Store release manual

## 🔍 Monitoring & Alerts

### Health Checks
- API endpoints monitoring
- Database connectivity
- Service dependencies

### Performance Monitoring
- Response time tracking
- Error rate monitoring
- Resource utilization

### Security Monitoring
- Vulnerability alerts
- Dependency updates
- Access logging

## 📈 Metrics & Reports

### Code Quality
- Coverage reports (Codecov)
- Quality metrics (SonarQube)
- Complexity analysis

### Security
- Vulnerability reports (Snyk)
- License compliance
- Security policy adherence

### Performance
- Lighthouse reports
- Load testing results
- API benchmarks

## 🛠 Local Development

### Setup
```bash
# Cloner le repository
git clone https://github.com/YOUR-USERNAME/G-DEV-500-STG-5-1-area-1.git
cd G-DEV-500-STG-5-1-area-1

# Installer les dépendances
cd AREA-Project
npm install

# Démarrer les services
docker-compose up -d
```

### Testing
```bash
# Tests backend
cd back && npm test

# Tests frontend  
cd front && npm test

# Tests mobile
cd mobile && npm test
```

### Quality Checks
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Security audit
npm audit
```

## 🤝 Contributing

1. Fork le repository
2. Créer une feature branch (`git checkout -b feature/amazing-feature`)
3. Commit avec conventional commits
4. Push vers la branch (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- **Issues** : [GitHub Issues](https://github.com/YOUR-USERNAME/G-DEV-500-STG-5-1-area-1/issues)
- **Security** : Voir `SECURITY.md`
- **Documentation** : Dossier `docs/`