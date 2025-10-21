#!/bin/bash

# Script de test rapide de connectivité API mobile
echo "🔍 Test de connectivité API AREA Mobile"

# Vérifier si le backend est en cours d'exécution
echo "📡 Vérification du backend sur le port 5001..."
if nc -z localhost 5001; then
    echo "✅ Backend détecté sur le port 5001"
    
    # Test de l'endpoint about
    echo "🧪 Test endpoint /about..."
    ABOUT_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:5001/about -o /tmp/about_response.json)
    if [ "$ABOUT_RESPONSE" = "200" ]; then
        echo "✅ Endpoint /about accessible"
        cat /tmp/about_response.json | jq . 2>/dev/null || cat /tmp/about_response.json
    else
        echo "❌ Endpoint /about non accessible (code: $ABOUT_RESPONSE)"
    fi
    
    # Test de l'endpoint mobile health
    echo "🧪 Test endpoint /mobile/health..."
    HEALTH_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:5001/mobile/health -o /tmp/health_response.json)
    if [ "$HEALTH_RESPONSE" = "200" ]; then
        echo "✅ Endpoint /mobile/health accessible"
        cat /tmp/health_response.json | jq . 2>/dev/null || cat /tmp/health_response.json
    else
        echo "❌ Endpoint /mobile/health non accessible (code: $HEALTH_RESPONSE)"
    fi
    
    # Test CORS
    echo "🧪 Test CORS depuis localhost:5174..."
    CORS_RESPONSE=$(curl -s -w "%{http_code}" -H "Origin: http://localhost:5174" http://localhost:5001/mobile/cors-test -o /tmp/cors_response.json)
    if [ "$CORS_RESPONSE" = "200" ]; then
        echo "✅ CORS configuré correctement"
        cat /tmp/cors_response.json | jq . 2>/dev/null || cat /tmp/cors_response.json
    else
        echo "❌ Problème CORS (code: $CORS_RESPONSE)"
    fi
    
else
    echo "❌ Backend non détecté sur le port 5001"
    echo "💡 Lancez d'abord le backend avec:"
    echo "   cd AREA-Project/back && npm run start:dev"
fi

# Vérifier si le mobile est en cours d'exécution
echo ""
echo "📱 Vérification du mobile sur le port 5174..."
if nc -z localhost 5174; then
    echo "✅ Application mobile détectée sur le port 5174"
    echo "🌐 Accédez à: http://localhost:5174/api-test"
else
    echo "❌ Application mobile non détectée sur le port 5174"
    echo "💡 Lancez l'application mobile avec:"
    echo "   cd AREA-Project/mobile && npm run dev"
fi

echo ""
echo "🎯 Résumé:"
echo "- Backend: $(nc -z localhost 5001 && echo "✅ Actif" || echo "❌ Inactif")"
echo "- Mobile: $(nc -z localhost 5174 && echo "✅ Actif" || echo "❌ Inactif")"
echo ""
echo "📚 Next steps:"
echo "1. Si tout est ✅, testez sur: http://localhost:5174"
echo "2. Utilisez la page de test: http://localhost:5174/api-test"
echo "3. Testez l'authentification complète"

# Nettoyage
rm -f /tmp/about_response.json /tmp/health_response.json /tmp/cors_response.json