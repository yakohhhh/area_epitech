#!/bin/bash

# Script de test complet avec backend + mobile
echo "🚀 Démarrage du test complet AREA Mobile"

# Se placer dans le répertoire racine du projet
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo "📱 Démarrage de l'application mobile..."
gnome-terminal --title="AREA Mobile" -- bash -c "cd '$PROJECT_ROOT/mobile' && npm run dev; exec bash" &

echo "⚡ Démarrage du backend API..."
gnome-terminal --title="AREA Backend" -- bash -c "cd '$PROJECT_ROOT/back' && npm run start:dev; exec bash" &

sleep 3

echo "✅ Services démarrés !"
echo ""
echo "📱 Application mobile: http://localhost:5174"
echo "🔧 API Backend: http://localhost:5001"
echo ""
echo "🧪 Tests suggérés:"
echo "1. Accéder à http://localhost:5174"
echo "2. Tester la page d'accueil"
echo "3. Tester l'inscription avec email/mot de passe"
echo "4. Tester la connexion avec Google OAuth"
echo "5. Vérifier la redirection vers le dashboard"
echo ""
echo "Pour arrêter les services, fermez les terminaux ou utilisez Ctrl+C"