#!/bin/bash
# Script de déploiement pour l'application AREA
# Usage: ./scripts/deploy.sh [prod|dev] (depuis la racine du projet)

set -e

# Se placer dans le répertoire racine du projet
cd "$(dirname "$0")/.."

# Variables
MODE=${1:-dev}
PROJECT_DIR=$(pwd)
COMPOSE_FILE="docker/docker-compose.yml"

echo "🚀 Déploiement de l'application AREA"
echo "====================================="
echo "Mode: $MODE"

# Configuration selon le mode
if [ "$MODE" = "prod" ]; then
    COMPOSE_FILE="$COMPOSE_FILE -f docker/docker-compose.prod.yml"
    echo "📋 Mode production activé"
else
    echo "📋 Mode développement activé"
fi

# Vérifications préalables
echo ""
echo "🔍 Vérifications préalables..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé"
    exit 1
fi

# Vérifier que les images existent
if ! docker images area-frontend:latest -q | grep -q .; then
    echo "❌ Image area-frontend:latest non trouvée"
    echo "🔧 Lancez d'abord: ./build-all.sh"
    exit 1
fi

if ! docker images area-backend:latest -q | grep -q .; then
    echo "❌ Image area-backend:latest non trouvée"
    echo "🔧 Lancez d'abord: ./build-all.sh"
    exit 1
fi

echo "✅ Prérequis vérifiés"

# Arrêt des anciens containers
echo ""
echo "🛑 Arrêt des anciens containers..."
docker-compose down --remove-orphans || true

# Nettoyage des volumes orphelins (seulement en dev)
if [ "$MODE" = "dev" ]; then
    echo "🧹 Nettoyage des volumes orphelins..."
    docker volume prune -f
fi

# Création des réseaux si nécessaire
echo "🌐 Vérification des réseaux..."
docker network create area-network 2>/dev/null || true

# Déploiement
echo ""
echo "🚀 Déploiement des containers..."
eval "docker-compose $COMPOSE_FILE up -d"

# Attendre que les services soient prêts
echo ""
echo "⏳ Attente du démarrage des services..."
sleep 15

# Vérifications post-déploiement
echo ""
echo "🔍 Vérifications post-déploiement..."

# Vérifier les containers
echo "📋 État des containers:"
docker-compose ps

# Health checks
echo ""
echo "❤️ Health checks..."

# Test Frontend
echo -n "Frontend (http://localhost:3000): "
if curl -s -f http://localhost:3000/ > /dev/null; then
    echo "✅ OK"
else
    echo "❌ FAILED"
    echo "🔍 Logs Frontend:"
    docker logs area_frontend --tail 10
fi

# Test Backend  
echo -n "Backend (http://localhost:5001): "
if curl -s -f http://localhost:5001/health > /dev/null 2>&1; then
    echo "✅ OK"
else
    echo "❌ FAILED"
    echo "🔍 Logs Backend:"
    docker logs area_backend --tail 10
fi

# Monitoring des ressources
echo ""
echo "📊 Utilisation des ressources:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

# Informations finales
echo ""
echo "✅ Déploiement terminé!"
echo "======================"
echo ""
echo "🌐 URLs disponibles:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5001"
echo "   API Health: http://localhost:5001/health"
echo ""
echo "📋 Commandes utiles:"
echo "   Logs:     docker-compose logs -f"
echo "   Stop:     docker-compose down"
echo "   Restart:  docker-compose restart"
echo "   Stats:    docker stats"
echo ""

# Tests de sécurité rapides en production
if [ "$MODE" = "prod" ]; then
    echo "🔒 Tests de sécurité rapides..."
    
    # Vérifier les utilisateurs non-root
    echo -n "Utilisateur Frontend: "
    docker exec area_frontend id 2>/dev/null || echo "Container non accessible"
    
    echo -n "Utilisateur Backend: "
    docker exec area_backend id 2>/dev/null || echo "Container non accessible"
    
    # Vérifier les headers de sécurité
    echo ""
    echo "🛡️ Headers de sécurité Frontend:"
    curl -s -I http://localhost:3000/ | grep -E "(X-Frame-Options|X-Content-Type-Options|Content-Security-Policy)" || echo "Headers non détectés"
fi

echo ""
echo "🎉 Déploiement réussi! Application AREA opérationnelle."
