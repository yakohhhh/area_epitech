#!/bin/bash

echo "🔧 Test d'authentification unifiée Mobile"
echo "========================================"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Répertoire mobile
MOBILE_DIR="/home/depop/delivery/semester_tek3/G-DEV-500-STG-5-1-area-1/AREA-Project/mobile"

echo -e "${BLUE}1️⃣ Vérification de la structure des fichiers...${NC}"

# Vérifier que tous les fichiers nécessaires existent
FILES_TO_CHECK=(
    "src/hooks/usePasswordValidation.ts"
    "src/hooks/useEmailValidation.ts"  
    "src/hooks/useUsernameValidation.ts"
    "src/components/PasswordStrength.tsx"
    "src/components/ProtectedRoute.tsx"
    "src/pages/auth/AuthPage.tsx"
    "src/pages/LandingPage.tsx"
    "src/pages/dashboard/ProtectedDashboard.tsx"
    "src/services/auth.service.ts"
)

for file in "${FILES_TO_CHECK[@]}"
do
    if [ -f "$MOBILE_DIR/$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file - MANQUANT${NC}"
    fi
done

echo ""
echo -e "${BLUE}2️⃣ Vérification de la configuration...${NC}"

# Vérifier le fichier .env
if [ -f "$MOBILE_DIR/.env" ]; then
    echo -e "${GREEN}✅ Configuration .env trouvée${NC}"
    if grep -q "VITE_API_URL=http://localhost:5001" "$MOBILE_DIR/.env"; then
        echo -e "${GREEN}✅ URL API correcte${NC}"
    else
        echo -e "${YELLOW}⚠️ Vérifier l'URL API dans .env${NC}"
    fi
else
    echo -e "${RED}❌ Fichier .env manquant${NC}"
fi

echo ""
echo -e "${BLUE}3️⃣ Test de connectivité backend...${NC}"

# Tester que l'API backend fonctionne
if curl -s http://localhost:5001/mobile/health > /dev/null; then
    echo -e "${GREEN}✅ Backend accessible${NC}"
    
    # Test endpoint d'authentification  
    echo -e "${BLUE}Endpoints d'authentification:${NC}"
    
    # Test endpoint register (doit retourner une erreur mais être accessible)
    REGISTER_STATUS=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" \
        -d '{"email":"test","password":"test"}' \
        http://localhost:5001/auth/register -o /dev/null)
    
    if [ "$REGISTER_STATUS" = "400" ] || [ "$REGISTER_STATUS" = "409" ]; then
        echo -e "${GREEN}✅ /auth/register accessible${NC}"
    else
        echo -e "${YELLOW}⚠️ /auth/register status: $REGISTER_STATUS${NC}"
    fi
    
    # Test endpoint login  
    LOGIN_STATUS=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" \
        -d '{"email":"test","password":"test"}' \
        http://localhost:5001/auth/login -o /dev/null)
        
    if [ "$LOGIN_STATUS" = "400" ] || [ "$LOGIN_STATUS" = "401" ]; then
        echo -e "${GREEN}✅ /auth/login accessible${NC}"
    else
        echo -e "${YELLOW}⚠️ /auth/login status: $LOGIN_STATUS${NC}"
    fi
    
else
    echo -e "${RED}❌ Backend non accessible sur localhost:5001${NC}"
    echo -e "${YELLOW}💡 Assurez-vous que le backend est démarré:${NC}"
    echo "   cd AREA-Project/back && npm run start:dev"
fi

echo ""
echo -e "${BLUE}4️⃣ Vérification TypeScript...${NC}"

cd "$MOBILE_DIR"

# Vérifier que les types TypeScript sont corrects (sans build complet)
if npm run type-check 2>/dev/null || npx tsc --noEmit 2>/dev/null; then
    echo -e "${GREEN}✅ Types TypeScript valides${NC}"
else
    echo -e "${YELLOW}⚠️ Vérifiez les types TypeScript${NC}"
fi

echo ""
echo -e "${BLUE}5️⃣ Résumé et next steps...${NC}"

echo -e "${GREEN}✅ Fonctionnalités implémentées:${NC}"
echo "   • Page d'authentification unifiée (Login/Register)"
echo "   • Validation RGPD des mots de passe"
echo "   • Validation email et username"
echo "   • Dashboard protégé par authentification"
echo "   • Redirection automatique selon l'état de connexion"
echo "   • Intégration avec l'API backend"

echo ""
echo -e "${YELLOW}🚀 Pour tester l'application:${NC}"
echo "1. Démarrer le backend: cd back && npm run start:dev"
echo "2. Démarrer le mobile: cd mobile && npm run dev"  
echo "3. Ouvrir http://localhost:5175"
echo "4. Tester l'inscription avec validation RGPD"
echo "5. Tester la connexion et l'accès au dashboard"

echo ""
echo -e "${BLUE}🎯 Test terminé!${NC}"