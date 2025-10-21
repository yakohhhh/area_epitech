#!/bin/bash

echo "🔧 Test d'intégration Mobile <-> Backend API"
echo "=============================================="

BASE_URL="http://localhost:5001"
MOBILE_ORIGIN="http://localhost:5175"

echo "📡 Test des endpoints requis par l'application mobile..."

# Test 1: Health check mobile
echo "1️⃣ Test /mobile/health..."
HEALTH_RESPONSE=$(curl -s -H "Origin: $MOBILE_ORIGIN" "$BASE_URL/mobile/health")
if echo "$HEALTH_RESPONSE" | grep -q "Mobile API connectivity successful"; then
    echo "✅ Mobile health check OK"
else
    echo "❌ Mobile health check FAILED"
    echo "Response: $HEALTH_RESPONSE"
fi

# Test 2: CORS mobile
echo "2️⃣ Test CORS pour mobile..."
CORS_RESPONSE=$(curl -s -H "Origin: $MOBILE_ORIGIN" "$BASE_URL/mobile/cors-test")
if echo "$CORS_RESPONSE" | grep -q "CORS configuration is working"; then
    echo "✅ CORS mobile OK"
else
    echo "❌ CORS mobile FAILED"
    echo "Response: $CORS_RESPONSE"
fi

# Test 3: Auth endpoints
echo "3️⃣ Test endpoints d'authentification..."
AUTH_LOGIN_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -H "Origin: $MOBILE_ORIGIN" \
    -d '{"email":"test@test.com","password":"test123"}' "$BASE_URL/auth/login")
if echo "$AUTH_LOGIN_RESPONSE" | grep -q "error\|message"; then
    echo "✅ Endpoint auth/login accessible (retourne une erreur attendue pour user inexistant)"
else
    echo "❌ Endpoint auth/login non accessible"
    echo "Response: $AUTH_LOGIN_RESPONSE"
fi

# Test 4: User me endpoint (sans token, doit retourner 401)
echo "4️⃣ Test endpoint /user/me (sans token)..."
USER_ME_RESPONSE=$(curl -s -w "%{http_code}" -H "Origin: $MOBILE_ORIGIN" "$BASE_URL/user/me")
if echo "$USER_ME_RESPONSE" | grep -q "401"; then
    echo "✅ Endpoint /user/me protégé correctement (401 sans token)"
else
    echo "❌ Endpoint /user/me non protégé ou non accessible"
    echo "Response: $USER_ME_RESPONSE"
fi

# Test 5: About.json
echo "5️⃣ Test endpoint /about.json..."
ABOUT_RESPONSE=$(curl -s "$BASE_URL/about.json")
if echo "$ABOUT_RESPONSE" | grep -q "services"; then
    echo "✅ Endpoint /about.json OK"
else
    echo "❌ Endpoint /about.json FAILED"
    echo "Response: $ABOUT_RESPONSE"
fi

echo ""
echo "🎯 Tests terminés!"
echo "💡 Si tous les tests sont ✅, l'intégration mobile-backend est fonctionnelle."
echo "🚀 L'application mobile sur http://localhost:5175 peut maintenant communiquer avec l'API."