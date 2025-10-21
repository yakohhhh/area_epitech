# Hooks Git - Remplacement CI/CD

Ce projet utilise des **hooks Git locaux** au lieu de GitHub Actions (compatible version gratuite).

## 🚀 Installation rapide

```bash
# 1. Installer les hooks
./setup-hooks.sh

# 2. Tester que tout fonctionne
./check-all.sh
```

## 📋 Hooks disponibles

### pre-commit
Vérifie ESLint sur les fichiers modifiés avant chaque commit.
- ✅ Lint automatique du code TypeScript/JavaScript
- ✅ Vérifie uniquement les fichiers modifiés (rapide)
- ✅ Demande confirmation en cas d'erreurs

### pre-push
Vérifie que tous les services compilent avant un push.
- ✅ Installe les dépendances (avec cache npm)
- ✅ Vérifie TypeScript (tsc --noEmit)
- ✅ Lance les builds (back, front, mobile)
- ✅ Demande confirmation en cas d'échec

### commit-msg
Valide le format des messages de commit (recommandation).
- Format recommandé: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore
- ⚠️ Accepte aussi les messages libres (> 10 caractères)

## 🔧 Utilisation

### Workflow normal
```bash
# 1. Modifier du code
vim AREA-Project/front/src/App.tsx

# 2. Ajouter les changements
git add .

# 3. Commiter (pre-commit + commit-msg se lancent)
git commit -m "feat(front): add new feature"

# 4. Pousser (pre-push se lance)
git push
```

### Désactiver temporairement les hooks
```bash
# Désactiver pour un commit
git commit --no-verify -m "quick fix"

# Désactiver pour un push
git push --no-verify
```

### Tester manuellement les hooks
```bash
# Tester le pre-commit
.githooks/pre-commit

# Tester le pre-push
.githooks/pre-push

# Tester tout d'un coup
./check-all.sh
```

## 🔄 Migration vers repo public

Pour migrer vers `git@github.com:yakohhhh/area_epitech.git` :

```bash
# Lance le script de migration automatique
./migrate-to-public.sh
```

Ce script va :
1. ❌ Supprimer les workflows GitHub Actions (inutiles en gratuit)
2. ❌ Nettoyer les fichiers CI/CD (.releaserc.json, etc)
3. ✅ Installer les hooks Git locaux
4. ✅ Configurer le remote `public`
5. ✅ Pousser vers le nouveau repo

## 📦 Vérifications effectuées

### Par pre-commit (rapide)
- ESLint sur les fichiers modifiés
- Vérifie uniquement les services concernés

### Par pre-push (complet)
- Installation des dépendances (`npm ci` ou `npm install`)
- Vérification TypeScript (`tsc --noEmit`)
- Build complet (`npm run build`)
- Pour : Backend, Frontend, Mobile

## ⚙️ Configuration

### Modifier les hooks
Les hooks sont dans `.githooks/`:
```bash
vim .githooks/pre-commit
vim .githooks/pre-push
vim .githooks/commit-msg
```

### Désactiver définitivement
```bash
# Revenir aux hooks par défaut
git config --unset core.hooksPath

# Réactiver plus tard
git config core.hooksPath .githooks
```

## 🐛 Troubleshooting

### Les hooks ne se lancent pas
```bash
# Réinstaller
./setup-hooks.sh

# Vérifier la config
git config core.hooksPath
# Devrait afficher: .githooks
```

### npm install échoue
```bash
# Nettoyer le cache
cd AREA-Project/back && rm -rf node_modules package-lock.json
cd ../front && rm -rf node_modules package-lock.json
cd ../mobile && rm -rf node_modules package-lock.json

# Réinstaller
npm install
```

### Build échoue
```bash
# Vérifier manuellement chaque service
cd AREA-Project/back
npm install
npm run lint
npm run build

cd ../front
npm install
npm run lint
npm run build

cd ../mobile
npm install
npm run lint
npm run build
```

## 📚 Commandes utiles

```bash
# Vérifier tout d'un coup
./check-all.sh

# Vérifier un service spécifique
cd AREA-Project/back && npm run lint && npm run build

# Voir l'état Git
git status
git log --oneline -10

# Voir les remotes
git remote -v

# Pousser vers le repo public
git push public main
```

## 🎯 Avantages des hooks locaux

✅ **Gratuit** : Pas besoin de CI/CD payante  
✅ **Rapide** : Vérifie uniquement ce qui est nécessaire  
✅ **Local** : Pas de dépendance à GitHub  
✅ **Personnalisable** : Facile à modifier selon vos besoins  
✅ **Skippable** : Peut être désactivé avec `--no-verify`  

## 📄 Fichiers importants

```
.githooks/
  ├── pre-commit      # Lint avant commit
  ├── pre-push        # Build avant push
  ├── commit-msg      # Valide format commit
  └── README.md       # Cette doc

setup-hooks.sh        # Installe les hooks
migrate-to-public.sh  # Migre vers repo public
check-all.sh          # Vérifie tous les services
```

---

**Note** : Les hooks Git locaux remplacent complètement GitHub Actions pour ce projet. Pas besoin de plan payant ! 🎉
