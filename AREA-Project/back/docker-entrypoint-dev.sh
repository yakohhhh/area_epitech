#!/bin/sh
set -e

echo "🚀 Démarrage du backend AREA en mode développement..."

LOCKFILE="/app/package-lock.json"
HASH_FILE="/app/node_modules/.package-lock.hash"

if [ -f "$LOCKFILE" ]; then
  CURRENT_HASH=$(sha1sum "$LOCKFILE" | awk '{print $1}')

  if [ ! -d node_modules ] || [ ! -f "$HASH_FILE" ] || [ "$(cat "$HASH_FILE" 2>/dev/null)" != "$CURRENT_HASH" ]; then
    echo "📦 Installation des dépendances npm (npm ci)..."
    npm ci
    echo "$CURRENT_HASH" > "$HASH_FILE"
  fi
else
  echo "⚠️  Fichier package-lock.json introuvable, exécution de npm install..."
  npm install
fi

echo "📁 Utilisation de SQLite - pas d'attente nécessaire"

echo "🔄 Mise à jour du schéma de base de données..."
npx prisma db push --skip-generate

echo "🔧 Génération du client Prisma..."
npx prisma generate

if [ -f prisma/seed.ts ]; then
  echo "🌱 Seeding de la base de données..."
  npx prisma db seed
fi

echo "🎉 Backend prêt à démarrer !"

exec "$@"
