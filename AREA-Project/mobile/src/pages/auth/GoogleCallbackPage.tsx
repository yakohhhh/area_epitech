import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonLoading,
  IonText,
  IonButton,
  IonIcon
} from '@ionic/react';
import { checkmark, close } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../state/useAuthStore';

const GoogleCallbackPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extraire le token et les infos utilisateur depuis l'URL ou localStorage
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        const userParam = urlParams.get('user');
        
        if (token && userParam) {
          const user = JSON.parse(decodeURIComponent(userParam));
          await login(token, user);
          
          setStatus('success');
          setMessage('Connexion Google réussie !');
          
          setTimeout(() => {
            history.replace('/dashboard');
          }, 2000);
        } else {
          // Vérifier si le token est dans localStorage (cas de redirection après OAuth)
          const storedToken = localStorage.getItem('google_auth_token');
          const storedUser = localStorage.getItem('google_auth_user');
          
          if (storedToken && storedUser) {
            const user = JSON.parse(storedUser);
            await login(storedToken, user);
            
            // Nettoyer le localStorage
            localStorage.removeItem('google_auth_token');
            localStorage.removeItem('google_auth_user');
            
            setStatus('success');
            setMessage('Connexion Google réussie !');
            
            setTimeout(() => {
              history.replace('/dashboard');
            }, 2000);
          } else {
            throw new Error('Token ou informations utilisateur manquants');
          }
        }
      } catch (error) {
        console.error('Google callback error:', error);
        setStatus('error');
        setMessage('Erreur lors de la connexion Google');
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [location, login, history]);

  const handleRetry = () => {
    history.replace('/login');
  };

  if (status === 'loading') {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center'
          }}>
            <IonLoading isOpen={isLoading} message="Finalisation de la connexion..." />
            <IonText>
              <h2>Connexion en cours...</h2>
              <p>Veuillez patienter pendant que nous finalisons votre connexion avec Google.</p>
            </IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <IonIcon 
            icon={status === 'success' ? checkmark : close}
            style={{ 
              fontSize: '4rem', 
              color: status === 'success' ? '#22c55e' : '#ef4444',
              marginBottom: '2rem'
            }}
          />
          
          <IonText>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold',
              color: status === 'success' ? '#22c55e' : '#ef4444',
              marginBottom: '1rem'
            }}>
              {status === 'success' ? 'Succès !' : 'Erreur'}
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#666',
              marginBottom: '2rem'
            }}>
              {message}
            </p>
          </IonText>

          {status === 'error' && (
            <IonButton 
              expand="block"
              size="large"
              onClick={handleRetry}
              style={{ maxWidth: '300px' }}
            >
              Retour à la connexion
            </IonButton>
          )}

          {status === 'success' && (
            <IonText>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Redirection automatique vers le dashboard...
              </p>
            </IonText>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default GoogleCallbackPage;