#!/bin/bash

# Script de test simple pour démarrer tous les services AREA
echo "🚀 Test de démarrage simple des services AREA"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Nettoyer les processus existants
echo "🧹 Nettoyage des processus existants..."
pkill -f "npm run" 2>/dev/null || true
sudo fuser -k 5001/tcp 3000/tcp 5175/tcp 2>/dev/null || true
sleep 3

echo ""
echo "📊 État des ports avant démarrage:"
echo -n "Port 5001 (Backend): "
nc -z localhost 5001 && echo "OCCUPÉ" || echo "LIBRE"
echo -n "Port 3000 (Frontend): "
nc -z localhost 3000 && echo "OCCUPÉ" || echo "LIBRE"
echo -n "Port 5175 (Mobile): "
nc -z localhost 5175 && echo "OCCUPÉ" || echo "LIBRE"

echo ""
echo "🚀 Démarrage des services..."

# Démarrer Backend
echo -e "${BLUE}⚡ Démarrage Backend...${NC}"
cd /home/depop/delivery/semester_tek3/G-DEV-500-STG-5-1-area-1/AREA-Project/back
gnome-terminal --title="AREA Backend" -- bash -c "npm run start:dev; exec bash" &
sleep 5

# Démarrer Frontend  
echo -e "${BLUE}🌐 Démarrage Frontend...${NC}"
cd /home/depop/delivery/semester_tek3/G-DEV-500-STG-5-1-area-1/AREA-Project/front
gnome-terminal --title="AREA Frontend" -- bash -c "npm run dev; exec bash" &
sleep 5

# Démarrer Mobile
echo -e "${BLUE}📱 Démarrage Mobile...${NC}"
cd /home/depop/delivery/semester_tek3/G-DEV-500-STG-5-1-area-1/AREA-Project/mobile
gnome-terminal --title="AREA Mobile" -- bash -c "npm run dev; exec bash" &
sleep 5

echo ""
echo "⏳ Attente du démarrage complet (30 secondes)..."
sleep 30

echo ""
echo "📊 État final des services:"
echo -n "Backend (5001): "
if nc -z localhost 5001; then
    echo -e "${GREEN}✓ ACTIF${NC}"
else
    echo "❌ INACTIF"
fi

echo -n "Frontend (3000): "
if nc -z localhost 3000; then
    echo -e "${GREEN}✓ ACTIF${NC}"
else
    echo "❌ INACTIF"  
fi

echo -n "Mobile (5175): "
if nc -z localhost 5175; then
    echo -e "${GREEN}✓ ACTIF${NC}"
else
    echo "❌ INACTIF"
fi

echo ""
echo "🎉 Services démarrés dans des terminaux séparés !"
echo ""
echo "🌐 URLs d'accès:"
echo "   Backend:  http://localhost:5001"
echo "   Frontend: http://localhost:3000"  
echo "   Mobile:   http://localhost:5175"
echo ""
echo "🔥 API Health: http://localhost:5001/mobile/health"
echo ""
echo "💡 Pour arrêter: fermez les terminaux ou utilisez ./quick.sh kill-ports"