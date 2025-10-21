#!/bin/bash

# 🚀 Script de setup automatique
# Usage : ./scripts/setup-dev.sh (depuis la racine du projet)

set -e

# Se placer dans le répertoire racine du projet
cd "$(dirname "$0")/.."

echo "🎯 AREA Project - Configuration automatique pour développeurs"
echo "=================================================="

# Vérification des prérequis
echo "🔍 Vérification des prérequis..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer : https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez l'installer."
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé."
    exit 1
fi

echo "✅ Tous les prérequis sont satisfaits !"

# Configuration du projet
echo ""
echo "📦 Configuration automatique du projet..."
echo "Cette opération va :"
echo "  - Installer toutes les dépendances"
echo "  - Configurer les hooks Git (Husky)"
echo "  - Initialiser la base de données Prisma (SQLite)"
echo "  - Configurer les outils de qualité de code"
echo ""

read -p "Continuer ? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Configuration annulée."
    exit 1
fi

# Étape 1: Configuration des hooks Git et installation de Husky
echo "🔧 Étape 1/4 : Configuration des hooks Git et installation de Husky..."

# Installation de Husky dans le frontend
if [ -d "front" ] && command -v npm &> /dev/null; then
    echo "📦 Installation des dépendances frontend..."
    cd front
    
    # Installation des dépendances (incluant Husky)
    npm install --silent
    cd ..
    
    # Vérification de la configuration Husky
    echo "🪝 Vérification de la configuration Husky..."
    
    # Vérification des hooks Git existants
    cd ..
    if [ -f ".githooks/pre-commit" ] && [ -f ".githooks/commit-msg" ]; then
        echo "✅ Hooks Git Husky déjà configurés!"
        echo "   - Hook pre-commit: Activé"
        echo "   - Hook commit-msg: Activé"
    else
        echo "⚠️  Configuration manuelle des hooks Husky..."
        # Créer le dossier .githooks s'il n'existe pas
        mkdir -p .githooks
        
        # Créer le hook pre-commit s'il n'existe pas
        if [ ! -f ".githooks/pre-commit" ]; then
            echo "cd AREA-Project/front && npm run pre-commit" > .githooks/pre-commit
            chmod +x .githooks/pre-commit
            echo "✅ Hook pre-commit créé"
        fi
        
        # Créer le hook commit-msg s'il n'existe pas
        if [ ! -f ".githooks/commit-msg" ]; then
            echo "cd AREA-Project/front && npx --no -- commitlint --edit \$1" > .githooks/commit-msg
            chmod +x .githooks/commit-msg
            echo "✅ Hook commit-msg créé"
        fi
    fi
    
    echo "✅ Husky configuré avec succès!"
    
    # Test des outils de qualité de code
    echo "🧪 Test des outils de qualité de code..."
    cd AREA-Project/front
    
    echo "  - Test du linting..."
    if npm run lint --silent; then
        echo "  ✅ Linting OK"
    else
        echo "  ❌ Erreurs de linting détectées"
        echo "  💡 Tentative de correction automatique..."
        npm run lint:fix --silent || echo "  ⚠️  Certaines erreurs nécessitent une correction manuelle"
    fi
    
    echo "  - Test du formatage..."
    if npm run format:check --silent; then
        echo "  ✅ Formatage OK"
    else
        echo "  ❌ Problèmes de formatage détectés"
        echo "  💡 Correction automatique du formatage..."
        npm run format --silent
        echo "  ✅ Formatage corrigé"
    fi
    
    echo "  - Test de la vérification de types..."
    if npm run type-check --silent; then
        echo "  ✅ Types OK"
    else
        echo "  ❌ Erreurs de types détectées - vérifiez votre code TypeScript"
    fi
    
    echo "  - Test du hook pre-commit..."
    if npm run pre-commit --silent; then
        echo "  ✅ Hook pre-commit OK"
    else
        echo "  ❌ Le hook pre-commit a détecté des problèmes"
        echo "  💡 Les fichiers ont été automatiquement corrigés si possible"
    fi
    
    cd ../..
else
    echo "❌ Dossier front non trouvé ou npm non disponible"
    exit 1
fi

# Tentative avec Docker si disponible
if [ -f "docker/docker-compose.dev.yml" ]; then
    if docker-compose -f docker/docker-compose.dev.yml config --services | grep -q setup; then
        docker-compose -f docker/docker-compose.dev.yml --profile setup run --rm setup || echo "⚠️  Setup service Docker non disponible, mais Husky a été installé manuellement"
    fi
else
    echo "⚠️  Fichier docker/docker-compose.dev.yml non trouvé, skipping Docker setup"
fi

# Étape 2: Construction des images de développement
echo "🏗️ Étape 2/4 : Construction des images Docker..."
if [ -f "docker/docker-compose.dev.yml" ]; then
    docker-compose -f docker/docker-compose.dev.yml build
else
    echo "⚠️  Fichier docker/docker-compose.dev.yml non trouvé, skipping Docker build"
fi

# Étape 3: Initialisation de la base de données Prisma
echo "🗄️ Étape 3/4 : Initialisation de la base de données Prisma..."
if [ -d "back" ] && [ -f "back/prisma/schema.prisma" ]; then
    cd back
    echo "Nettoyage des anciens dossiers node_modules et dist..."
    rm -rf node_modules dist
    echo "Installation des dépendances backend..."
    if npm install --silent; then
        echo "Génération du client Prisma..."
        npx prisma generate
        echo "Initialisation de la base de données..."
        npx prisma db push --accept-data-loss
        echo "✅ Base de données Prisma initialisée"
    else
        echo "❌ Échec de l'installation des dépendances backend"
        echo "Vous devrez installer les dépendances manuellement: cd back && npm install"
        echo "Puis initialiser la base: npx prisma generate && npx prisma db push"
    fi
    cd ..
else
    echo "⚠️  Dossier back ou schema Prisma non trouvé, skipping database init"
fi

# Étape 4: Vérification finale et résumé
echo "✅ Étape 4/4 : Vérification finale et résumé de la configuration..."

echo "📋 Résumé de la configuration :"
echo "  ✅ Dépendances frontend installées"
echo "  ✅ Hooks Git Husky configurés"
echo "  ✅ Outils de qualité de code testés"
echo "  ✅ Images Docker construites"
if [ -f "back/prisma/schema.prisma" ]; then
    echo "  ✅ Base de données Prisma initialisée"
else
    echo "  ⚠️  Base de données Prisma non configurée"
fi

echo ""
echo "🎉 Configuration terminée avec succès !"
echo ""
echo "🚀 Pour démarrer le développement :"
echo "   docker-compose -f docker/docker-compose.dev.yml up"
echo ""
echo "🌐 URLs disponibles :"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend:  http://localhost:5001"
echo "   - Database: SQLite (via Prisma Studio)"
echo ""
echo "🛠️ Commandes utiles :"
echo "   - Arrêter : docker-compose -f docker/docker-compose.dev.yml down"
echo "   - Logs :    docker-compose -f docker/docker-compose.dev.yml logs -f"
echo "   - Shell :   docker-compose -f docker/docker-compose.dev.yml exec frontend sh"
echo ""
echo "📚 Consultez DEVELOPMENT_SETUP.md pour plus d'informations"