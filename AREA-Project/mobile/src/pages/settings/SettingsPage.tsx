import React from 'react';
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonText,
  IonToggle,
  IonIcon,
  IonButton
} from '@ionic/react';
import { settings, notifications, lockClosed, moon, language, arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { TopBar } from '../../components/ui/TopBar';
import { SideNavbar } from '../../components/ui/SideNavbar';

export const SettingsPage: React.FC = () => {
  const history = useHistory();

  return (
    <>
      <SideNavbar />
      <IonPage id="main-content">
        <TopBar />
        
        <IonContent className="ion-padding">
          <div style={{ padding: '1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <IonIcon 
                icon={settings} 
                style={{ fontSize: '4rem', color: '#273469', marginBottom: '1rem' }}
              />
              
              <IonText>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e2749' }}>
                  Paramètres
                </h1>
                <p style={{ color: '#273469', fontSize: '1.1rem' }}>
                  Configurez votre expérience utilisateur
                </p>
              </IonText>
            </div>

            {/* Notifications */}
            <IonCard>
              <IonCardContent style={{ padding: '1.5rem' }}>
                <IonText>
                  <h2 style={{ marginBottom: '1rem', color: '#1e2749', fontSize: '1.3rem' }}>
                    <IonIcon icon={notifications} style={{ marginRight: '0.5rem' }} />
                    Notifications
                  </h2>
                </IonText>
                
                <IonList lines="none">
                  <IonItem>
                    <IonLabel>
                      <h3>Notifications push</h3>
                      <p>Recevoir des notifications sur mobile</p>
                    </IonLabel>
                    <IonToggle slot="end" checked />
                  </IonItem>
                  
                  <IonItem>
                    <IonLabel>
                      <h3>Notifications email</h3>
                      <p>Recevoir des emails pour les événements importants</p>
                    </IonLabel>
                    <IonToggle slot="end" checked />
                  </IonItem>
                  
                  <IonItem>
                    <IonLabel>
                      <h3>Rappels d'automatisations</h3>
                      <p>Notifications pour les échecs d'automatisations</p>
                    </IonLabel>
                    <IonToggle slot="end" checked />
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>

            {/* Sécurité */}
            <IonCard>
              <IonCardContent style={{ padding: '1.5rem' }}>
                <IonText>
                  <h2 style={{ marginBottom: '1rem', color: '#1e2749', fontSize: '1.3rem' }}>
                    <IonIcon icon={lockClosed} style={{ marginRight: '0.5rem' }} />
                    Sécurité
                  </h2>
                </IonText>
                
                <IonList lines="none">
                  <IonItem>
                    <IonLabel>
                      <h3>Authentification à deux facteurs</h3>
                      <p>Sécurisez votre compte avec 2FA</p>
                    </IonLabel>
                    <IonToggle slot="end" />
                  </IonItem>
                  
                  <IonItem>
                    <IonLabel>
                      <h3>Sessions actives</h3>
                      <p>Gérer vos connexions actives</p>
                    </IonLabel>
                    <IonButton fill="outline" size="small" slot="end">
                      Gérer
                    </IonButton>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>

            {/* Apparence */}
            <IonCard>
              <IonCardContent style={{ padding: '1.5rem' }}>
                <IonText>
                  <h2 style={{ marginBottom: '1rem', color: '#1e2749', fontSize: '1.3rem' }}>
                    <IonIcon icon={moon} style={{ marginRight: '0.5rem' }} />
                    Apparence
                  </h2>
                </IonText>
                
                <IonList lines="none">
                  <IonItem>
                    <IonLabel>
                      <h3>Mode sombre</h3>
                      <p>Interface en mode sombre</p>
                    </IonLabel>
                    <IonToggle slot="end" />
                  </IonItem>
                  
                  <IonItem>
                    <IonLabel>
                      <h3>Thème compact</h3>
                      <p>Interface plus dense</p>
                    </IonLabel>
                    <IonToggle slot="end" />
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>

            {/* Général */}
            <IonCard>
              <IonCardContent style={{ padding: '1.5rem' }}>
                <IonText>
                  <h2 style={{ marginBottom: '1rem', color: '#1e2749', fontSize: '1.3rem' }}>
                    <IonIcon icon={language} style={{ marginRight: '0.5rem' }} />
                    Général
                  </h2>
                </IonText>
                
                <IonList lines="none">
                  <IonItem>
                    <IonLabel>
                      <h3>Langue</h3>
                      <p>Français</p>
                    </IonLabel>
                    <IonButton fill="outline" size="small" slot="end">
                      Changer
                    </IonButton>
                  </IonItem>
                  
                  <IonItem>
                    <IonLabel>
                      <h3>Fuseau horaire</h3>
                      <p>Europe/Paris</p>
                    </IonLabel>
                    <IonButton fill="outline" size="small" slot="end">
                      Modifier
                    </IonButton>
                  </IonItem>
                  
                  <IonItem>
                    <IonLabel>
                      <h3>Version de l'application</h3>
                      <p>0.1.0</p>
                    </IonLabel>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>

            {/* Actions */}
            <div style={{ marginTop: '2rem' }}>
              <IonButton 
                expand="block" 
                fill="outline"
                onClick={() => history.push('/profile')}
                style={{ marginBottom: '1rem' }}
              >
                <IonIcon icon={arrowBack} slot="start" />
                Retour au profil
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};
