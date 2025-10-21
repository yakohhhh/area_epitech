import React, { useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonText,
  IonButton,
  IonIcon,
  IonSpinner
} from '@ionic/react';
import { arrowForward, person } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../state/useAuthStore';

const LandingPage: React.FC = () => {
  const history = useHistory();
  const { token, loading } = useAuthStore();

  useEffect(() => {
    // Si l'utilisateur est connecté, rediriger vers le dashboard
    if (token) {
      history.replace('/dashboard');
    }
  }, [token, history]);

  const navigateToAuth = () => {
    history.push('/auth');
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}>
            <IonSpinner name="crescent" />
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
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          padding: '2rem'
        }}>
          <IonCard style={{ width: '100%', maxWidth: '400px' }}>
            <IonCardContent style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#3880ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem'
              }}>
                <IonIcon 
                  icon={person} 
                  style={{ 
                    fontSize: '50px',
                    color: 'white'
                  }} 
                />
              </div>
              
              <IonText>
                <h1 style={{ 
                  margin: '0 0 1rem', 
                  color: '#2c3e50',
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}>
                  AREA Mobile
                </h1>
              </IonText>
              
              <IonText color="medium">
                <p style={{ 
                  margin: '0 0 2rem', 
                  fontSize: '16px',
                  lineHeight: '1.5'
                }}>
                  Connectez-vous pour accéder à votre dashboard et gérer vos services.
                </p>
              </IonText>
              
              <IonButton
                expand="block"
                size="large"
                onClick={navigateToAuth}
                style={{ marginBottom: '1rem' }}
              >
                Se connecter / S'inscrire
                <IonIcon icon={arrowForward} slot="end" />
              </IonButton>
              
              <IonText color="medium" style={{ fontSize: '14px' }}>
                <p>Nouvelle version avec authentification unifiée</p>
              </IonText>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LandingPage;