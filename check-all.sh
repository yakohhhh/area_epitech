#!/bin/bash

# Script de vérification rapide - Test tous les services
# Utile pour vérifier que tout fonctionne avant un commit/push

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[✓]${NC} $1"; }
print_error() { echo -e "${RED}[✗]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[!]${NC} $1"; }

echo "🔍 Vérification rapide de tous les services..."
echo ""

FAILED=0

# Backend
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Backend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd AREA-Project/back
if npm install --prefer-offline --no-audit && npm run lint && npm run build; then
    print_status "Backend: OK"
else
    print_error "Backend: FAILED"
    FAILED=1
fi
cd ../..
echo ""

# Frontend
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Frontend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd AREA-Project/front
if npm install --prefer-offline --no-audit && npm run lint && npm run build; then
    print_status "Frontend: OK"
else
    print_error "Frontend: FAILED"
    FAILED=1
fi
cd ../..
echo ""

# Mobile
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Mobile"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd AREA-Project/mobile
if npm install --prefer-offline --no-audit && npm run lint && npm run build; then
    print_status "Mobile: OK"
else
    print_error "Mobile: FAILED"
    FAILED=1
fi
cd ../..
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $FAILED -eq 0 ]; then
    print_status "✅ Tous les services sont OK!"
    exit 0
else
    print_error "❌ Certains services ont des erreurs"
    exit 1
fi
