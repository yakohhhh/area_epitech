import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthBackground } from '../components/Animation/ScrollAnimation';
import { GoogleIcon, RegisterIllustration } from '../components/Icons';
import PasswordStrength from '../components/Auth/PasswordStrength';
import { usePasswordValidation } from '../hooks/usePasswordValidation';
import { useEmailValidation } from '../hooks/useEmailValidation';
import { useUsernameValidation } from '../hooks/useUsernameValidation';
import { authService } from '../services/authService';
import '../styles/auth.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Vérifier s'il y a une erreur dans l'URL
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  // Validation du mot de passe selon RGPD
  const passwordValidation = usePasswordValidation(formData.password);

  // Validation de l'email
  const emailValidation = useEmailValidation(formData.email);

  // Validation du nom d'utilisateur
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
    setSuccess('');

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

    // Validation avancée RGPD du mot de passe
    if (!passwordValidation.isValid) {
      setError('Le mot de passe ne respecte pas les exigences de sécurité.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setIsLoading(false);
      return;
    }

    if (!formData.email || !formData.username) {
      setError('Veuillez remplir tous les champs obligatoires.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });

      setSuccess(
        response.message ||
          'Compte créé avec succès ! Connexion automatique en cours...'
      );
      setError('');

      // Connecter automatiquement l'utilisateur après inscription
      login({
        id: response.id || Date.now(),
        username: response.username || null,
        email: response.email,
      });

      // Réinitialiser le formulaire après succès
      setFormData({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
      });

      // Rediriger vers la page d'accueil après inscription réussie
      setTimeout(() => {
        navigate('/');
      }, 1500); // Attendre 1.5 secondes pour que l'utilisateur puisse voir le message de succès
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Erreur lors de la création du compte. Veuillez réessayer.';
      setError(errorMessage);
      setSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const googleUrl = await authService.registerWithGoogle();
      window.location.href = googleUrl;
    } catch (err) {
      setError("Erreur lors de l'inscription avec Google.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
              <RegisterIllustration />
            </div>
            <h1 className="auth-title">Créer un compte</h1>
            <p className="auth-subtitle">
              Rejoignez AREA et automatisez vos tâches en quelques clics
            </p>
          </div>
          <button
            type="button"
            className="google-btn"
            onClick={handleGoogleRegister}
            aria-label="S'inscrire avec Google"
          >
            <GoogleIcon className="google-icon" aria-hidden="true" />
            S&apos;inscrire avec Google
          </button>{' '}
          <div className="divider">ou</div>
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div
                className="error-message"
                role="alert"
                aria-live="polite"
                id="register-error"
              >
                {error}
              </div>
            )}
            {success && (
              <div
                className="success-message"
                role="status"
                aria-live="polite"
                id="register-success"
              >
                {success}
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
                  aria-describedby={error ? 'register-error' : undefined}
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
                  aria-describedby={error ? 'register-error' : undefined}
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
                  aria-describedby="password-strength register-error"
                  autoComplete="new-password"
                  style={{ paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
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
              <div
                id="password-strength"
                aria-label="Indicateur de force du mot de passe"
              >
                <PasswordStrength
                  validation={passwordValidation}
                  password={formData.password}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmer le mot de passe *
              </label>
              <div className="form-input-container">
                <FaLock className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Confirmez votre mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  style={{ paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
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
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={isLoading}
              aria-describedby={
                error
                  ? 'register-error'
                  : success
                    ? 'register-success'
                    : undefined
              }
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner" aria-hidden="true" />
                  <span className="sr-only">
                    Création du compte en cours...
                  </span>
                  Créer mon compte
                </>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>
          <div className="auth-links">
            <span style={{ color: '#64748b', fontSize: '14px' }}>
              Vous avez déjà un compte ?
            </span>
            <button
              type="button"
              className="auth-link"
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                color: '#3b82f6',
              }}
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </AuthBackground>
  );
};

export default RegisterPage;
