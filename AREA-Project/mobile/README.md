# AREA Mobile (Ionic React + Capacitor)

Application mobile (iOS / Android) en Ionic React consommant la même API que la version web existante.

## Stack
- Ionic React 8 / React 18
- Capacitor 6 (Android, iOS)
- Vite 5 (build rapide)
- TypeScript 5
- Zustand (state global) + Context léger d'auth
- Axios (API centralisée + interceptors)

## Structure
```
mobile/
  src/
    components/ui/    # Composants réutilisables (Header, Button, Loader...)
    pages/            # Pages (Login, Dashboard, Settings)
    routes/           # Définition des routes + gardes
    services/         # api.ts (axios instance) + auth.service.ts
    state/            # Zustand store + auth.context wrapper
    theme/            # variables.css + global.css (thème)
    main.tsx          # Bootstrap Ionic + Routing
```

## Pré-requis
- Node.js >= 18 LTS
- Ionic CLI (global) : `npm i -g @ionic/cli`
- Capacitor platform tools : Android Studio / Xcode installés selon cible

## Installation
```bash
cd mobile
cp .env.example .env   # adapter VITE_API_URL si besoin
npm install
```

## Démarrer en mode web (browser)
```bash
npm run dev
# ou
npm run ionic:serve
```

## Build web (dist)
```bash
npm run build
```

## Capacitor : initialisation plateformes
Après le premier `npm install` et `npm run build` :
```bash
npx cap add android
npx cap add ios        # (sur macOS)
npx cap sync
```

### Ouvrir dans Android Studio / Xcode
```bash
npm run cap:open:android
npm run cap:open:ios
```

### Flux de développement mobile
1. `npm run dev` (ou build) pour générer le web bundle
2. `npx cap sync` pour copier vers /android ou /ios
3. Ouvrir le projet natif et lancer sur émulateur/appareil

Astuce: pendant le dev, vous pouvez utiliser le serveur de Vite via le navigateur ou configurer un `server.url` dans `capacitor.config.ts` pour live-reload sur device (optionnel).

## Authentification
- `useAuthStore` (Zustand) conserve le token (Capacitor Preferences + fallback localStorage)
- Interceptor Axios injecte `Authorization: Bearer <token>`
- 401 -> logout automatique

## Personnalisation Thème
Modifier `src/theme/variables.css` pour aligner avec la charte de la version web.

## Ajout d'une nouvelle page
1. Créer le composant dans `src/pages/<section>/` (ex: `ProfilePage.tsx`)
2. Ajouter la route dans `src/routes/AppRoutes.tsx`
3. (Option) protéger avec `<PrivateRoute>` si besoin d'auth

## Tests (placeholder)
Vous pouvez ajouter Vitest + Testing Library si nécessaire. Commande existante: `npm test`.

## Lint / Format
```bash
npm run lint
npm run format
```

## Variables d'environnement
Toutes les variables doivent être préfixées par `VITE_` pour être exposées (ex: `VITE_API_URL`).

## Sécurité / TODO
- Raffiner la gestion d'erreurs API (toast, retry, mapping codes)
- Ajouter refresh token si supporté par l'API
- Ajouter gestion i18n
- Mettre en place tests E2E (Playwright) pour flux d'auth

## Licence
Interne (étudiant / projet) – Adapter si diffusion publique.

---
Bon dev ! 🚀
