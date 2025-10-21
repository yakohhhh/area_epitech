# AREA Project - CI/CD Simplifiée avec Hooks Git

## 🎯 Vue d'ensemble

Ce projet utilise des **hooks Git locaux** au lieu de GitHub Actions. C'est **gratuit**, **rapide** et **efficace** !

### ✅ Pourquoi des hooks locaux ?

- **Gratuit** : Pas besoin de CI/CD payante GitHub
- **Rapide** : Exécution locale instantanée
- **Flexible** : Peut être désactivé avec `--no-verify`
- **Simple** : Pas de configuration YAML complexe

## 🚀 Installation (1 commande)

```bash
./setup-hooks.sh
```

C'est tout ! Les hooks sont maintenant actifs.

## 📋 Ce qui est vérifié automatiquement

### ✨ Avant chaque commit (pre-commit)
- ESLint sur les fichiers modifiés
- Uniquement les services concernés (rapide !)

### 🔍 Avant chaque push (pre-push)
- Installation des dépendances
- Vérification TypeScript
- Build complet de : Backend, Frontend, Mobile

### 📝 Messages de commit (commit-msg)
- Format recommandé : `type(scope): description`
- Exemples : `feat(front): add login`, `fix(back): api bug`

## 💻 Utilisation quotidienne

```bash
# Workflow normal
git add .
git commit -m "feat(front): new feature"  # pre-commit s'exécute
git push                                   # pre-push s'exécute

# Désactiver temporairement
git commit --no-verify -m "quick fix"
git push --no-verify
```

## 🔄 Migration vers le repo public

Pour migrer vers `git@github.com:yakohhhh/area_epitech.git` :

```bash
./migrate-to-public.sh
```

Ce script :
1. ❌ Supprime GitHub Actions (inutiles)
2. ❌ Nettoie les fichiers CI/CD
3. ✅ Installe les hooks
4. ✅ Configure le remote `public`
5. ✅ Pousse vers le nouveau repo

## 🧪 Tester manuellement

```bash
# Vérifier tous les services
./check-all.sh

# Tester un hook spécifique
.githooks/pre-commit
.githooks/pre-push

# Vérifier un service
cd AREA-Project/back && npm install && npm run lint && npm run build
```

## 📚 Documentation

- **QUICKSTART.sh** : Guide rapide (lance `./QUICKSTART.sh`)
- **HOOKS-README.md** : Documentation complète
- **.githooks/** : Les hooks Git

## 📦 Fichiers créés

```
.githooks/
  ├── pre-commit       # ESLint avant commit
  ├── pre-push         # Build avant push
  ├── commit-msg       # Format des messages
  └── README.md        # Doc des hooks

setup-hooks.sh         # Installation des hooks
migrate-to-public.sh   # Migration vers repo public
check-all.sh           # Vérification complète
QUICKSTART.sh          # Guide rapide
HOOKS-README.md        # Documentation détaillée
```

## 🛠️ Commandes utiles

```bash
# Installation
./setup-hooks.sh

# Guide rapide
./QUICKSTART.sh

# Vérification complète
./check-all.sh

# Migration
./migrate-to-public.sh

# Voir la config Git
git config core.hooksPath

# Désactiver les hooks
git config --unset core.hooksPath

# Réactiver les hooks
git config core.hooksPath .githooks
```

## 🎓 Exemples de formats de commit

```bash
# Features
git commit -m "feat(back): add user authentication"
git commit -m "feat(front): implement dashboard"
git commit -m "feat(mobile): add push notifications"

# Fixes
git commit -m "fix(back): resolve API timeout"
git commit -m "fix(front): correct button alignment"

# Documentation
git commit -m "docs: update README"
git commit -m "docs(api): add endpoint documentation"

# Refactoring
git commit -m "refactor(back): simplify auth logic"

# Tests
git commit -m "test(front): add unit tests"

# Chores
git commit -m "chore: update dependencies"
git commit -m "chore(ci): configure hooks"
```

## 🐛 Résolution de problèmes

### Les hooks ne s'exécutent pas
```bash
./setup-hooks.sh
git config core.hooksPath  # Doit afficher: .githooks
```

### npm install échoue
```bash
rm -rf AREA-Project/*/node_modules
cd AREA-Project/back && npm install
cd ../front && npm install
cd ../mobile && npm install
```

### Build échoue
```bash
# Vérifier chaque service
cd AREA-Project/back && npm run lint && npm run build
cd ../front && npm run lint && npm run build
cd ../mobile && npm run lint && npm run build
```

## 🎉 Avantages

- ✅ **Pas de coût** : Fonctionne avec GitHub gratuit
- ✅ **Rapide** : Exécution locale instantanée  
- ✅ **Personnalisable** : Modifiez les hooks selon vos besoins
- ✅ **Skippable** : `--no-verify` si besoin
- ✅ **Complet** : Vérifie tout (lint + build + dépendances)

---

**🚀 Prêt à commencer ? Lance `./setup-hooks.sh` !**
