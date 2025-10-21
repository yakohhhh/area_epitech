# GitHub Actions CI/CD

## 🎯 Vue d'ensemble

Ce repo utilise **deux systèmes de CI/CD** :

### 1. 🔧 Git Hooks Locaux (Développement)
- **Où** : Sur ta machine locale
- **Quand** : Avant chaque commit/push
- **Avantage** : Feedback instantané, pas de consommation de minutes GitHub
- **Installation** : `./AREA-Project/scripts/setup-hooks.sh`

### 2. ☁️ GitHub Actions (Repo public)
- **Où** : Sur les serveurs GitHub
- **Quand** : À chaque push et PR
- **Avantage** : Validation centralisée, protection de la branche main
- **Gratuit** : 2000 minutes/mois sur repos publics

## 📋 Workflows GitHub Actions

### `.github/workflows/ci.yml`
Pipeline principal qui s'exécute sur chaque push :

```
Lint (parallèle)
├── Backend lint
├── Frontend lint  
└── Mobile lint
    ↓
Build (parallèle après lint)
├── Backend build
├── Frontend build
└── Mobile build
    ↓
Status (résumé)
```

**Temps estimé** : ~3-5 minutes par run

### `.github/workflows/pr-check.yml`
Vérifications spécifiques aux Pull Requests :
- Validation du titre de PR (format conventional commits)
- Auto-labeling selon les fichiers modifiés
- Statistiques des changements

## 🚀 Activation après migration

Une fois le push vers le repo public réussi :

1. **Les workflows sont automatiquement actifs !**
   - Aller sur : https://github.com/yakohhhh/area_epitech/actions
   - Tu verras les workflows listés

2. **Première exécution** :
   ```bash
   # Faire un commit test pour déclencher la CI
   git checkout main
   echo "# CI/CD Active" >> README.md
   git add README.md
   git commit -m "docs: test GitHub Actions CI"
   git push public main
   ```

3. **Vérifier les résultats** :
   - Va sur GitHub → Actions
   - Clique sur le workflow en cours
   - Tu verras les logs en temps réel

## 🛡️ Protection de branche (optionnel)

Pour forcer que la CI passe avant merge :

1. GitHub → Settings → Branches
2. Add rule pour `main`
3. Cocher "Require status checks to pass"
4. Sélectionner les checks requis :
   - `Lint & Type Check`
   - `Build Backend`
   - `Build Frontend`
   - `Build Mobile`

## 📊 Consommation

GitHub Actions gratuit pour repos publics :
- ✅ **2000 minutes/mois**
- Run moyen : ~3-5 minutes
- **~400-600 runs possibles/mois**

Largement suffisant pour un projet étudiant !

## 🔄 Workflow de développement recommandé

### En local (développement)
```bash
# 1. Coder
vim AREA-Project/back/src/...

# 2. Tester localement
npm run build

# 3. Commiter (hooks locaux s'exécutent)
git add .
git commit -m "feat(back): add feature"

# 4. Pousser (hooks locaux vérifient tout)
git push
```

Les hooks locaux te donnent un feedback immédiat **avant** GitHub Actions.

### Sur GitHub (CI centralisée)
- GitHub Actions re-vérifie tout
- Protection supplémentaire
- Visible pour toute l'équipe
- Historique des builds

## 💡 Comparaison

| Aspect | Git Hooks Locaux | GitHub Actions |
|--------|------------------|----------------|
| **Vitesse** | ⚡ Instantané | 🐢 3-5 min |
| **Coût** | ✅ Gratuit (0 minutes) | ✅ Gratuit (2000 min/mois) |
| **Lieu** | 💻 Local | ☁️ Cloud |
| **Bypass** | `--no-verify` | Non (sauf admin) |
| **Visible équipe** | ❌ Non | ✅ Oui |
| **Artifacts** | ❌ Non | ✅ Oui (7 jours) |

## 🎯 Meilleure pratique

**Utilise les deux !**

1. **Git Hooks** : Première ligne de défense, feedback rapide
2. **GitHub Actions** : Validation finale, protection de main

Les hooks locaux économisent tes minutes GitHub en attrapant les erreurs avant le push.

## 📝 Commandes utiles

```bash
# Voir les workflows disponibles
gh workflow list  # (si tu as GitHub CLI)

# Voir les runs récents
gh run list

# Voir les logs d'un run
gh run view <run-id> --log

# Re-run un workflow échoué
gh run rerun <run-id>

# Désactiver temporairement GitHub Actions
# → Supprimer le dossier .github/workflows/
```

## 🔧 Personnalisation

Pour modifier les workflows :

```bash
# Éditer le workflow principal
vim .github/workflows/ci.yml

# Tester localement avec act (optionnel)
act push  # Simule un push event

# Commiter et pousser
git add .github/
git commit -m "ci: update workflow"
git push
```

## ❓ FAQ

**Q: Les hooks locaux suffisent, pourquoi GitHub Actions ?**
R: Protection de branche, visibilité équipe, artifacts, historique centralisé.

**Q: GitHub Actions va coûter cher ?**
R: Non ! Gratuit pour repos publics (2000 min/mois).

**Q: Je peux skip GitHub Actions ?**
R: Non (sauf admin), mais tu peux skip les hooks locaux avec `--no-verify`.

**Q: Ça ralentit pas le développement ?**
R: Non, les hooks locaux sont rapides. GitHub Actions tourne en parallèle.

## 🎉 Résumé

✅ Git Hooks = Feedback rapide en local
✅ GitHub Actions = Validation centralisée
✅ Les deux sont gratuits
✅ Utilise les deux pour un workflow optimal !
