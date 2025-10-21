#!/bin/bash

# Script de migration vers le repo public
# Migre le projet vers git@github.com:yakohhhh/area_epitech.git

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

PUBLIC_REPO="git@github.com:yakohhhh/area_epitech.git"

print_header "MIGRATION VERS REPO PUBLIC"

# Vérifier qu'on est dans un repo Git
if [ ! -d ".git" ]; then
    print_error "Ce n'est pas un dépôt Git!"
    exit 1
fi

echo "Ce script va:"
echo "  1. Supprimer les workflows GitHub Actions (inutiles pour version gratuite)"
echo "  2. Nettoyer les fichiers CI/CD payants"
echo "  3. Installer les hooks Git locaux"
echo "  4. Configurer le nouveau remote"
echo "  5. Pousser vers $PUBLIC_REPO"
echo ""
print_warning "⚠️  Cette opération est irréversible!"
echo ""
read -p "Continuer ? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Migration annulée"
    exit 1
fi

# Sauvegarder le remote actuel
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "aucun")
print_status "Remote actuel: $CURRENT_REMOTE"

# Supprimer les workflows GitHub Actions
print_status "Nettoyage des workflows GitHub Actions..."
if [ -d ".github/workflows" ]; then
    rm -rf .github/workflows
    print_status "Workflows supprimés"
fi

# Supprimer les fichiers CI/CD inutiles
print_status "Nettoyage des fichiers CI/CD..."
rm -f .releaserc.json
rm -f AREA-Project/front/.lighthouserc.json
rm -f CI-CD-README.md
rm -f setup-cicd.sh

# Créer un README pour les hooks
cat > .githooks/README.md << 'EOF'
# Hooks Git - Remplacement CI/CD

Ce projet utilise des hooks Git locaux au lieu de GitHub Actions (gratuit).

## Installation

```bash
./AREA-Project/scripts/setup-hooks.sh
```

## Hooks disponibles

- **pre-commit**: Vérifie ESLint sur les fichiers modifiés
- **pre-push**: Vérifie que tous les services (back/front/mobile) compilent
- **commit-msg**: Valide le format des messages de commit

## Désactiver temporairement

```bash
git commit --no-verify
git push --no-verify
```

## Commandes utiles

```bash
# Tester manuellement
.githooks/pre-commit
.githooks/pre-push

# Vérifier un service
cd AREA-Project/back && npm install && npm run build
cd AREA-Project/front && npm install && npm run build
cd AREA-Project/mobile && npm install && npm run build
```
EOF

print_status "README des hooks créé"

# Installer les hooks
print_status "Installation des hooks Git..."
if [ -f "AREA-Project/scripts/setup-hooks.sh" ]; then
    chmod +x AREA-Project/scripts/setup-hooks.sh
    ./AREA-Project/scripts/setup-hooks.sh
elif [ -f "setup-hooks.sh" ]; then
    chmod +x setup-hooks.sh
    ./setup-hooks.sh
else
    print_error "setup-hooks.sh introuvable!"
    exit 1
fi

# Créer un commit avec les changements
print_status "Création du commit de migration..."
git add .
git commit -m "chore: migrate to public repo with local git hooks

- Remove GitHub Actions workflows (not needed for free tier)
- Remove CI/CD config files (.releaserc.json, lighthouserc, etc)
- Add local git hooks (pre-commit, pre-push, commit-msg)
- Add setup-hooks.sh for easy installation
- Add migrate-to-public.sh for future migrations

The project now uses local git hooks instead of CI/CD:
- pre-commit: runs ESLint on staged files
- pre-push: verifies all services build successfully
- commit-msg: validates commit message format

To install hooks: ./AREA-Project/scripts/setup-hooks.sh
To skip hooks: git commit/push --no-verify" || print_warning "Rien à commiter ou commit déjà existant"

# Configurer le nouveau remote
print_status "Configuration du remote public..."

# Vérifier si le remote existe déjà
if git remote | grep -q "^public$"; then
    print_warning "Remote 'public' existe déjà, mise à jour..."
    git remote set-url public "$PUBLIC_REPO"
else
    git remote add public "$PUBLIC_REPO"
fi

print_status "Remote 'public' configuré: $PUBLIC_REPO"

# Afficher les remotes
echo ""
print_status "Remotes configurés:"
git remote -v | grep -E "(origin|public)"

echo ""
print_warning "Prêt à pousser vers le repo public!"
echo ""
echo "Commandes disponibles:"
echo "  # Pousser la branche actuelle"
echo "  git push public $(git branch --show-current)"
echo ""
echo "  # Pousser toutes les branches"
echo "  git push public --all"
echo ""
echo "  # Pousser avec les tags"
echo "  git push public --all --tags"
echo ""

read -p "Voulez-vous pousser maintenant vers le repo public ? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Push vers le repo public..."
    
    CURRENT_BRANCH=$(git branch --show-current)
    
    # Pousser vers main sur le repo public
    if git push public "$CURRENT_BRANCH":main --force --no-verify; then
        print_status "✅ Migration réussie!"
        echo ""
        print_status "Votre projet est maintenant sur: $PUBLIC_REPO"
        echo ""
        print_status "Pour travailler avec le nouveau repo:"
        echo "  git remote rename origin old-origin"
        echo "  git remote rename public origin"
        echo ""
        print_status "Ou pour garder les deux:"
        echo "  git push origin  # Vers l'ancien repo"
        echo "  git push public  # Vers le nouveau repo"
    else
        print_error "Échec du push"
        print_warning "Vérifiez vos droits d'accès sur $PUBLIC_REPO"
        print_warning "Vous pouvez réessayer manuellement:"
        echo "  git push public $CURRENT_BRANCH --force"
        exit 1
    fi
else
    print_warning "Push annulé"
    print_status "Vous pouvez pousser plus tard avec:"
    echo "  git push public $(git branch --show-current)"
fi

echo ""
print_header "MIGRATION TERMINÉE"
print_status "Hooks Git locaux installés ✅"
print_status "Remote public configuré ✅"
print_status "Projet nettoyé (CI/CD supprimée) ✅"
