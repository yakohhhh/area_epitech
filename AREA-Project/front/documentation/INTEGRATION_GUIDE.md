# 🔐 Authentification Frontend-Backend - AREA

## 🔄 Connexion Frontend ↔ Backend

### Configuration

- **Frontend** : `http://localhost:3000` (Vite dev server: 5173)
- **Backend** : `http://localhost:5001`
- **Variables d'environnement** : `.env` avec `VITE_API_URL=http://localhost:5001`

### 📋 Endpoints utilisés

#### 🔑 Connexion

```
POST /auth/login
{
  "email": "user@example.com",
  "username": "username" // optionnel
}
```

#### 📝 Inscription

```
POST /auth/register
{
  "email": "user@example.com",
  "username": "username",
  "password": "MotDePasse123!"
}
```

#### 🌐 Google OAuth

```
GET /auth/google         -> Redirection vers Google
GET /auth/google/callback -> Callback après authentification
```

## 🛡️ Validation RGPD des mots de passe

### Critères obligatoires :

- ✅ **8 caractères minimum**
- ✅ **1 majuscule** (A-Z)
- ✅ **1 minuscule** (a-z)
- ✅ **1 chiffre** (0-9)
- ✅ **1 caractère spécial** (!@#$%^&\*...)

### Indicateur visuel :

- 🔴 **Très faible** (1-2 critères) - 20-40%
- 🟡 **Moyen** (3 critères) - 60%
- 🟢 **Fort** (4 critères) - 80%
- 💚 **Très fort** (5 critères) - 100%

### Composants créés :

#### `usePasswordValidation` Hook

```tsx
const passwordValidation = usePasswordValidation(password);
// Retourne: { minLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar, isValid, score }
```

#### `PasswordStrength` Composant

```tsx
<PasswordStrength
  validation={passwordValidation}
  password={formData.password}
/>
```

## 👁️ Visibilité des mots de passe

### Fonctionnalités :

- **Toggle visibility** avec icônes œil ouvert/fermé
- **État indépendant** pour password et confirmPassword
- **Accessibilité** avec boutons appropriés

### Code :

```tsx
const [showPassword, setShowPassword] = useState(false);

<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
>
  {showPassword ? <FaEyeSlash /> : <FaEye />}
</button>

<input
  type={showPassword ? 'text' : 'password'}
  // ...
/>
```

## 🔌 Service d'authentification

### `authService.ts`

```tsx
import { authService } from '../services/authService';

// Inscription
const response = await authService.register({
  email: 'user@example.com',
  username: 'username',
  password: 'MotDePasse123!',
});

// Connexion
const response = await authService.login({
  email: 'user@example.com',
  username: 'username', // optionnel
});

// Google OAuth
const googleUrl = await authService.loginWithGoogle();
window.location.href = googleUrl;
```

## 🎨 Interface utilisateur

### Pages créées :

1. **LoginPage** (`/login`)
   - Connexion email + username
   - Bouton Google OAuth
   - Animations et illustrations

2. **RegisterPage** (`/register`)
   - Formulaire complet d'inscription
   - Validation RGPD temps réel
   - Toggle visibilité mot de passe
   - Vérification correspondance mots de passe

### Validation en temps réel :

- ❌ **Erreurs** affichées instantanément
- ✅ **Succès** avec messages de confirmation
- 🔄 **Loading states** pendant les requêtes API
- 🛡️ **Sécurité** validation côté client ET serveur

## 🚀 Démarrage

### Frontend :

```bash
cd front
npm install
npm run dev
# → http://localhost:5173
```

### Backend :

```bash
cd back
npm install
npm run start:dev
# → http://localhost:5001
```

### Test complet :

```bash
# Depuis la racine
./dev.sh setup    # Configuration automatique
./dev.sh simple   # Démarrage des services
```

## 🔧 Configuration CORS

Le backend est configuré pour accepter les requêtes depuis :

- `http://localhost:3000` (React dev server)
- `http://localhost:5173` (Vite dev server)
- `http://localhost:4173` (Vite preview)

## 📱 Responsive & Accessibilité

- ✅ Design mobile-first
- ✅ Support dark mode automatique
- ✅ Animations fluides et modernes
- ✅ Navigation clavier
- ✅ Messages d'erreur accessibles
- ✅ Indicateurs visuels clairs

## 🔍 Débogage

### Logs utiles :

```javascript
// Frontend (dans la console)
console.log('API Response:', response);

// Backend (dans le terminal)
console.log('🚀 AREA Backend server running on http://localhost:5001');
```

### Erreurs communes :

1. **CORS** : Vérifier que le backend accepte l'origine frontend
2. **API URL** : Vérifier `VITE_API_URL` dans `.env`
3. **Validation** : Vérifier que le mot de passe respecte tous les critères RGPD
