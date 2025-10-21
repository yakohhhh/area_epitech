#!/bin/bash

# 🚀 AREA Project - Script de lancement unifié
# Démarre le Backend, le Frontend et l'app Mobile en parallèle
# Usage: ./start-all-final.sh [--auto] [--verbose]

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
if [[ -z "${PROJECT_ROOT:-}" ]]; then
    # Resolve the directory where this script lives and assume AREA-Project is a child directory
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    # If the script is already inside AREA-Project, use its directory, otherwise append AREA-Project
    if [[ -d "$SCRIPT_DIR/AREA-Project" ]]; then
        PROJECT_ROOT="$SCRIPT_DIR/AREA-Project"
    elif [[ "$(basename "$SCRIPT_DIR")" == "AREA-Project" ]]; then
        PROJECT_ROOT="$SCRIPT_DIR"
    else
        # default to script dir (best effort)
        PROJECT_ROOT="$SCRIPT_DIR"
    fi
fi

BACKEND_DIR="$PROJECT_ROOT/back"
FRONTEND_DIR="$PROJECT_ROOT/front"
MOBILE_DIR="$PROJECT_ROOT/mobile"

# Variables globales
AUTO_MODE=false
VERBOSE=false
PID_FILE="/tmp/area-services.pid"

# Fonctions utilitaires
print_header() {
    echo -e "${CYAN}================================================${NC}"
    echo -e "${CYAN}🚀 AREA Project - Lancement unifié des services${NC}"
    echo -e "${CYAN}================================================${NC}"
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Fonction pour parser les arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --auto)
                AUTO_MODE=true
                shift
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                print_error "Option inconnue: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

show_help() {
    echo -e "${CYAN}AREA Project - Script de lancement unifié${NC}"
    echo
    echo "Usage: $0 [OPTIONS]"
    echo
    echo "Options:"
    echo "  --auto      Libère automatiquement les ports occupés"
    echo "  --verbose   Mode verbeux"
    echo "  -h, --help  Affiche cette aide"
    echo
    echo "Services démarrés:"
    echo "  • Backend NestJS sur le port 5001"
    echo "  • Frontend React sur le port 3000"
    echo "  • Mobile Ionic React sur le port 5175"
}

# Vérification des dépendances
check_dependencies() {
    print_status "🔍 Vérification des dépendances..."
    
    # Vérifier node et npm
    if ! command -v node &> /dev/null; then
        print_error "Node.js n'est pas installé"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm n'est pas installé"
        exit 1
    fi
    
    # Vérifier les répertoires
    for dir in "$BACKEND_DIR" "$FRONTEND_DIR" "$MOBILE_DIR"; do
        if [[ ! -d "$dir" ]]; then
            print_error "Répertoire non trouvé: $dir"
            exit 1
        fi
    done
    
    print_success "✓ Toutes les dépendances sont présentes"
}

# Vérification des ports
check_ports() {
    local ports=(5001 3000 5175)
    local occupied_ports=()
    
    print_status "🔍 Vérification des ports..."
    
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            occupied_ports+=($port)
        fi
    done
    
    if [[ ${#occupied_ports[@]} -gt 0 ]]; then
        print_warning "Ports occupés: ${occupied_ports[*]}"
        
        if [[ "$AUTO_MODE" == "true" ]]; then
            print_status "🧹 Libération automatique des ports..."
            # Essayer de tuer les processus npm en douceur d'abord
            pkill -f "npm run" 2>/dev/null || true
            sleep 2
            
            # Puis forcer la libération des ports
            for port in "${occupied_ports[@]}"; do
                fuser -k ${port}/tcp 2>/dev/null || true
            done
            sleep 2
            print_success "✓ Ports libérés automatiquement"
        else
            echo -e "${YELLOW}Voulez-vous libérer les ports occupés? (y/n)${NC}"
            read -r response
            if [[ "$response" =~ ^[Yy]$ ]]; then
                pkill -f "npm run" 2>/dev/null || true
                sleep 2
                for port in "${occupied_ports[@]}"; do
                    fuser -k ${port}/tcp 2>/dev/null || true
                done
                sleep 2
                print_success "✓ Ports libérés"
            else
                print_error "Ports occupés, impossible de continuer"
                exit 1
            fi
        fi
    else
        print_success "✓ Tous les ports sont disponibles"
    fi
}

# Installation des dépendances si nécessaire
install_dependencies() {
    local dirs=("$BACKEND_DIR" "$FRONTEND_DIR" "$MOBILE_DIR")
    local dir_names=("Backend" "Frontend" "Mobile")
    
    for i in "${!dirs[@]}"; do
        local dir="${dirs[$i]}"
        local name="${dir_names[$i]}"
        
        if [[ ! -d "$dir/node_modules" ]]; then
            print_status "📦 Installation des dépendances $name..."
            cd "$dir"
            npm install --silent
            print_success "✓ Dépendances $name installées"
        fi
    done
}

# Préparation de Prisma (Backend)
prepare_prisma() {
    print_status "🗄️ Préparation de Prisma..."
    cd "$BACKEND_DIR"
    
    # Génération du client Prisma
    if [[ -f "prisma/schema.prisma" ]]; then
        npx prisma generate --silent 2>/dev/null || {
            print_warning "Génération Prisma échouée, tentative de migration..."
            npx prisma migrate dev --name init --skip-seed --silent 2>/dev/null || true
        }
        print_success "✓ Prisma configuré"
    fi
}

# Démarrage d'un service
start_service() {
    local name="$1"
    local dir="$2"
    local command="$3"
    local port="$4"
    local log_file="/tmp/area-${name,,}.log"
    
    print_status "🚀 Démarrage du $name..."
    
    cd "$dir"
    
    # Démarrage en arrière-plan avec nohup
    nohup bash -c "$command" > "$log_file" 2>&1 &
    local pid=$!
    
    # Enregistrer le PID
    echo "$name:$pid:$port" >> "$PID_FILE"
    
    # Attendre un peu et vérifier que le processus tourne
    sleep 3
    if kill -0 $pid 2>/dev/null; then
        print_success "✓ $name démarré (PID: $pid, Port: $port)"
        if [[ "$VERBOSE" == "true" ]]; then
            echo "   Log: $log_file"
        fi
    else
        print_error "✗ Échec du démarrage de $name"
        [[ -f "$log_file" ]] && tail -5 "$log_file" | sed 's/^/     /'
        return 1
    fi
}

# Attendre que les services soient prêts
wait_for_services() {
    local services=(
        "Backend:5001:/about.json"
        "Frontend:3000/"
        "Mobile:5175/"
    )
    
    print_status "⏳ Attente du démarrage des services..."
    
    for service_info in "${services[@]}"; do
        IFS=':' read -r name port endpoint <<< "$service_info"
        local url="http://localhost:${port}${endpoint}"
        local max_attempts=30
        local attempt=1
        
        print_status "   Vérification de $name..."
        
        while [[ $attempt -le $max_attempts ]]; do
            if curl -s -f "$url" > /dev/null 2>&1; then
                print_success "   ✓ $name est prêt"
                break
            fi
            
            if [[ $attempt -eq $max_attempts ]]; then
                print_warning "   ⚠ $name ne répond pas après ${max_attempts}s"
                break
            fi
            
            sleep 1
            ((attempt++))
        done
    done
}

# Afficher le statut des services
show_status() {
    echo
    echo -e "${CYAN}=================== STATUS ===================${NC}"
    echo -e "${GREEN}🎯 Backend NestJS:${NC}    http://localhost:5001"
    echo -e "${GREEN}🌐 Frontend React:${NC}   http://localhost:3000"
    echo -e "${GREEN}📱 Mobile Ionic:${NC}     http://localhost:5175"
    echo -e "${CYAN}===============================================${NC}"
    echo
    echo -e "${YELLOW}📋 Commandes utiles:${NC}"
    echo "   • Arrêter tous les services: ./quick.sh stop"
    echo "   • Voir les logs: tail -f /tmp/area-*.log"
    echo "   • Statut des services: ./quick.sh status"
    echo
}

# Fonction de nettoyage
cleanup() {
    print_status "🧹 Nettoyage..."
    if [[ -f "$PID_FILE" ]]; then
        while IFS=':' read -r name pid port; do
            if kill -0 "$pid" 2>/dev/null; then
                kill "$pid" 2>/dev/null || true
                print_status "   Service $name arrêté"
            fi
        done < "$PID_FILE"
        rm -f "$PID_FILE"
    fi
}

# Gestion des signaux
trap cleanup EXIT INT TERM

# Script principal
main() {
    # Parser les arguments
    parse_arguments "$@"
    
    # Nettoyer le fichier PID précédent
    rm -f "$PID_FILE"
    
    # Afficher l'en-tête
    print_header
    
    # Vérifications préliminaires
    check_dependencies
    check_ports
    install_dependencies
    prepare_prisma
    
    echo
    print_status "🚀 Démarrage des services..."
    
    # Démarrage des services
    start_service "Backend" "$BACKEND_DIR" "npm run start:dev" "5001"
    start_service "Frontend" "$FRONTEND_DIR" "npm run dev" "3000"
    start_service "Mobile" "$MOBILE_DIR" "npm run dev" "5175"
    
    # Attendre que les services soient prêts
    wait_for_services
    
    # Afficher le statut
    show_status
    
    if [[ "$AUTO_MODE" == "true" ]]; then
        print_status "Mode automatique - Les services tournent en arrière-plan"
        exit 0
    else
        echo -e "${CYAN}Appuyez sur Ctrl+C pour arrêter tous les services${NC}"
        echo -e "${YELLOW}Affichage des logs du Backend en direct...${NC}"
        
        # Afficher les logs du backend en direct
        tail -f /tmp/area-backend.log
    fi
}

# Lancer le script principal
main "$@"