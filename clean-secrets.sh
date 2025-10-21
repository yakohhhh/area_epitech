#!/bin/bash

# Script de nettoyage des secrets avant migration
# Remplace les secrets réels par des placeholders

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[✓]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[!]${NC} $1"; }

echo "🧹 Nettoyage des secrets..."
echo ""

# 1. Remplacer les secrets dans docker-compose.yml
print_status "Nettoyage de docker-compose.yml..."
for file in AREA-Project/docker-compose.yml AREA-Project/docker/docker-compose.dev.yml; do
    if [ -f "$file" ]; then
        sed -i 's/GOOGLE_CLIENT_ID=.*/GOOGLE_CLIENT_ID=your_google_client_id_here/g' "$file"
        sed -i 's/GOOGLE_CLIENT_SECRET=.*/GOOGLE_CLIENT_SECRET=your_google_client_secret_here/g' "$file"
        sed -i 's/GOOGLE_REDIRECT_URI=.*/GOOGLE_REDIRECT_URI=http:\/\/localhost:5001\/auth\/google\/callback/g' "$file"
    fi
done

# 2. Nettoyer les docs
print_status "Nettoyage de la documentation..."
for doc in AREA-Project/docs/GMAIL_INTEGRATION_CONNECTEDDASHBOARD.md AREA-Project/docs/RECAP_GMAIL_CONNECTEDDASHBOARD.md; do
    if [ -f "$doc" ]; then
        sed -i 's/"refresh_token": ".*"/"refresh_token": "YOUR_REFRESH_TOKEN_HERE"/g' "$doc"
        sed -i 's/refresh_token=.*/refresh_token=YOUR_REFRESH_TOKEN_HERE/g' "$doc"
    fi
done

# 3. Supprimer la base de données SQLite (elle contient des tokens)
print_status "Suppression de la base de données SQLite..."
rm -f AREA-Project/back/prisma/database/dev.sqlite
rm -f AREA-Project/back/prisma/database/dev.sqlite-journal

# 4. Nettoyer .env.example
print_status "Nettoyage de .env.example..."
if [ -f "AREA-Project/back/.env.example" ]; then
    sed -i 's/NOTION_API_TOKEN=.*/NOTION_API_TOKEN=your_notion_token_here/g' "AREA-Project/back/.env.example"
fi

# 5. Ajouter .gitignore pour les secrets
print_status "Mise à jour de .gitignore..."
cat >> AREA-Project/back/.gitignore << 'EOF'

# Database with secrets
prisma/database/*.sqlite
prisma/database/*.sqlite-journal
EOF

print_status "✅ Secrets nettoyés!"
echo ""
print_warning "Vérifiez les changements avant de commiter:"
echo "  git status"
echo "  git diff"
echo ""
print_status "Puis commitez et poussez:"
echo "  git add -A"
echo "  git commit -m 'chore: remove secrets from repository'"
echo "  git push public CI/CD --force"
