#!/bin/bash
# Script d'audit de sécurité pour le projet AREA

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() { echo -e "${BLUE}[SECURITY]${NC} $1"; }
print_success() { echo -e "${GREEN}[SECURITY]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[SECURITY]${NC} $1"; }
print_error() { echo -e "${RED}[SECURITY]${NC} $1"; }

print_status "🔒 Lancement de l'audit de sécurité AREA"
echo "========================================"

# Vérification des dépendances
print_status "Vérification des vulnérabilités des dépendances..."

# Backend
if [ -f "back/package.json" ]; then
    print_status "Audit du backend..."
    cd back
    if command -v npm &> /dev/null; then
        npm audit --audit-level=moderate || print_warning "Vulnérabilités détectées dans le backend"
    fi
    cd ..
fi

# Frontend
if [ -f "front/package.json" ]; then
    print_status "Audit du frontend..."
    cd front
    if command -v npm &> /dev/null; then
        npm audit --audit-level=moderate || print_warning "Vulnérabilités détectées dans le frontend"
    fi
    cd ..
fi

# Vérification des fichiers sensibles
print_status "Vérification des fichiers sensibles..."

# Recherche de clés/mots de passe hardcodés
print_status "Recherche de secrets potentiels..."
if command -v grep &> /dev/null; then
    grep -r -i -E "(password|secret|key|token)" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" . | grep -v node_modules | grep -v ".git" | head -10 || print_success "Aucun secret trouvé dans le code"
fi

# Vérification des permissions
print_status "Vérification des permissions de fichiers..."
find . -name "*.sh" -not -path "./node_modules/*" -not -path "./.git/*" | while read -r file; do
    if [ ! -x "$file" ]; then
        print_warning "Fichier script non exécutable : $file"
    fi
done

# Vérification Docker
print_status "Vérification de la configuration Docker..."
if [ -f "docker-compose.yml" ]; then
    # Recherche de mots de passe hardcodés dans docker-compose
    if grep -i "password.*=" docker-compose.yml | grep -v "your-secret-key-for-dev" > /dev/null; then
        print_warning "Mots de passe potentiellement hardcodés dans docker-compose.yml"
    fi
fi

print_success "Audit de sécurité terminé!"
print_status "Recommandations :"
print_status "- Utilisez des variables d'environnement pour les secrets"
print_status "- Mettez à jour régulièrement les dépendances"
print_status "- Vérifiez les permissions des fichiers"
print_status "- Utilisez HTTPS en production"
