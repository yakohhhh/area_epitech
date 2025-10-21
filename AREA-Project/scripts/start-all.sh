#!/bin/bash

# 🚀 AREA - Script Principal de Développement
# Lance automatiquement Backend, Frontend Web et Mobile
# Usage: ./start-all.sh [mode]
# Mo        # Mode automatique si variable d'environnement AUTO_KILL_PORTS est définie ou argument --auto
        if [[ "$AUTO_MODE" == "true" ]] || [[ "$AUTO_KILL_PORTS" == "true" ]]; then
            print_status "🧹 Libération automatique des ports..."
            # Essayer sans sudo d'abord
            pkill -f "npm run" 2>/dev/null || true
            fuser -k 5001/tcp 3000/tcp 5175/tcp 2>/dev/null || sudo fuser -k 5001/tcp 3000/tcp 5175/tcp 2>/dev/null || true
            sleep 2
            print_success "✓ Ports libérés automatiquement" (défaut), docker, clean

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emojis pour les services
BACKEND_EMOJI="⚡"
FRONTEND_EMOJI="🌐"
MOBILE_EMOJI="📱"
SUCCESS_EMOJI="✅"
ERROR_EMOJI="❌"
INFO_EMOJI="ℹ️"

print_header() {
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                    🚀 AREA DEV LAUNCHER                      ║${NC}"
    echo -e "${CYAN}║              Backend + Frontend + Mobile                     ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }
print_service() { echo -e "${PURPLE}[SERVICE]${NC} $1"; }

# Variables globales
BACKEND_PID=""
FRONTEND_PID=""
MOBILE_PID=""
MODE="dev"
AUTO_MODE=false

# Parse des arguments
for arg in "$@"; do
    case $arg in
        --auto)
            AUTO_MODE=true
            ;;
        clean|docker)
            MODE=$arg
            ;;
        *)
            if [[ -z "$MODE" || "$MODE" == "dev" ]]; then
                MODE=$arg
            fi
            ;;
    esac
done

# Fonction de nettoyage des processus
cleanup() {
    echo ""
    print_warning "🛑 Arrêt des services en cours..."
    
    if [ ! -z "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
        print_status "${BACKEND_EMOJI} Arrêt du backend (PID: $BACKEND_PID)"
        kill -TERM "$BACKEND_PID" 2>/dev/null || true
    fi
    
    if [ ! -z "$FRONTEND_PID" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
        print_status "${FRONTEND_EMOJI} Arrêt du frontend (PID: $FRONTEND_PID)"
        kill -TERM "$FRONTEND_PID" 2>/dev/null || true
    fi
    
    if [ ! -z "$MOBILE_PID" ] && kill -0 "$MOBILE_PID" 2>/dev/null; then
        print_status "${MOBILE_EMOJI} Arrêt du mobile (PID: $MOBILE_PID)"
        kill -TERM "$MOBILE_PID" 2>/dev/null || true
    fi
    
    # Arrêter les processus npm qui pourraient encore tourner
    pkill -f "npm run" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    pkill -f "nest start" 2>/dev/null || true
    
    sleep 2
    print_success "${SUCCESS_EMOJI} Tous les services ont été arrêtés"
    exit 0
}

# Intercepter Ctrl+C
trap cleanup SIGINT SIGTERM

# Fonction de vérification des dépendances
check_dependencies() {
    print_status "🔍 Vérification des dépendances..."
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js n'est pas installé"
        exit 1
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        print_error "npm n'est pas installé"
        exit 1
    fi
    
    # Vérifier la structure du projet
    if [ ! -d "AREA-Project" ]; then
        print_error "Structure du projet AREA-Project non trouvée"
        exit 1
    fi
    
    print_success "✓ Dépendances validées"
}

# Fonction de vérification des ports
check_ports() {
    print_status "🔍 Vérification de la disponibilité des ports..."
    
    local ports_busy=()
    
    # Vérifier port 5001 (Backend)
    if nc -z localhost 5001 2>/dev/null; then
        ports_busy+=("5001 (Backend)")
    fi
    
    # Vérifier port 3000 (Frontend)
    if nc -z localhost 3000 2>/dev/null; then
        ports_busy+=("3000 (Frontend)")
    fi
    
    # Vérifier port 5175 (Mobile)
    if nc -z localhost 5175 2>/dev/null; then
        ports_busy+=("5175 (Mobile)")
    fi
    
    if [ ${#ports_busy[@]} -gt 0 ]; then
        print_warning "⚠️ Ports occupés détectés:"
        for port in "${ports_busy[@]}"; do
            echo "   - $port"
        done
        echo ""
        
        # Mode automatique si variable d'environnement AUTO_KILL_PORTS est définie ou argument --auto
        if [[ "$AUTO_MODE" == "true" ]] || [[ "$AUTO_KILL_PORTS" == "true" ]]; then
            print_status "🧹 Libération automatique des ports..."
            sudo fuser -k 5001/tcp 2>/dev/null || true
            sudo fuser -k 3000/tcp 2>/dev/null || true  
            sudo fuser -k 5175/tcp 2>/dev/null || true
            sleep 2
            print_success "✓ Ports libérés automatiquement"
        else
            read -p "Voulez-vous libérer ces ports automatiquement ? (y/N): " -n 1 -r
            echo ""
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                print_status "🧹 Libération des ports..."
                sudo fuser -k 5001/tcp 2>/dev/null || true
                sudo fuser -k 3000/tcp 2>/dev/null || true  
                sudo fuser -k 5175/tcp 2>/dev/null || true
                sleep 2
                print_success "✓ Ports libérés"
            else
                print_error "Impossible de continuer avec des ports occupés"
                exit 1
            fi
        fi
    else
        print_success "✓ Tous les ports sont disponibles"
    fi
}

# Fonction de vérification et correction Prisma
check_prisma_setup() {
    print_status "🔍 Vérification de la configuration Prisma..."
    
    if [ -f "AREA-Project/back/prisma/schema.prisma" ]; then
        # Vérifier si les binaryTargets sont configurés
        if ! grep -q "binaryTargets" "AREA-Project/back/prisma/schema.prisma"; then
            print_warning "⚠️ Binary targets Prisma manquants (correction automatique)"
            
            # Backup du schema
            cp "AREA-Project/back/prisma/schema.prisma" "AREA-Project/back/prisma/schema.prisma.backup"
            
            # Corriger le schema.prisma
            sed -i 's/provider = "prisma-client-js"/provider      = "prisma-client-js"\n  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]/' "AREA-Project/back/prisma/schema.prisma"
            
            # Régénérer le client
            print_status "🔄 Régénération du client Prisma..."
            cd AREA-Project/back && npx prisma generate --silent > /dev/null 2>&1 && cd ../..
            
            print_success "✓ Configuration Prisma corrigée"
        else
            print_success "✓ Configuration Prisma valide"
        fi
    else
        print_warning "⚠️ Schema Prisma non trouvé"
    fi
}

# Fonction d'installation des dépendances
install_dependencies() {
    print_status "📦 Vérification des dépendances npm..."
    
    local needs_install=false
    
    # Vérifier backend
    if [ ! -d "AREA-Project/back/node_modules" ] || [ -z "$(ls -A AREA-Project/back/node_modules 2>/dev/null)" ]; then
        needs_install=true
        print_warning "Dependencies backend manquantes"
    fi
    
    # Vérifier frontend
    if [ ! -d "AREA-Project/front/node_modules" ] || [ -z "$(ls -A AREA-Project/front/node_modules 2>/dev/null)" ]; then
        needs_install=true
        print_warning "Dependencies frontend manquantes"
    fi
    
    # Vérifier mobile
    if [ ! -d "AREA-Project/mobile/node_modules" ] || [ -z "$(ls -A AREA-Project/mobile/node_modules 2>/dev/null)" ]; then
        needs_install=true
        print_warning "Dependencies mobile manquantes"
    fi
    
    if [ "$needs_install" = true ]; then
        print_status "🔧 Installation des dépendances manquantes..."
        
        # Installation backend
        if [ ! -d "AREA-Project/back/node_modules" ] || [ -z "$(ls -A AREA-Project/back/node_modules 2>/dev/null)" ]; then
            print_service "${BACKEND_EMOJI} Installation backend..."
            cd AREA-Project/back && npm install --silent > /dev/null 2>&1 && cd ../..
            print_success "✓ Backend installé"
        fi
        
        # Installation frontend  
        if [ ! -d "AREA-Project/front/node_modules" ] || [ -z "$(ls -A AREA-Project/front/node_modules 2>/dev/null)" ]; then
            print_service "${FRONTEND_EMOJI} Installation frontend..."
            cd AREA-Project/front && npm install && cd ../..
            print_success "✓ Frontend installé"
        fi
        
        # Installation mobile
        if [ ! -d "AREA-Project/mobile/node_modules" ] || [ -z "$(ls -A AREA-Project/mobile/node_modules 2>/dev/null)" ]; then
            print_service "${MOBILE_EMOJI} Installation mobile..."
            cd AREA-Project/mobile && npm install && cd ../..
            print_success "✓ Mobile installé"
        fi
    else
        print_success "✓ Toutes les dépendances sont présentes"
    fi
    
    # Vérifier la configuration Prisma après l'installation
    check_prisma_setup
}

# Fonction de démarrage d'un service
start_service() {
    local service_name="$1"
    local service_dir="$2"
    local service_command="$3"
    local service_emoji="$4"
    local expected_port="$5"
    
    print_service "${service_emoji} Démarrage de $service_name..."
    
    # S'assurer qu'on est dans le bon répertoire
    local current_dir=$(pwd)
    local service_path="$current_dir/AREA-Project/$service_dir"
    
    if [ ! -d "$service_path" ]; then
        print_error "❌ Répertoire service non trouvé: $service_path"
        return 1
    fi
    
    # Créer un fichier de log temporaire
    local log_file="/tmp/area_${service_name,,}_$(date +%s).log"
    
    # Démarrer le processus avec nohup pour plus de stabilité
    cd "$service_path"
    nohup bash -c "$service_command" > "$log_file" 2>&1 &
    local pid=$!
    
    # Retourner au répertoire racine
    cd "$current_dir"
    
    # Attendre que le service démarre (timeout plus long pour les services lents)
    local max_attempts=60  # Augmenté de 30 à 60 secondes
    local attempt=0
    
    print_status "⏳ Attente du démarrage de $service_name..."
    
    while [ $attempt -lt $max_attempts ]; do
        if nc -z localhost "$expected_port" 2>/dev/null; then
            print_success "✓ $service_name prêt sur le port $expected_port"
            echo "$pid"
            return 0
        fi
        
        # Vérifier si le processus est encore en vie
        if ! kill -0 "$pid" 2>/dev/null; then
            print_error "❌ $service_name a échoué au démarrage"
            print_error "Voir le log: $log_file"
            if [ -f "$log_file" ]; then
                print_error "Dernières lignes du log:"
                tail -5 "$log_file" | while read line; do print_error "  $line"; done
            fi
            return 1
        fi
        
        sleep 2  # Attendre 2 secondes au lieu de 1
        attempt=$((attempt + 2))
        
        # Afficher un point de progression
        if [ $((attempt % 10)) -eq 0 ]; then
            print_status "⏳ $service_name en cours de démarrage... (${attempt}s/${max_attempts}s)"
        fi
    done
    
    print_error "❌ Timeout: $service_name n'a pas démarré après ${max_attempts}s"
    if [ -f "$log_file" ]; then
        print_error "Voir le log: $log_file"
        print_error "Dernières lignes:"
        tail -10 "$log_file" | while read line; do print_error "  $line"; done
    fi
    return 1
}

# Fonction principale de démarrage
start_all_services() {
    print_status "🚀 Démarrage de tous les services..."
    echo ""
    
    # Démarrer le backend
    BACKEND_PID=$(start_service "Backend" "back" "npm run start:dev" "$BACKEND_EMOJI" "5001")
    if [ $? -ne 0 ]; then
        print_error "Impossible de démarrer le backend"
        cleanup
        exit 1
    fi
    
    # Démarrer le frontend
    FRONTEND_PID=$(start_service "Frontend" "front" "npm run dev" "$FRONTEND_EMOJI" "3000")
    if [ $? -ne 0 ]; then
        print_error "Impossible de démarrer le frontend"
        cleanup
        exit 1
    fi
    
    # Démarrer le mobile
    MOBILE_PID=$(start_service "Mobile" "mobile" "npm run dev" "$MOBILE_EMOJI" "5175")
    if [ $? -ne 0 ]; then
        print_error "Impossible de démarrer le mobile"
        cleanup
        exit 1
    fi
    
    echo ""
    print_success "${SUCCESS_EMOJI} Tous les services sont démarrés avec succès !"
}

# Fonction d'affichage du statut final
show_final_status() {
    echo ""
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                     🎉 SERVICES ACTIFS                      ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BACKEND_EMOJI} ${GREEN}Backend NestJS${NC}    : http://localhost:5001"
    echo -e "${FRONTEND_EMOJI} ${GREEN}Frontend React${NC}    : http://localhost:3000"
    echo -e "${MOBILE_EMOJI} ${GREEN}Mobile Ionic${NC}      : http://localhost:5175"
    echo ""
    echo -e "${INFO_EMOJI} ${BLUE}API Health${NC}        : http://localhost:5001/mobile/health"
    echo -e "${INFO_EMOJI} ${BLUE}API CORS Test${NC}     : http://localhost:5001/mobile/cors-test"
    echo ""
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                      📋 INSTRUCTIONS                        ║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "🧪 Tests suggérés :"
    echo "   1. Frontend Web    → http://localhost:3000"
    echo "   2. Mobile App      → http://localhost:5175"
    echo "   3. API Health      → http://localhost:5001/mobile/health"
    echo "   4. Test Auth       → Inscription/Connexion sur mobile"
    echo "   5. Google OAuth    → Test SSO sur les deux apps"
    echo ""
    echo -e "${YELLOW}⚠️  Pour arrêter tous les services : Ctrl+C${NC}"
    echo ""
}

# Fonction de surveillance des services
monitor_services() {
    print_status "🔍 Surveillance des services en cours..."
    print_status "Appuyez sur Ctrl+C pour arrêter tous les services"
    
    while true; do
        sleep 10
        
        # Vérifier si tous les services sont encore actifs via les ports
        local services_down=()
        
        if ! nc -z localhost 5001 2>/dev/null; then
            services_down+=("Backend")
        fi
        
        if ! nc -z localhost 3000 2>/dev/null; then
            services_down+=("Frontend")
        fi
        
        if ! nc -z localhost 5175 2>/dev/null; then
            services_down+=("Mobile")
        fi
        
        if [ ${#services_down[@]} -gt 0 ]; then
            print_error "❌ Services arrêtés inopinément : ${services_down[*]}"
            cleanup
            exit 1
        fi
        
        # Affichage périodique du statut
        if [ $(($(date +%s) % 60)) -eq 0 ]; then
            print_status "✓ Tous les services fonctionnent correctement"
        fi
    done
}

# PROGRAMME PRINCIPAL
main() {
    print_header
    
    # Vérifications préliminaires
    check_dependencies
    check_ports
    install_dependencies
    
    echo ""
    print_status "🎯 Mode: $MODE"
    
    case "$MODE" in
        "dev"|"")
            start_all_services
            if [ $? -eq 0 ]; then
                show_final_status
                echo ""
                print_status "🔍 Services démarrés ! Appuyez sur Ctrl+C pour arrêter."
                # Boucle simple d'attente
                while true; do
                    sleep 30
                    # Vérification périodique simple
                    if ! nc -z localhost 5001 2>/dev/null; then
                        print_error "❌ Backend arrêté"
                        cleanup
                        exit 1
                    fi
                done
            else
                print_error "❌ Erreur lors du démarrage des services"
                cleanup
                exit 1
            fi
            ;;
        "clean")
            print_status "🧹 Nettoyage des caches et node_modules..."
            rm -rf AREA-Project/*/node_modules 2>/dev/null || true
            rm -rf AREA-Project/*/dist 2>/dev/null || true
            rm -rf AREA-Project/*/.vite 2>/dev/null || true
            print_success "✓ Nettoyage terminé"
            ;;
        "docker")
            print_status "🐳 Mode Docker non implémenté dans cette version"
            print_warning "Utilisez: ./dev.sh start"
            ;;
        *)
            print_error "Mode '$MODE' non reconnu"
            echo "Modes disponibles: dev, clean, docker"
            exit 1
            ;;
    esac
}

# Lancement du programme principal
main "$@"