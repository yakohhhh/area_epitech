import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonIcon,
  IonCard,
  IonCardContent,
  IonLoading,
  IonToast,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSegment,
  IonSegmentButton
} from '@ionic/react';
import { 
  logoGoogle, 
  mail, 
  lockClosed, 
  eyeOutline, 
  eyeOffOutline, 
  person 
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../../state/useAuthStore';
import { apiService } from '../../services/api';
import { useEmailValidation } from '../../hooks/useEmailValidation';
import { useUsernameValidation } from '../../hooks/useUsernameValidation';
import { usePasswordValidation } from '../../hooks/usePasswordValidation';
import PasswordStrength from '../../components/PasswordStrength';

const AuthPage: React.FC = () => {
  const history = useHistory();
  const { login } = useAuthStore();
  
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  // Validations
  const emailValidation = useEmailValidation(formData.email);
  const usernameValidation = useUsernameValidation(formData.username);
  const passwordValidation = usePasswordValidation(formData.password);

  const handleInputChange = (field: string, value: string | null | undefined) => {
    if (value !== null && value !== undefined) {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const validateForm = () => {
    // Validation email
    if (!formData.email.trim()) {
      setToastMessage('L\'email est requis');
      return false;
    }
    if (!emailValidation.isValid) {
      setToastMessage(emailValidation.errorMessage || 'Email invalide');
      return false;
    }

    // Validation username pour register
    if (authMode === 'register') {
      if (!formData.username.trim()) {
        setToastMessage('Le nom d\'utilisateur est requis');
        return false;
      }
      if (!usernameValidation.isValid) {
        setToastMessage(usernameValidation.errorMessage || 'Nom d\'utilisateur invalide');
        return false;
      }
    }

    // Validation mot de passe
    if (!formData.password) {
      setToastMessage('Le mot de passe est requis');
      return false;
    }

    if (authMode === 'register') {
      // Validation RGPD pour l'inscription
      if (!passwordValidation.isValid) {
        setToastMessage('Le mot de passe ne respecte pas les exigences de sécurité');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setToastMessage('Les mots de passe ne correspondent pas');
        return false;
      }
    } else {
      // Validation simple pour la connexion
      if (formData.password.length < 6) {
        setToastMessage('Le mot de passe doit contenir au moins 6 caractères');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    setIsLoading(true);
    try {
      let response;
      
      if (authMode === 'register') {
        response = await apiService.post('/auth/register', {
          email: formData.email,
          username: formData.username,
          password: formData.password
        });
      } else {
        response = await apiService.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
      }

      if (response.data.access_token) {
        const userData = {
          id: response.data.id,
          email: response.data.email,
          username: response.data.username
        };
        
        await login(response.data.access_token, userData);
        setToastMessage(authMode === 'register' ? 'Compte créé avec succès !' : 'Connexion réussie !');
        setToastColor('success');
        setShowToast(true);
        
        setTimeout(() => {
          history.replace('/dashboard');
        }, 1000);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      const message = error.response?.data?.message || 
        (authMode === 'register' ? 'Erreur lors de la création du compte' : 'Erreur de connexion');
      setToastMessage(message);
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      window.location.href = `${apiUrl}/auth/google?origin=mobile`;
    } catch (error: any) {
      console.error('Google auth error:', error);
      setToastMessage('Erreur lors de la connexion Google');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleModeChange = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    resetForm();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            {authMode === 'login' ? 'Connexion' : 'Inscription'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          {/* Segment pour choisir entre Login/Register */}
          <IonSegment 
            value={authMode} 
            onIonChange={e => handleModeChange(e.detail.value as 'login' | 'register')}
            style={{ marginBottom: '20px' }}
          >
            <IonSegmentButton value="login">
              <IonLabel>Connexion</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="register">
              <IonLabel>Inscription</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          <IonCard>
            <IonCardContent>
              {/* Email */}
              <IonItem>
                <IonIcon icon={mail} slot="start" />
                <IonLabel position="stacked">Email *</IonLabel>
                <IonInput
                  type="email"
                  value={formData.email}
                  placeholder="votre@email.com"
                  onIonInput={(e) => handleInputChange('email', e.detail.value!)}
                  clearInput
                />
              </IonItem>
              {formData.email && !emailValidation.isValid && (
                <IonText color="danger" style={{ fontSize: '14px', marginLeft: '16px' }}>
                  ⚠️ {emailValidation.errorMessage}
                </IonText>
              )}

              {/* Username (seulement pour register) */}
              {authMode === 'register' && (
                <>
                  <IonItem>
                    <IonIcon icon={person} slot="start" />
                    <IonLabel position="stacked">Nom d'utilisateur *</IonLabel>
                    <IonInput
                      type="text"
                      value={formData.username}
                      placeholder="Votre nom d'utilisateur"
                      onIonInput={(e) => handleInputChange('username', e.detail.value!)}
                      clearInput
                    />
                  </IonItem>
                  {formData.username && !usernameValidation.isValid && (
                    <IonText color="danger" style={{ fontSize: '14px', marginLeft: '16px' }}>
                      ⚠️ {usernameValidation.errorMessage}
                    </IonText>
                  )}
                </>
              )}

              {/* Password */}
              <IonItem>
                <IonIcon icon={lockClosed} slot="start" />
                <IonLabel position="stacked">Mot de passe *</IonLabel>
                <IonInput
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  placeholder="Votre mot de passe"
                  onIonInput={(e) => handleInputChange('password', e.detail.value!)}
                />
                <IonButton 
                  fill="clear" 
                  slot="end"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                </IonButton>
              </IonItem>

              {/* Password Strength (seulement pour register) */}
              {authMode === 'register' && formData.password && (
                <div style={{ padding: '0 16px' }}>
                  <PasswordStrength 
                    validation={passwordValidation}
                    password={formData.password}
                  />
                </div>
              )}

              {/* Confirm Password (seulement pour register) */}
              {authMode === 'register' && (
                <IonItem>
                  <IonIcon icon={lockClosed} slot="start" />
                  <IonLabel position="stacked">Confirmer le mot de passe *</IonLabel>
                  <IonInput
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    placeholder="Confirmez votre mot de passe"
                    onIonInput={(e) => handleInputChange('confirmPassword', e.detail.value!)}
                  />
                  <IonButton 
                    fill="clear" 
                    slot="end"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <IonIcon icon={showConfirmPassword ? eyeOffOutline : eyeOutline} />
                  </IonButton>
                </IonItem>
              )}

              {/* Submit Button */}
              <IonButton
                expand="block"
                onClick={handleSubmit}
                disabled={isLoading}
                style={{ marginTop: '20px' }}
              >
                {authMode === 'login' ? 'Se connecter' : 'Créer le compte'}
              </IonButton>

              {/* Google Auth Button */}
              <IonButton
                expand="block"
                fill="outline"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                style={{ marginTop: '10px' }}
              >
                <IonIcon icon={logoGoogle} slot="start" />
                {authMode === 'login' ? 'Se connecter avec Google' : 'S\'inscrire avec Google'}
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>

        <IonLoading isOpen={isLoading} message="Traitement en cours..." />
        
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color={toastColor}
        />
      </IonContent>
    </IonPage>
  );
};

export default AuthPage;