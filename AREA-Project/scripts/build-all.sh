#!/bin/bash
# Script de build complet pour l'application AREA
# Usage: ./scripts/build-all.sh [push] (depuis la racine du projet)

set -e

# Se placer dans le répertoire racine du projet
cd "$(dirname "$0")/.."

echo "🚀 Build complet de l'application AREA"
echo "======================================="

# Variables
REGISTRY="localhost:5001"
VERSION=$(date +%Y%m%d-%H%M%S)
PROJECT_DIR=$(pwd)

# Vérifications préalables
echo "🔍 Vérifications préalables..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

if ! command -v trivy &> /dev/null; then
    echo "⚠️  Trivy n'est pas installé - installation automatique..."
    mkdir -p ~/.local/bin
    curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b ~/.local/bin
    export PATH="$HOME/.local/bin:$PATH"
fi

# Activation de BuildKit (si disponible)
if docker buildx version &> /dev/null; then
    export DOCKER_BUILDKIT=1
    echo "✅ BuildKit activé"
else
    echo "⚠️  BuildKit non disponible, utilisation du builder traditionnel"
fi

# Build Frontend
echo ""
echo "📦 Build Frontend (React + Nginx)..."
cd front/
if [ "$DOCKER_BUILDKIT" = "1" ]; then
    docker build \
        --build-arg BUILDKIT_INLINE_CACHE=1 \
        -t area-frontend:$VERSION \
        -t area-frontend:latest \
        .
else
    docker build \
        -t area-frontend:$VERSION \
        -t area-frontend:latest \
        .
fi

# Vérification de la taille
echo "📊 Taille de l'image Frontend:"
docker images area-frontend:latest --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# Build Backend
echo ""
echo "📦 Build Backend (NestJS)..."
cd ../back/
docker build \
    -t area-backend:$VERSION \
    -t area-backend:latest \
    .

# Vérification de la taille
echo "📊 Taille de l'image Backend:"
docker images area-backend:latest --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

cd "$PROJECT_DIR"

# Tests de sécurité
echo ""
echo "🔒 Tests de sécurité avec Trivy..."
echo "---------------------------------"

echo "🔍 Scan Frontend..."
trivy image --severity HIGH,CRITICAL area-frontend:latest

echo ""
echo "🔍 Scan Backend..."
trivy image --severity HIGH,CRITICAL area-backend:latest

# Docker Scout (si disponible)
if docker scout version &> /dev/null 2>&1; then
    echo ""
    echo "🔍 Scan avec Docker Scout..."
    docker scout cves area-frontend:latest
    docker scout cves area-backend:latest
else
    echo ""
    echo "⚠️  Docker Scout non disponible - scan ignoré"
fi

# Hadolint (si disponible)
if command -v hadolint &> /dev/null; then
    echo ""
    echo "🔍 Audit des Dockerfiles..."
    echo "Frontend Dockerfile:"
    hadolint front/Dockerfile || true
    echo "Backend Dockerfile:"
    hadolint back/Dockerfile || true
fi

# Tests de base des images
echo ""
echo "🧪 Tests de base des images..."
echo "Test utilisateur non-root Frontend:"
docker run --rm area-frontend:latest id || echo "⚠️  Test échoué"

echo "Test utilisateur non-root Backend:"
docker run --rm area-backend:latest id || echo "⚠️  Test échoué"

# Push vers registry (optionnel)
if [ "$1" = "push" ]; then
    echo ""
    echo "📤 Push vers registry $REGISTRY..."
    
    # Vérifier si le registry est accessible
    if curl -s $REGISTRY/v2/ > /dev/null; then
        docker tag area-frontend:latest $REGISTRY/area-frontend:$VERSION
        docker tag area-backend:latest $REGISTRY/area-backend:$VERSION
        docker push $REGISTRY/area-frontend:$VERSION
        docker push $REGISTRY/area-backend:$VERSION
        echo "✅ Images poussées vers le registry"
    else
        echo "⚠️  Registry $REGISTRY non accessible, push ignoré"
    fi
fi

# Nettoyage des images dangling
echo ""
echo "🧹 Nettoyage des images inutiles..."
docker image prune -f

# Résumé final
echo ""
echo "✅ Build terminé avec succès!"
echo "=============================="
echo "📦 Images créées:"
echo "   - area-frontend:$VERSION"
echo "   - area-frontend:latest"
echo "   - area-backend:$VERSION" 
echo "   - area-backend:latest"
echo ""
echo "🚀 Pour déployer: ./deploy.sh"
echo "🔍 Pour plus de tests: docker-compose up -d"
