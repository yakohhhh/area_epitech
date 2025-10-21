#!/bin/bash
# Helper script for mobile app lifecycle (similar spirit to root dev.sh)
# Usage: ./dev.sh [setup|start|build|sync|android|ios|clean|docker:dev|docker:prod|logs]

set -e

BLUE='\033[0;34m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log(){ echo -e "${BLUE}[MOBILE]${NC} $1"; }
ok(){ echo -e "${GREEN}[MOBILE]${NC} $1"; }
warn(){ echo -e "${YELLOW}[MOBILE]${NC} $1"; }
err(){ echo -e "${RED}[MOBILE]${NC} $1"; }

DOCKER_COMPOSE(){ if command -v docker-compose &>/dev/null; then echo docker-compose; else echo "docker compose"; fi }

ensure_env(){
  if [ ! -f .env ]; then
    cp .env.example .env
    warn ".env créé depuis .env.example (modifiez VITE_API_URL si nécessaire)."
  fi
}

case "$1" in
  setup)
    log "Installation des dépendances + préparation Capacitor"
    ensure_env
    npm install
    ok "Dépendances installées"
    log "Build initial (web)"
    npm run build
    log "(Optionnel) Ajouter plateformes: npx cap add android | ios"
    ;;
  start|dev)
    ensure_env
    log "Lancement serveur Vite (Ionic)"
    npm run dev
    ;;
  build)
    ensure_env
    log "Build production web (dist/)"
    npm run build
    ok "Build terminé"
    ;;
  sync)
    ensure_env
    log "Capacitor sync (copie dist vers android/ios)"
    npm run build
    npx cap sync
    ok "Sync terminée"
    ;;
  android)
    ensure_env
    npm run build
    npx cap sync android
    npx cap open android
    ;;
  ios)
    ensure_env
    npm run build
    npx cap sync ios
    npx cap open ios
    ;;
  docker:dev)
    ensure_env
    log "Build image dev locale"
    docker build -t area-mobile-dev -f Dockerfile.dev .
    log "Run conteneur (port 5174)"
    docker run --rm -it -p 5174:5174 --name area_mobile_dev -v "$PWD":/app -v /app/node_modules area-mobile-dev
    ;;
  docker:prod)
    ensure_env
    log "Build image production (prévisualisation web dist)"
    docker build -t area-mobile:latest .
    docker run --rm -d -p 8080:8080 --name area_mobile_prod area-mobile:latest
    ok "Disponible sur http://localhost:8080"
    ;;
  logs)
    if docker ps | grep -q area_mobile_dev; then
      docker logs -f area_mobile_dev
    else
      warn "Aucun conteneur dev actif (lancez docker:dev)."
    fi
    ;;
  clean)
    warn "Nettoyage node_modules + dist"
    rm -rf node_modules dist
    ok "Nettoyage terminé"
    ;;
  *)
    echo "📱 AREA Mobile - Commandes"
    echo "  setup        Installe dépendances + build initial"
    echo "  start|dev    Lance le serveur de dev (port 5174)"
    echo "  build        Build production (dist/)"
    echo "  sync         Build + npx cap sync"
    echo "  android      Ouvre projet Android (après sync)"
    echo "  ios          Ouvre projet iOS (macOS)"
    echo "  docker:dev   Image + conteneur dev live-reload"
    echo "  docker:prod  Image nginx servant dist/ (preview)"
    echo "  logs         Logs du conteneur dev"
    echo "  clean        Supprime node_modules & dist"
    ;;
esac
