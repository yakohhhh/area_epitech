#!/bin/bash
# Script de raccourci pour le développement
# Usage: ./dev.sh [setup|start|stop|logs|shell|simple|clean]

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() { echo -e "${BLUE}[AREA]${NC} $1"; }
print_success() { echo -e "${GREEN}[AREA]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[AREA]${NC} $1"; }
print_error() { echo -e "${RED}[AREA]${NC} $1"; }

# Fonction pour détecter la commande docker compose
docker_compose_cmd() {
    if command -v docker-compose &> /dev/null; then
        echo "docker-compose"
    else
        echo "docker compose"
    fi
}

case "$1" in
    "setup")
        print_status "Lancement du setup automatique..."
        print_status "Ce script va :"
        print_status "  - Installer toutes les dépendances (npm install)"
        print_status "  - Configurer les hooks Git avec Husky"
        print_status "  - Initialiser la base de données Prisma"
        print_status "  - Construire les images Docker"
        # Obtenir le répertoire du script actuel
        SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
        SETUP_SCRIPT="$SCRIPT_DIR/scripts/setup-dev.sh"
        
        if [ -f "$SETUP_SCRIPT" ]; then
            chmod +x "$SETUP_SCRIPT"
            cd "$SCRIPT_DIR"
            ./scripts/setup-dev.sh
        else
            print_error "Script setup-dev.sh introuvable! ($SETUP_SCRIPT)"
            exit 1
        fi
        ;;
    "start")
        print_status "Démarrage des services de développement..."
        # Obtenir le répertoire du script actuel
        SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
        COMPOSE_CMD=$(docker_compose_cmd)
        COMPOSE_FILE="$SCRIPT_DIR/docker/docker-compose.dev.yml"
        
        if [ -f "$COMPOSE_FILE" ]; then
            cd "$SCRIPT_DIR"
            $COMPOSE_CMD -f docker/docker-compose.dev.yml down --remove-orphans
            $COMPOSE_CMD -f docker/docker-compose.dev.yml up -d
            print_success "Services de développement démarrés!"
            print_status "Utilisez './dev.sh logs' pour voir les logs"
        else
            print_error "Fichier docker/docker-compose.dev.yml introuvable! ($COMPOSE_FILE)"
            exit 1
        fi
        ;;
    "simple"|"quick")
        print_status "Démarrage simple avec le docker-compose principal..."
        SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
        COMPOSE_CMD=$(docker_compose_cmd)
        COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"
        
        if [ ! -f "$COMPOSE_FILE" ]; then
            print_error "Fichier docker-compose.yml introuvable! ($COMPOSE_FILE)"
            exit 1
        fi
        
        cd "$SCRIPT_DIR"
        $COMPOSE_CMD -f docker-compose.yml down --remove-orphans
        print_status "Démarrage du backend..."
        $COMPOSE_CMD -f docker-compose.yml up -d backend
        print_status "Attente que le backend soit prêt..."
        sleep 10
        print_status "Démarrage du frontend..."
        $COMPOSE_CMD -f docker-compose.yml up -d frontend
        print_status "Démarrage du mobile..."
        $COMPOSE_CMD -f docker-compose.yml up -d mobile
        print_success "Projet AREA démarré!"
        print_status "Frontend: http://localhost:3000"
        print_status "Mobile: http://localhost:8100"
        print_status "Backend API: http://localhost:5001"
        print_status "Utilisez './dev.sh logs simple' pour voir les logs"
        ;;
    "stop")
        print_status "Arrêt des services..."
        SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
        COMPOSE_CMD=$(docker_compose_cmd)
        cd "$SCRIPT_DIR"
        if [ -f "docker/docker-compose.dev.yml" ]; then
            $COMPOSE_CMD -f docker/docker-compose.dev.yml down --remove-orphans
        fi
        if [ -f "docker-compose.yml" ]; then
            $COMPOSE_CMD -f docker-compose.yml down --remove-orphans
        fi
        print_success "Services arrêtés!"
        ;;
    "logs")
        print_status "Affichage des logs..."
        SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
        COMPOSE_CMD=$(docker_compose_cmd)
        cd "$SCRIPT_DIR"
        if [ "$2" = "simple" ]; then
            if [ -f "docker-compose.yml" ]; then
                $COMPOSE_CMD -f docker-compose.yml logs -f
            else
                print_error "Fichier docker-compose.yml introuvable!"
                exit 1
            fi
        else
            if [ -f "docker/docker-compose.dev.yml" ]; then
                $COMPOSE_CMD -f docker/docker-compose.dev.yml logs -f
            else
                print_error "Fichier docker/docker-compose.dev.yml introuvable!"
                exit 1
            fi
        fi
        ;;
    "shell")
        print_status "Ouverture d'un shell dans le frontend..."
        COMPOSE_CMD=$(docker_compose_cmd)
        if [ -f "docker/docker-compose.dev.yml" ]; then
            $COMPOSE_CMD -f docker/docker-compose.dev.yml exec frontend sh
        else
            print_error "Fichier docker/docker-compose.dev.yml introuvable!"
            exit 1
        fi
        ;;
    "build")
        print_status "Build complet..."
        # Obtenir le répertoire du script actuel
        SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
        BUILD_SCRIPT="$SCRIPT_DIR/scripts/build-all.sh"
        
        if [ -f "$BUILD_SCRIPT" ]; then
            chmod +x "$BUILD_SCRIPT"
            cd "$SCRIPT_DIR"
            ./scripts/build-all.sh
        else
            print_error "Script build-all.sh introuvable! ($BUILD_SCRIPT)"
            exit 1
        fi
        ;;
    "rebuild")
        print_status "Reconstruction des images et démarrage..."
        SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
        COMPOSE_CMD=$(docker_compose_cmd)
        COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"
        
        if [ ! -f "$COMPOSE_FILE" ]; then
            print_error "Fichier docker-compose.yml introuvable! ($COMPOSE_FILE)"
            exit 1
        fi
        
        cd "$SCRIPT_DIR"
        $COMPOSE_CMD -f docker-compose.yml down --remove-orphans
        $COMPOSE_CMD -f docker-compose.yml build --no-cache
        $COMPOSE_CMD -f docker-compose.yml up -d
        print_success "Projet reconstruit et démarré!"
        print_status "Frontend: http://localhost:3000"
        print_status "Mobile: http://localhost:8100"
        print_status "Backend API: http://localhost:5001"
        ;;
    "clean")
        print_warning "Nettoyage complet du projet..."
        read -p "Êtes-vous sûr de vouloir tout nettoyer? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
            COMPOSE_CMD=$(docker_compose_cmd)
            cd "$SCRIPT_DIR"
            if [ -f "docker/docker-compose.dev.yml" ]; then
                $COMPOSE_CMD -f docker/docker-compose.dev.yml down -v --remove-orphans
            fi
            if [ -f "docker-compose.yml" ]; then
                $COMPOSE_CMD -f docker-compose.yml down -v --remove-orphans
            fi
            docker images | grep -E "(area|AREA)" | awk '{print $3}' | xargs -r docker rmi -f 2>/dev/null || true
            docker system prune -f
            print_success "Nettoyage terminé!"
        else
            print_status "Nettoyage annulé"
        fi
        ;;
    "deploy")
        print_status "Déploiement..."
        if [ -f "./scripts/deploy.sh" ]; then
            chmod +x ./scripts/deploy.sh
            ./scripts/deploy.sh ${2:-dev}
        else
            print_error "Script deploy.sh introuvable!"
            exit 1
        fi
        ;;
    "security")
        print_status "Audit de sécurité..."
        if [ -f "./tools/security-audit.sh" ]; then
            chmod +x ./tools/security-audit.sh
            ./tools/security-audit.sh
        else
            print_error "Script security-audit.sh introuvable!"
            exit 1
        fi
        ;;
    "husky")
        print_status "Réinstallation et configuration de Husky..."
        if [ -d "front" ] && command -v npm &> /dev/null; then
            print_status "Installation des dépendances frontend..."
            cd front && npm install --silent && cd ..
            print_status "Configuration des hooks Git..."
            cd ..
            if [ -f ".githooks/pre-commit" ] && [ -f ".githooks/commit-msg" ]; then
                print_success "Hooks Git Husky configurés!"
            else
                mkdir -p .githooks
                echo "cd AREA-Project/front && npm run pre-commit" > .githooks/pre-commit
                chmod +x .githooks/pre-commit
                echo "cd AREA-Project/front && npx --no -- commitlint --edit \$1" > .githooks/commit-msg
                chmod +x .githooks/commit-msg
                print_success "Hooks Git Husky créés!"
            fi
            print_status "Hooks disponibles :"
            print_status "  - pre-commit: Lint et formatage automatique"
            print_status "  - commit-msg: Validation du format des messages de commit"
            cd AREA-Project
        else
            print_error "Dossier front non trouvé ou npm non disponible"
            exit 1
        fi
        ;;
    "status")
        print_status "État des services AREA..."
        SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
        COMPOSE_CMD=$(docker_compose_cmd)
        cd "$SCRIPT_DIR"
        echo ""
        print_status "=== Services principaux ==="
        if [ -f "docker-compose.yml" ]; then
            $COMPOSE_CMD -f docker-compose.yml ps
        fi
        echo ""
        print_status "=== Services de développement ==="
        if [ -f "docker/docker-compose.dev.yml" ]; then
            $COMPOSE_CMD -f docker/docker-compose.dev.yml ps
        fi
        echo ""
        print_status "=== URLs d'accès ==="
        if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "area_frontend.*Up"; then
            print_success "Frontend: http://localhost:3000"
        else
            print_warning "Frontend: Non démarré"
        fi
        if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "area_mobile.*Up"; then
            print_success "Mobile: http://localhost:8100"
        else
            print_warning "Mobile: Non démarré"
        fi
        if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "area_backend.*Up"; then
            print_success "Backend: http://localhost:5001"
        else
            print_warning "Backend: Non démarré"
        fi
        ;;
    "husky")
        print_status "Réinstallation et configuration de Husky..."
        if [ -d "front" ] && command -v npm &> /dev/null; then
            cd front
            print_status "Installation des dépendances frontend..."
            npm install --silent
            cd ..
            
            print_status "Configuration des hooks Git..."
            cd ..
            
            # Créer le dossier .githooks s'il n'existe pas
            mkdir -p .githooks
            
            # Recréer les hooks
            echo "cd AREA-Project/front && npm run pre-commit" > .githooks/pre-commit
            chmod +x .githooks/pre-commit
            
            echo "cd AREA-Project/front && npx --no -- commitlint --edit \$1" > .githooks/commit-msg
            chmod +x .githooks/commit-msg
            
            print_success "Hooks Git Husky configurés!"
            print_status "Hooks disponibles :"
            print_status "  - pre-commit: Lint et formatage automatique"
            print_status "  - commit-msg: Validation du format des messages de commit"
            cd AREA-Project
        else
            print_error "Dossier front non trouvé ou npm non disponible"
            exit 1
        fi
        ;;
    *)
        echo "🛠️  AREA Project - Commandes de développement"
        echo "============================================="
        echo ""
        echo "Usage: ./dev.sh <command>"
        echo ""
        echo "Commandes principales:"
        echo "  setup    - Configuration initiale automatique (inclut Husky)"
        echo "  start    - Démarre les services (mode développement complet)"
        echo "  simple   - Démarrage simple avec docker-compose principal"
        echo "  stop     - Arrête tous les services"
        echo "  status   - Affiche l'état des services"
        echo "  logs     - Affiche les logs en temps réel"
        echo ""
        echo "Commandes avancées:"
        echo "  shell    - Ouvre un shell dans le container frontend"
        echo "  build    - Lance le build complet"
        echo "  rebuild  - Reconstruit les images et redémarre"
        echo "  clean    - Nettoie tout (containers, volumes, images)"
        echo "  deploy   - Déploie l'application [prod|dev]"
        echo "  security - Lance l'audit de sécurité"
        echo "  husky    - Réinstalle et configure les hooks Git Husky"
        echo ""
        echo "Exemples:"
        echo "  ./dev.sh setup          # Configuration initiale (inclut Husky)"
        echo "  ./dev.sh simple         # Démarrage rapide"
        echo "  ./dev.sh start          # Démarrage complet avec dev tools"
        echo "  ./dev.sh logs simple    # Voir les logs du mode simple"
        echo "  ./dev.sh deploy prod    # Déploie en production"
        echo "  ./dev.sh husky          # Reconfigure les hooks Git"
        ;;
esac