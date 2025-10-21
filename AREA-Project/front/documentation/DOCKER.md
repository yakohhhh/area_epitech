# 🐳 AREA Project - Setup Docker Complet & Tests de Sécurité

Guide complet pour le setup, déploiement et tests de sécurité de l'application AREA avec Docker.

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Installation & Setup](#installation--setup)
- [Build des Images](#build-des-images)
- [Lancement des Services](#lancement-des-services)
- [Tests de Sécurité](#tests-de-sécurité)
- [Monitoring & Logs](#monitoring--logs)
- [Optimisations](#optimisations)
- [Déploiement Production](#déploiement-production)
- [Dépannage](#dépannage)

## 🔧 Prérequis

### Vérification des outils

```bash
# Vérifier Docker
docker --version
# ✅ Docker version 24.0.0+

# Vérifier Docker Compose
docker-compose --version
# ✅ docker-compose version 2.0.0+

# Activer BuildKit (obligatoire)
export DOCKER_BUILDKIT=1

# Vérifier l'espace disque disponible
df -h
# ✅ Au moins 5GB libres
```

### Installation des outils de sécurité

```bash
# Docker Scout (inclus dans Docker Desktop)
docker scout --help

# Installation de Trivy
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

# Installation de Grype
curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin

# Installation de Hadolint (Dockerfile linter)
docker pull hadolint/hadolint

# Installation de Dive (analyse des layers)
wget https://github.com/wagoodman/dive/releases/download/v0.10.0/dive_0.10.0_linux_amd64.deb
sudo dpkg -i dive_0.10.0_linux_amd64.deb
```

## 🚀 Installation & Setup

### 1. Cloner et préparer le projet

```bash
# Se placer dans le projet AREA
cd /home/depop/delivery/semester_tek3/G-DEV-500-STG-5-1-area-1/AREA-Project

# Vérifier la structure
tree -L 3
```

### 2. Configuration des variables d'environnement

```bash
# Créer les fichiers .env
cp back/.env.example back/.env
cp front/.env.example front/.env

# Éditer les variables backend
nano back/.env
```

**Contenu back/.env :**
```env
# Base de données
DATABASE_URL="file:./database/dev.db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="24h"

# API Config
PORT=5001
NODE_ENV=production

# CORS
CORS_ORIGIN="http://localhost:3000"
```

**Contenu front/.env :**
```env
# API Backend
VITE_API_URL=http://localhost:5001
VITE_APP_NAME="AREA"

# Environment
NODE_ENV=production
```

## 🏗️ Build des Images

### 1. Build Frontend (React + Nginx)

```bash
# Se placer dans le frontend
cd front/

# Build avec cache optimisé
docker build \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --tag area-frontend:latest \
  --tag area-frontend:v1.0.0 \
  .

# Vérifier la taille de l'image
docker images area-frontend
# REPOSITORY        TAG       SIZE
# area-frontend     latest    ~35MB
```

### 2. Build Backend (NestJS)

```bash
# Se placer dans le backend
cd ../back/

# Build de l'image backend
docker build \
  --tag area-backend:latest \
  --tag area-backend:v1.0.0 \
  .

# Vérifier la taille
docker images area-backend
```

### 3. Build avec Docker Compose

```bash
# Retour à la racine du projet
cd ..

# Build de tous les services
docker-compose build --parallel

# Build avec cache
docker-compose build --build-arg BUILDKIT_INLINE_CACHE=1
```

## 🚀 Lancement des Services

### 1. Lancement en développement

```bash
# Lancer tous les services
docker-compose up -d

# Vérifier les statuts
docker-compose ps
# NAME              COMMAND                  SERVICE     STATUS
# area_backend      "sh -c 'npx prisma …"   backend     Up 30 seconds
# area_frontend     "/docker-entrypoint.…"   frontend    Up 30 seconds

# Suivre les logs
docker-compose logs -f
```

### 2. Lancement en production

```bash
# Utiliser le profil production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Ou avec des ressources limitées
docker run -d \
  --name area-frontend-prod \
  --memory="64m" \
  --cpus="0.5" \
  -p 80:80 \
  --restart unless-stopped \
  area-frontend:latest
```

### 3. Test des services

```bash
# Test Frontend
curl -I http://localhost:3000
# HTTP/1.1 200 OK

# Test Backend
curl -I http://localhost:5001/health
# HTTP/1.1 200 OK

# Test avec timeout
timeout 10s curl http://localhost:3000 || echo "Timeout atteint"
```

## 🔒 Tests de Sécurité

### 1. Scan des vulnérabilités avec Docker Scout

```bash
# Scan du frontend
docker scout cves area-frontend:latest
docker scout recommendations area-frontend:latest

# Scan du backend
docker scout cves area-backend:latest

# Rapport détaillé en JSON
docker scout cves area-frontend:latest --format sarif --output frontend-cves.sarif
```

### 2. Scan avec Trivy (Scanner de vulnérabilités)

```bash
# Scan complet du frontend
trivy image area-frontend:latest

# Scan avec niveau de sévérité
trivy image --severity HIGH,CRITICAL area-frontend:latest

# Scan du backend
trivy image area-backend:latest

# Export en JSON
trivy image --format json --output frontend-report.json area-frontend:latest

# Scan des secrets
trivy fs --security-checks secret ./front/
```

### 3. Scan avec Grype

```bash
# Scan frontend
grype area-frontend:latest

# Scan avec output formaté
grype area-frontend:latest -o json > frontend-grype.json

# Scan backend
grype area-backend:latest -o table
```

### 4. Audit des Dockerfiles avec Hadolint

```bash
# Audit du Dockerfile frontend
docker run --rm -i hadolint/hadolint < front/Dockerfile

# Audit avec règles personnalisées
docker run --rm -i hadolint/hadolint \
  --ignore DL3008 \
  --ignore DL3009 \
  < front/Dockerfile

# Audit du backend
docker run --rm -i hadolint/hadolint < back/Dockerfile
```

### 5. Analyse des layers avec Dive

```bash
# Analyser les layers du frontend
dive area-frontend:latest

# Analyser l'efficacité
dive area-frontend:latest --ci

# Backend
dive area-backend:latest
```

### 6. Tests de sécurité runtime

```bash
# Vérifier les utilisateurs non-root
docker exec area_frontend id
# uid=1001(nginx-user) gid=1001(nginx-group)

docker exec area_backend id
# Doit être non-root aussi

# Test des capabilities
docker inspect area_frontend --format='{{.HostConfig.CapAdd}}'
docker inspect area_frontend --format='{{.HostConfig.CapDrop}}'

# Vérifier les volumes montés
docker inspect area_frontend --format='{{.Mounts}}'
```

### 7. Tests de pénétration avec OWASP ZAP

```bash
# Lancer ZAP en mode daemon
docker run -d --name zap \
  -p 8090:8080 \
  zaproxy/zap-stable zap-x.sh -daemon -host 0.0.0.0 -port 8080

# Scanner l'application
docker exec zap zap-cli quick-scan http://host.docker.internal:3000

# Rapport HTML
docker exec zap zap-cli report -o /tmp/zap-report.html -f html

# Copier le rapport
docker cp zap:/tmp/zap-report.html ./security-report.html
```

## 📊 Monitoring & Logs

### 1. Health Checks

```bash
# Vérifier les health checks
docker inspect area_frontend --format='{{.State.Health.Status}}'
# healthy

# Logs des health checks
docker inspect area_frontend --format='{{range .State.Health.Log}}{{.Output}}{{end}}'

# Test manuel des endpoints
curl http://localhost:3000/health
curl http://localhost:5001/health
```

### 2. Monitoring des ressources

```bash
# Stats en temps réel
docker stats area_frontend area_backend

# Usage détaillé
docker exec area_frontend cat /proc/meminfo | head -5
docker exec area_frontend cat /proc/loadavg

# Espace disque
docker exec area_frontend df -h
```

### 3. Gestion des logs

```bash
# Logs des containers
docker logs area_frontend --tail 100 -f
docker logs area_backend --tail 100 -f

# Logs avec timestamps
docker logs area_frontend --timestamps

# Logs d'erreur uniquement
docker logs area_backend 2>&1 | grep -i error

# Exporter les logs
docker logs area_frontend > frontend-logs.txt 2>&1
```

### 4. Monitoring avancé avec cAdvisor

```bash
# Lancer cAdvisor
docker run -d \
  --name cadvisor \
  -p 8080:8080 \
  -v /:/rootfs:ro \
  -v /var/run:/var/run:ro \
  -v /sys:/sys:ro \
  -v /var/lib/docker/:/var/lib/docker:ro \
  gcr.io/cadvisor/cadvisor:latest

# Accéder aux métriques
curl http://localhost:8080/metrics
```

## ⚡ Optimisations

### 1. Optimisation des images

```bash
# Nettoyer les images inutilisées
docker image prune -f

# Nettoyer complètement
docker system prune -a --volumes -f

# Analyser la taille des layers
docker history area-frontend:latest --human --format "table {{.CreatedBy}}\t{{.Size}}"

# Squash des layers (si nécessaire)
docker build --squash -t area-frontend:optimized .
```

### 2. Cache management

```bash
# Build avec cache persistant
docker buildx build \
  --cache-from type=local,src=/tmp/.buildx-cache \
  --cache-to type=local,dest=/tmp/.buildx-cache \
  -t area-frontend:cached .

# Registry cache
docker buildx build \
  --cache-from type=registry,ref=myregistry/area-frontend:cache \
  --cache-to type=registry,ref=myregistry/area-frontend:cache,mode=max \
  -t area-frontend:latest .
```

### 3. Multi-architecture builds

```bash
# Setup buildx
docker buildx create --name multiarch --driver docker-container
docker buildx use multiarch

# Build multi-arch
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t area-frontend:multiarch \
  --push .
```

## 🌐 Déploiement Production

### 1. Docker Compose Production

Créer `docker-compose.prod.yml` :

```yaml
version: '3.8'

services:
  frontend:
    image: area-frontend:latest
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 64M
          cpus: '0.5'
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:80/"]
      interval: 30s
      timeout: 5s
      retries: 3
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  backend:
    image: area-backend:latest
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '1.0'
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5001/health"]
      interval: 30s
      timeout: 5s
      retries: 3
    volumes:
      - db_data:/app/prisma/database

volumes:
  db_data:
    driver: local
```

```bash
# Déploiement en production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Vérification
docker-compose -f docker-compose.prod.yml ps
```

### 2. Déploiement avec Traefik (Load Balancer)

```yaml
# traefik-compose.yml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
    ports:
      - "80:80"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock

  frontend:
    image: area-frontend:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`area.localhost`)"
      - "traefik.http.services.frontend.loadbalancer.server.port=80"
    deploy:
      replicas: 2

  backend:
    image: area-backend:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.backend.rule=Host(`api.area.localhost`)"
      - "traefik.http.services.backend.loadbalancer.server.port=5001"
    deploy:
      replicas: 2
```

### 3. Registry privé

```bash
# Setup registry local
docker run -d -p 5001:5001 --name registry registry:2

# Tag et push
docker tag area-frontend:latest localhost:5001/area-frontend:latest
docker push localhost:5001/area-frontend:latest

# Pull depuis le registry
docker pull localhost:5001/area-frontend:latest
```

## 🛠️ Dépannage

### 1. Problèmes de build

```bash
# Build en mode debug
docker build --no-cache --progress=plain -t area-frontend:debug .

# Vérifier les layers qui échouent
docker build --target builder -t area-frontend:builder .
docker run -it area-frontend:builder sh

# Logs détaillés
docker-compose build --progress plain
```

### 2. Problèmes de performance

```bash
# Profiler les containers
docker exec area_frontend top
docker exec area_frontend ps aux

# Vérifier les I/O
docker exec area_frontend iostat 1 5

# Analyser la mémoire
docker exec area_frontend free -h
docker exec area_frontend cat /proc/meminfo
```

### 3. Problèmes réseau

```bash
# Tester la connectivité
docker exec area_frontend ping area_backend
docker exec area_backend ping area_frontend

# Inspecter les réseaux
docker network ls
docker network inspect area-project_default

# Debug DNS
docker exec area_frontend nslookup area_backend
```

### 4. Problèmes de permissions

```bash
# Vérifier les permissions
docker exec area_frontend ls -la /usr/share/nginx/html
docker exec area_backend ls -la /app

# Vérifier les utilisateurs
docker exec area_frontend whoami
docker exec area_backend whoami

# Logs d'accès nginx
docker exec area_frontend tail -f /var/log/nginx/access.log
docker exec area_frontend tail -f /var/log/nginx/error.log
```

## 📋 Checklist de Sécurité Complète

### ✅ Images
- [ ] Scan des vulnérabilités avec Docker Scout
- [ ] Scan avec Trivy
- [ ] Audit Dockerfile avec Hadolint
- [ ] Analyse des layers avec Dive
- [ ] Utilisateurs non-root configurés
- [ ] Images basées sur Alpine Linux
- [ ] Versions fixes (pas de `latest`)

### ✅ Runtime
- [ ] Health checks configurés
- [ ] Limits de ressources définies
- [ ] Secrets gérés avec Docker Secrets
- [ ] Volumes avec permissions restrictives
- [ ] Réseau isolé configuré
- [ ] Logs centralisés

### ✅ Production
- [ ] TLS/SSL configuré
- [ ] Headers de sécurité (CSP, HSTS, etc.)
- [ ] Monitoring et alertes
- [ ] Backups automatisés
- [ ] Plan de rollback
- [ ] Tests de charge effectués

## 🎯 Scripts d'Automatisation

### Script de build complet

```bash
#!/bin/bash
# build-all.sh

set -e

echo "🚀 Build complet de l'application AREA"

# Variables
REGISTRY="localhost:5001"
VERSION=$(date +%Y%m%d-%H%M%S)

# Build Frontend
echo "📦 Build Frontend..."
cd front/
docker build -t area-frontend:$VERSION -t area-frontend:latest .

# Build Backend
echo "📦 Build Backend..."
cd ../back/
docker build -t area-backend:$VERSION -t area-backend:latest .

# Tests de sécurité
echo "🔒 Tests de sécurité..."
cd ..
trivy image area-frontend:latest
trivy image area-backend:latest

# Push vers registry (optionnel)
if [ "$1" = "push" ]; then
    echo "📤 Push vers registry..."
    docker tag area-frontend:latest $REGISTRY/area-frontend:$VERSION
    docker tag area-backend:latest $REGISTRY/area-backend:$VERSION
    docker push $REGISTRY/area-frontend:$VERSION
    docker push $REGISTRY/area-backend:$VERSION
fi

echo "✅ Build terminé avec succès!"
```

### Script de déploiement

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Déploiement de l'application AREA"

# Vérifications préalables
docker --version
docker-compose --version

# Arrêt des anciens containers
echo "🛑 Arrêt des anciens containers..."
docker-compose down

# Déploiement
echo "🚀 Déploiement des nouveaux containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Vérifications
echo "🔍 Vérifications post-déploiement..."
sleep 10

# Health checks
curl -f http://localhost:3000/ || exit 1
curl -f http://localhost:5001/health || exit 1

echo "✅ Déploiement réussi!"
```

---

## 📞 Support

**Version**: 1.0.0  
**Auteur**: AREA Team  
**Dernière mise à jour**: Septembre 2025

Pour toute question ou problème, consultez d'abord les logs et utilisez les commandes de diagnostic fournies dans ce guide.
