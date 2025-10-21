import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthBackground } from '../components/Animation/ScrollAnimation';
import { GoogleIcon, LoginIllustration } from '../components/Icons';
import { useEmailValidation } from '../hooks/useEmailValidation';
import { useUsernameValidation } from '../hooks/useUsernameValidation';
import { authService } from '../services/authService';
import '../styles/auth.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  // Récupérer l'URL de destination depuis l'état de navigation
  const from = location.state?.from?.pathname || '/dashboard';
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Vérifier s'il y a une erreur dans l'URL
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  // Validation de l'email et du nom d'utilisateur
  const emailValidation = useEmailValidation(formData.email);
  const usernameValidation = useUsernameValidation(formData.username);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation de l'email
    if (!emailValidation.isValid) {
      setError(
        emailValidation.errorMessage ||
          "Format d'email invalide. Exemple: utilisateur@domaine.com"
      );
      setIsLoading(false);
      return;
    }

    // Validation du nom d'utilisateur
    if (!usernameValidation.isValid) {
      setError(usernameValidation.errorMessage || "Nom d'utilisateur invalide");
      setIsLoading(false);
      return;
    }

    // Validation des champs requis
    if (!formData.email || !formData.username || !formData.password) {
      setError('Veuillez remplir tous les champs obligatoires.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.login({
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });

      // eslint-disable-next-line no-console
      console.log('Login successful:', response);

      // Connecter l'utilisateur dans le contexte d'authentification
      login(
        {
          id: response.id || Date.now(),
          username: response.username || null,
          email: response.email,
          access_token: response.access_token,
        },
        response.access_token
      );

      // Rediriger vers la page demandée ou dashboard par défaut
      navigate(from, { replace: true });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Erreur de connexion. Veuillez réessayer.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const googleUrl = await authService.loginWithGoogle();
      window.location.href = googleUrl;
    } catch (err) {
      setError('Erreur lors de la connexion avec Google.');
    }
  };

  return (
    <AuthBackground>
      <div className="auth-container">
        {/* Logo cliquable AREA - positionné au-dessus de la carte */}
        <button
          type="button"
          style={{
            position: 'fixed',
            top: '30px',
            left: '30px',
            cursor: 'pointer',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#3b82f6',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.95)',
            border: '2px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '10px 16px',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          }}
          onClick={() => navigate('/')}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
          }}
          aria-label="Retour à l'accueil"
        >
          AREA
        </button>

        <div className="auth-card">
          <div className="auth-header">
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <LoginIllustration />
            </div>
            <h1 className="auth-title">Bienvenue</h1>
            <p className="auth-subtitle">
              Connectez-vous à votre compte AREA pour accéder à toutes vos
              automations
            </p>
          </div>

          <button
            type="button"
            className="google-btn"
            onClick={handleGoogleLogin}
            aria-label="Se connecter avec Google"
          >
            <GoogleIcon className="google-icon" aria-hidden="true" />
            Se connecter avec Google
          </button>

          <div className="divider">ou</div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div
                className="error-message"
                role="alert"
                aria-live="polite"
                id="login-error"
              >
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Adresse email *
              </label>
              <div className="form-input-container">
                <FaEnvelope className="input-icon" aria-hidden="true" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  aria-describedby={error ? 'login-error' : undefined}
                  autoComplete="email"
                />
              </div>
              {formData.email && !emailValidation.isValid && (
                <div
                  className="field-error-message"
                  style={{
                    color: '#ef4444',
                    fontSize: '14px',
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  ⚠️ {emailValidation.errorMessage}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Nom d&apos;utilisateur *
              </label>
              <div className="form-input-container">
                <FaUser className="input-icon" aria-hidden="true" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-input"
                  placeholder="Votre nom d'utilisateur"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  aria-describedby={error ? 'login-error' : undefined}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mot de passe *
              </label>
              <div className="form-input-container">
                <FaLock className="input-icon" aria-hidden="true" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Votre mot de passe"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                  aria-describedby={error ? 'login-error' : undefined}
                  autoComplete="current-password"
                  style={{ paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? 'Masquer le mot de passe'
                      : 'Afficher le mot de passe'
                  }
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  {showPassword ? (
                    <FaEyeSlash aria-hidden="true" />
                  ) : (
                    <FaEye aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={isLoading}
              aria-describedby={error ? 'login-error' : undefined}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner" aria-hidden="true" />
                  <span className="sr-only">Connexion en cours...</span>
                  Se connecter
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="auth-links">
            <a href="/forgot-password" className="auth-link">
              Mot de passe oublié ?
            </a>
            <span style={{ color: '#94a3b8', margin: '0 8px' }}>•</span>
            <button
              type="button"
              className="auth-link"
              onClick={() => navigate('/register')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                color: '#3b82f6',
              }}
            >
              Créer un compte
            </button>
          </div>
        </div>
      </div>
    </AuthBackground>
  );
};

export default LoginPage;
