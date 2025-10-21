#!/bin/bash

# Script d'installation des hooks Git
# Configure automatiquement les hooks locaux pour remplacer la CI/CD

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[✓]${NC} $1"; }
print_error() { echo -e "${RED}[✗]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[!]${NC} $1"; }
print_header() {
    echo -e "${BLUE}"
    echo "════════════════════════════════════════"
    echo "  $1"
    echo "════════════════════════════════════════"
    echo -e "${NC}"
}

print_header "INSTALLATION DES HOOKS GIT"

# Vérifier qu'on est dans un repo Git
if [ ! -d ".git" ]; then
    print_error "Ce n'est pas un dépôt Git!"
    exit 1
fi

# Créer le dossier .githooks s'il n'existe pas
if [ ! -d ".githooks" ]; then
    print_error "Dossier .githooks introuvable!"
    exit 1
fi

print_status "Configuration des hooks Git..."

# Configurer Git pour utiliser le dossier .githooks
git config core.hooksPath .githooks

# Rendre les hooks exécutables
chmod +x .githooks/*

print_status "Hooks installés avec succès!"
echo ""

print_status "Hooks disponibles:"
echo "  • pre-commit  : Vérifie ESLint avant chaque commit"
echo "  • pre-push    : Vérifie les builds avant chaque push"
echo "  • commit-msg  : Valide le format des messages de commit"
echo ""

print_warning "Pour désactiver temporairement les hooks:"
echo "  git commit --no-verify"
echo "  git push --no-verify"
echo ""

print_status "Installation terminée! ✨"
