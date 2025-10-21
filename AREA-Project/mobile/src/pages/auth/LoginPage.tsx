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
import { logoGoogle, mail, lockClosed, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../../state/useAuthStore';
import { apiService } from '../../services/api';

const LoginPage: React.FC = () => {
  const history = useHistory();
  const { login } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
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

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setToastMessage('Veuillez remplir tous les champs');
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.access_token) {
        await login(response.data.access_token, response.data.user);
        setToastMessage('Connexion réussie !');
        setToastColor('success');
        setShowToast(true);
        
        setTimeout(() => {
          history.replace('/dashboard');
        }, 1000);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Erreur de connexion';
      setToastMessage(message);
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Redirection vers l'authentification Google avec origine mobile
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      window.location.href = `${apiUrl}/auth/google?origin=mobile`;
    } catch (error: any) {
      console.error('Google login error:', error);
      setToastMessage('Erreur lors de la connexion Google');
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
          <IonTitle>Connexion</IonTitle>
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
                Connectez-vous à votre compte
              </p>
            </IonText>
          </div>

          {/* Login Form */}
          <IonCard style={{ width: '100%', maxWidth: '400px', margin: 0 }}>
            <IonCardContent style={{ padding: '2rem' }}>
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
              <IonItem style={{ marginBottom: '1.5rem' }}>
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

              {/* Login Button */}
              <IonButton
                expand="block"
                size="large"
                onClick={handleLogin}
                disabled={isLoading}
                style={{ marginBottom: '1rem' }}
              >
                Se connecter
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

              {/* Google Login Button */}
              <IonButton
                expand="block"
                size="large"
                fill="outline"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                style={{ marginBottom: '1rem' }}
              >
                <IonIcon icon={logoGoogle} slot="start" />
                Continuer avec Google
              </IonButton>
            </IonCardContent>
          </IonCard>

          {/* Register Link */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <IonText>
              <p style={{ color: '#666', margin: '0' }}>
                Pas encore de compte ?{' '}
                <span 
                  style={{ 
                    color: '#273469', 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                  onClick={() => history.push('/register')}
                >
                  Créer un compte
                </span>
              </p>
            </IonText>
          </div>
        </div>

        <IonLoading isOpen={isLoading} message="Connexion en cours..." />
        
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

export default LoginPage;
