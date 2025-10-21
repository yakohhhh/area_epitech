# Hooks Git - Remplacement CI/CD

Ce projet utilise des hooks Git locaux au lieu de GitHub Actions (gratuit).

## Installation

```bash
./AREA-Project/scripts/setup-hooks.sh
```

## Hooks disponibles

- **pre-commit**: Vérifie ESLint sur les fichiers modifiés
- **pre-push**: Vérifie que tous les services (back/front/mobile) compilent
- **commit-msg**: Valide le format des messages de commit

## Désactiver temporairement

```bash
git commit --no-verify
git push --no-verify
```

## Commandes utiles

```bash
# Tester manuellement
.githooks/pre-commit
.githooks/pre-push

# Vérifier un service
cd AREA-Project/back && npm install && npm run build
cd AREA-Project/front && npm install && npm run build
cd AREA-Project/mobile && npm install && npm run build
```
