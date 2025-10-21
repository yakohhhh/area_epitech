#!/bin/bash
# Script de build simple pour l'application AREA
# Usage: ./build-simple.sh

set -e

echo "🚀 Build simple de l'application AREA"
echo "======================================"

# Variables
VERSION=$(date +%Y%m%d-%H%M%S)
PROJECT_DIR=$(pwd)

# Vérifications préalables
echo "🔍 Vérifications préalables..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

# Activation de BuildKit
export DOCKER_BUILDKIT=1

echo "✅ Prérequis vérifiés"

# Build Frontend
echo ""
echo "📦 Build Frontend (React + Nginx)..."
cd front

docker build \
    -t area-frontend:$VERSION \
    -t area-frontend:latest \
    .

# Vérification de la taille
echo "📊 Taille de l'image Frontend:"
docker images area-frontend:latest --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

cd "$PROJECT_DIR"

# Build Backend
echo ""
echo "📦 Build Backend (NestJS)..."
cd back

docker build \
    -t area-backend:$VERSION \
    -t area-backend:latest \
    .

# Vérification de la taille
echo "📊 Taille de l'image Backend:"
docker images area-backend:latest --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

cd "$PROJECT_DIR"

echo ""
echo "🎉 Build terminé avec succès !"
echo "Images créées:"
echo "  - area-frontend:latest"
echo "  - area-backend:latest"
echo ""
echo "Pour démarrer l'application:"
echo "  docker-compose up -d"
