#!/bin/bash

# Guide d'utilisation rapide - AREA Project avec Hooks Git

cat << 'EOF'
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║        🚀 AREA PROJECT - CI/CD avec Hooks Git Locaux 🚀          ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

📖 GUIDE RAPIDE
═══════════════

🔧 INSTALLATION (À faire une seule fois)
────────────────────────────────────────
./setup-hooks.sh

✅ Vérifie que les hooks sont installés:
   git config core.hooksPath
   # Devrait afficher: .githooks


🔍 VÉRIFICATION COMPLÈTE (Avant de commencer)
──────────────────────────────────────────────
./check-all.sh

Cela vérifie:
  ✓ Backend : npm install + lint + build
  ✓ Frontend: npm install + lint + build  
  ✓ Mobile  : npm install + lint + build


💻 WORKFLOW DE DÉVELOPPEMENT
─────────────────────────────
1. Modifier du code
   vim AREA-Project/front/src/App.tsx

2. Ajouter au commit
   git add .

3. Commiter (pre-commit lance ESLint automatiquement)
   git commit -m "feat(front): add new feature"

4. Pousser (pre-push vérifie tout automatiquement)
   git push


⚡ COMMANDES RAPIDES
────────────────────
# Commit rapide (skip hooks si nécessaire)
git commit --no-verify -m "quick fix"

# Push rapide (skip hooks si nécessaire)
git push --no-verify

# Tester manuellement le pre-commit
.githooks/pre-commit

# Tester manuellement le pre-push
.githooks/pre-push


🔄 MIGRATION VERS REPO PUBLIC
──────────────────────────────
./migrate-to-public.sh

Destination: git@github.com:yakohhhh/area_epitech.git

Cela va:
  1. Supprimer GitHub Actions (inutile en gratuit)
  2. Installer les hooks locaux
  3. Configurer le remote "public"
  4. Pousser vers le nouveau repo


📦 VÉRIFIER UN SERVICE SPÉCIFIQUE
──────────────────────────────────
# Backend
cd AREA-Project/back
npm install
npm run lint
npm run build

# Frontend
cd AREA-Project/front
npm install
npm run lint
npm run build

# Mobile
cd AREA-Project/mobile
npm install
npm run lint
npm run build


🐛 RÉSOLUTION DE PROBLÈMES
───────────────────────────
# Les hooks ne marchent pas ?
./setup-hooks.sh

# npm install échoue ?
rm -rf AREA-Project/*/node_modules AREA-Project/*/package-lock.json
cd AREA-Project/back && npm install
cd ../front && npm install
cd ../mobile && npm install

# Désactiver temporairement les hooks
git commit --no-verify
git push --no-verify

# Réactiver les hooks
git config core.hooksPath .githooks


📚 DOCUMENTATION COMPLÈTE
─────────────────────────
cat HOOKS-README.md


═══════════════════════════════════════════════════════════════════

✅ Hooks installés       : .githooks/pre-commit, pre-push, commit-msg
📝 Scripts disponibles   : setup-hooks.sh, migrate-to-public.sh, check-all.sh
📖 Documentation complète: HOOKS-README.md

═══════════════════════════════════════════════════════════════════

🎯 PRÊT À COMMENCER !

EOF
