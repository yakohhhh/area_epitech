#!/bin/bash

# Test direct des services AREA en arrière-plan
echo "🚀 Test de démarrage direct des services AREA"

# Nettoyer les processus existants
echo "🧹 Nettoyage..."
pkill -f "npm run" 2>/dev/null || true
sudo fuser -k 5001/tcp 3000/tcp 5175/tcp 2>/dev/null || true
sleep 3

# Démarrer Backend en arrière-plan
echo "⚡ Démarrage Backend en arrière-plan..."
cd /home/depop/delivery/semester_tek3/G-DEV-500-STG-5-1-area-1/AREA-Project/back
nohup npm run start:dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Démarrer Frontend en arrière-plan
echo "🌐 Démarrage Frontend en arrière-plan..."
cd /home/depop/delivery/semester_tek3/G-DEV-500-STG-5-1-area-1/AREA-Project/front
nohup npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Démarrer Mobile en arrière-plan
echo "📱 Démarrage Mobile en arrière-plan..."
cd /home/depop/delivery/semester_tek3/G-DEV-500-STG-5-1-area-1/AREA-Project/mobile
nohup npm run dev > /tmp/mobile.log 2>&1 &
MOBILE_PID=$!
echo "Mobile PID: $MOBILE_PID"

# Revenir au répertoire principal
cd /home/depop/delivery/semester_tek3/G-DEV-500-STG-5-1-area-1

echo ""
echo "⏳ Attente du démarrage (60 secondes)..."

# Attendre et vérifier périodiquement
for i in {1..12}; do
    sleep 5
    echo -n "⏳ $((i*5))s - "
    backend_status=$(nc -z localhost 5001 && echo "✓" || echo "✗")
    frontend_status=$(nc -z localhost 3000 && echo "✓" || echo "✗")  
    mobile_status=$(nc -z localhost 5175 && echo "✓" || echo "✗")
    echo "Backend:$backend_status Frontend:$frontend_status Mobile:$mobile_status"
done

echo ""
echo "📊 État final des services:"
echo -n "Backend (5001): "
if nc -z localhost 5001; then
    echo "✅ ACTIF"
    curl -s http://localhost:5001/mobile/health | jq . 2>/dev/null || echo "API Health OK"
else
    echo "❌ INACTIF"
    echo "Log Backend:"
    tail -5 /tmp/backend.log
fi

echo -n "Frontend (3000): "
if nc -z localhost 3000; then
    echo "✅ ACTIF"
else
    echo "❌ INACTIF"
    echo "Log Frontend:"
    tail -5 /tmp/frontend.log  
fi

echo -n "Mobile (5175): "
if nc -z localhost 5175; then
    echo "✅ ACTIF"
else
    echo "❌ INACTIF"
    echo "Log Mobile:"
    tail -5 /tmp/mobile.log
fi

echo ""
echo "🎉 Services démarrés !"
echo "📍 URLs:"
echo "   Backend:  http://localhost:5001"
echo "   Frontend: http://localhost:3000"
echo "   Mobile:   http://localhost:5175"
echo ""
echo "🔍 Pour surveiller les logs:"
echo "   tail -f /tmp/backend.log"
echo "   tail -f /tmp/frontend.log"
echo "   tail -f /tmp/mobile.log"
echo ""
echo "🛑 PIDs pour arrêter:"
echo "   Backend:  $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo "   Mobile:   $MOBILE_PID"
echo ""
echo "   Ou utilisez: pkill -f 'npm run'"