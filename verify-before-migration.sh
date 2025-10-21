#!/bin/bash

# Script de vérification finale avant migration
# Vérifie que tout est prêt pour la migration vers le repo public

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

print_header "VÉRIFICATION AVANT MIGRATION"

CHECKS_PASSED=0
CHECKS_TOTAL=0

# Vérification 1: Hooks installés
CHECKS_TOTAL=$((CHECKS_TOTAL + 1))
echo ""
echo "📋 Vérification 1/5: Hooks Git installés"
if [ "$(git config core.hooksPath)" = ".githooks" ]; then
    print_status "Hooks Git configurés correctement"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    print_error "Hooks non installés"
    echo "   → Lance: ./setup-hooks.sh"
fi

# Vérification 2: Fichiers hooks présents
CHECKS_TOTAL=$((CHECKS_TOTAL + 1))
echo ""
echo "📋 Vérification 2/5: Fichiers hooks présents"
if [ -f ".githooks/pre-commit" ] && [ -f ".githooks/pre-push" ] && [ -f ".githooks/commit-msg" ]; then
    print_status "Tous les hooks sont présents"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    print_error "Hooks manquants"
fi

# Vérification 3: Scripts exécutables
CHECKS_TOTAL=$((CHECKS_TOTAL + 1))
echo ""
echo "📋 Vérification 3/5: Scripts exécutables"
if [ -x "setup-hooks.sh" ] && [ -x "migrate-to-public.sh" ] && [ -x "check-all.sh" ]; then
    print_status "Tous les scripts sont exécutables"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    print_error "Certains scripts ne sont pas exécutables"
    echo "   → Lance: chmod +x *.sh"
fi

# Vérification 4: Package.json présents
CHECKS_TOTAL=$((CHECKS_TOTAL + 1))
echo ""
echo "📋 Vérification 4/5: package.json présents"
if [ -f "AREA-Project/back/package.json" ] && [ -f "AREA-Project/front/package.json" ] && [ -f "AREA-Project/mobile/package.json" ]; then
    print_status "Tous les package.json sont présents"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    print_error "Certains package.json manquent"
fi

# Vérification 5: Git repo
CHECKS_TOTAL=$((CHECKS_TOTAL + 1))
echo ""
echo "📋 Vérification 5/5: Dépôt Git"
if [ -d ".git" ]; then
    print_status "Dépôt Git initialisé"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
    
    CURRENT_BRANCH=$(git branch --show-current)
    echo "   Branche actuelle: $CURRENT_BRANCH"
    
    if git remote | grep -q "origin"; then
        echo "   Remote origin: $(git remote get-url origin)"
    fi
else
    print_error "Pas un dépôt Git"
fi

echo ""
print_header "RÉSULTAT"

if [ $CHECKS_PASSED -eq $CHECKS_TOTAL ]; then
    print_status "✅ Toutes les vérifications sont OK! ($CHECKS_PASSED/$CHECKS_TOTAL)"
    echo ""
    echo "🎯 PRÊT POUR LA MIGRATION !"
    echo ""
    echo "Prochaines étapes:"
    echo "  1. Résoudre les conflits Git restants (si besoin)"
    echo "  2. Commiter les changements"
    echo "  3. Lancer la migration: ./migrate-to-public.sh"
    echo ""
    print_status "Le système de hooks Git local est opérationnel!"
else
    print_warning "⚠️  Certaines vérifications ont échoué ($CHECKS_PASSED/$CHECKS_TOTAL)"
    echo ""
    echo "Actions recommandées:"
    if [ "$(git config core.hooksPath)" != ".githooks" ]; then
        echo "  → ./setup-hooks.sh"
    fi
    if [ ! -x "setup-hooks.sh" ]; then
        echo "  → chmod +x *.sh"
    fi
    echo ""
    print_warning "Corrige les problèmes avant de migrer"
fi

echo ""
print_header "DOCUMENTATION"
echo "📖 Guide rapide     : ./QUICKSTART.sh"
echo "📖 Doc complète     : cat HOOKS-README.md"
echo "📖 Vue d'ensemble   : cat CI-CD-HOOKS.md"
echo ""
