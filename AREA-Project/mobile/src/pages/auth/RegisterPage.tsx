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
  IonBackButton,
  IonButtons
} from '@ionic/react';
import { logoGoogle, mail, lockClosed, person, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../../state/useAuthStore';
import { apiService } from '../../services/api';

const RegisterPage: React.FC = () => {
  const history = useHistory();
  const { login } = useAuthStore();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  const handleInputChange = (field: string, value: string | null | undefined) => {
    if (value !== null && value !== undefined) {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setToastMessage('Le prénom est requis');
      return false;
    }
    if (!formData.lastName.trim()) {
      setToastMessage('Le nom est requis');
      return false;
    }
    if (!formData.email.trim()) {
      setToastMessage('L\'email est requis');
      return false;
    }
    if (!formData.password) {
      setToastMessage('Le mot de passe est requis');
      return false;
    }
    if (formData.password.length < 6) {
      setToastMessage('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setToastMessage('Les mots de passe ne correspondent pas');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setToastMessage('Veuillez entrer un email valide');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      if (response.data.access_token) {
        await login(response.data.access_token, response.data.user);
        setToastMessage('Compte créé avec succès !');
        setToastColor('success');
        setShowToast(true);
        
        setTimeout(() => {
          history.replace('/dashboard');
        }, 1000);
      }
    } catch (error: any) {
      console.error('Register error:', error);
      const message = error.response?.data?.message || 'Erreur lors de la création du compte';
      setToastMessage(message);
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    try {
      // Redirection vers l'authentification Google avec origine mobile
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      window.location.href = `${apiUrl}/auth/google?origin=mobile`;
    } catch (error: any) {
      console.error('Google register error:', error);
      setToastMessage('Erreur lors de l\'inscription avec Google');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Créer un compte</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '100%',
          padding: '2rem 1rem'
        }}>
          {/* Logo/Title */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <IonText>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                background: 'linear-gradient(135deg, #273469, #1e2749)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem'
              }}>
                AREA
              </h1>
              <p style={{ 
                fontSize: '1.1rem', 
                color: '#666', 
                margin: 0 
              }}>
                Créez votre compte gratuitement
              </p>
            </IonText>
          </div>

          {/* Register Form */}
          <IonCard style={{ width: '100%', maxWidth: '400px', margin: 0 }}>
            <IonCardContent style={{ padding: '2rem' }}>
              {/* First Name Input */}
              <IonItem style={{ marginBottom: '1rem' }}>
                <IonIcon icon={person} slot="start" />
                <IonLabel position="stacked">Prénom</IonLabel>
                <IonInput
                  type="text"
                  value={formData.firstName}
                  onIonInput={(e) => handleInputChange('firstName', e.detail.value)}
                  placeholder="Votre prénom"
                />
              </IonItem>

              {/* Last Name Input */}
              <IonItem style={{ marginBottom: '1rem' }}>
                <IonIcon icon={person} slot="start" />
                <IonLabel position="stacked">Nom</IonLabel>
                <IonInput
                  type="text"
                  value={formData.lastName}
                  onIonInput={(e) => handleInputChange('lastName', e.detail.value)}
                  placeholder="Votre nom"
                />
              </IonItem>

              {/* Email Input */}
              <IonItem style={{ marginBottom: '1rem' }}>
                <IonIcon icon={mail} slot="start" />
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  type="email"
                  value={formData.email}
                  onIonInput={(e) => handleInputChange('email', e.detail.value)}
                  placeholder="votre@email.com"
                />
              </IonItem>

              {/* Password Input */}
              <IonItem style={{ marginBottom: '1rem' }}>
                <IonIcon icon={lockClosed} slot="start" />
                <IonLabel position="stacked">Mot de passe</IonLabel>
                <IonInput
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onIonInput={(e) => handleInputChange('password', e.detail.value)}
                  placeholder="••••••••"
                />
                <IonButton 
                  fill="clear" 
                  slot="end"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                </IonButton>
              </IonItem>

              {/* Confirm Password Input */}
              <IonItem style={{ marginBottom: '1.5rem' }}>
                <IonIcon icon={lockClosed} slot="start" />
                <IonLabel position="stacked">Confirmer le mot de passe</IonLabel>
                <IonInput
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onIonInput={(e) => handleInputChange('confirmPassword', e.detail.value)}
                  placeholder="••••••••"
                />
                <IonButton 
                  fill="clear" 
                  slot="end"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <IonIcon icon={showConfirmPassword ? eyeOffOutline : eyeOutline} />
                </IonButton>
              </IonItem>

              {/* Register Button */}
              <IonButton
                expand="block"
                size="large"
                onClick={handleRegister}
                disabled={isLoading}
                style={{ marginBottom: '1rem' }}
              >
                Créer mon compte
              </IonButton>

              {/* Divider */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                margin: '1.5rem 0',
                color: '#666'
              }}>
                <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
                <span style={{ margin: '0 1rem', fontSize: '0.9rem' }}>ou</span>
                <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
              </div>

              {/* Google Register Button */}
              <IonButton
                expand="block"
                size="large"
                fill="outline"
                onClick={handleGoogleRegister}
                disabled={isLoading}
                style={{ marginBottom: '1rem' }}
              >
                <IonIcon icon={logoGoogle} slot="start" />
                S'inscrire avec Google
              </IonButton>
            </IonCardContent>
          </IonCard>

          {/* Login Link */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <IonText>
              <p style={{ color: '#666', margin: '0' }}>
                Déjà un compte ?{' '}
                <span 
                  style={{ 
                    color: '#273469', 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                  onClick={() => history.push('/login')}
                >
                  Se connecter
                </span>
              </p>
            </IonText>
          </div>
        </div>

        <IonLoading isOpen={isLoading} message="Création du compte..." />
        
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color={toastColor}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;