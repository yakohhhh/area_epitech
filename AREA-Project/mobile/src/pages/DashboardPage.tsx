import React, { useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonText,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonAvatar,
  IonItem,
  IonLabel,
  IonBadge
} from '@ionic/react';
import { logOut, person, settings, apps, mail, calendar, notifications } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../state/useAuthStore';

const DashboardPage: React.FC = () => {
  const history = useHistory();
  const { user, logout, token } = useAuthStore();

  // Rediriger vers auth si pas connecté
  useEffect(() => {
    if (!token) {
      history.replace('/auth');
    }
  }, [token, history]);

  const handleLogout = async () => {
    await logout();
    history.replace('/auth');
  };

  const handleNavigation = (path: string) => {
    history.push(path);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
          <IonButton 
            fill="clear" 
            slot="end" 
            onClick={handleLogout}
            color="danger"
          >
            <IonIcon icon={logOut} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <div style={{ padding: '1rem' }}>
          {/* Welcome Section */}
          <IonCard>
            <IonCardContent style={{ textAlign: 'center', padding: '2rem' }}>
              <IonAvatar style={{ 
                width: '80px', 
                height: '80px', 
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#3880ff'
              }}>
                <IonIcon 
                  icon={person} 
                  style={{ 
                    fontSize: '40px',
                    color: 'white'
                  }} 
                />
              </IonAvatar>
              
              <IonText>
                <h2 style={{ margin: '0 0 8px', color: '#2c3e50' }}>
                  Bienvenue, {user?.email ? user.email.split('@')[0] : 'Utilisateur'} !  
                </h2>
              </IonText>
              
              <IonText color="medium">
                <p style={{ margin: '0', fontSize: '14px' }}>
                  {user?.email || 'Email non disponible'}
                </p>
              </IonText>
              
              {user?.id && (
                <IonBadge color="success" style={{ marginTop: '8px' }}>
                  Connecté
                </IonBadge>
              )}
            </IonCardContent>
          </IonCard>

          {/* Quick Actions */}
          <IonCard>
            <IonCardContent>
              <IonText>
                <h3 style={{ margin: '0 0 16px', color: '#2c3e50' }}>Actions rapides</h3>
              </IonText>
              
              <IonGrid>
                <IonRow>
                  <IonCol size="6">
                    <IonButton 
                      expand="block" 
                      fill="outline"
                      onClick={() => handleNavigation('/settings')}
                    >
                      <IonIcon icon={settings} slot="start" />
                      Paramètres
                    </IonButton>
                  </IonCol>
                  <IonCol size="6">
                    <IonButton 
                      expand="block" 
                      fill="outline"
                      onClick={() => handleNavigation('/api-test')}
                    >
                      <IonIcon icon={apps} slot="start" />
                      API Test
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          {/* Services Section */}
          <IonCard>
            <IonCardContent>
              <IonText>
                <h3 style={{ margin: '0 0 16px', color: '#2c3e50' }}>Services disponibles</h3>
              </IonText>
              
              <IonItem button lines="none" style={{ marginBottom: '8px' }}>
                <IonIcon icon={mail} slot="start" color="primary" />
                <IonLabel>
                  <h3>Gmail</h3>
                  <p>Gestion des emails</p>
                </IonLabel>
                <IonBadge color="success">Actif</IonBadge>
              </IonItem>
              
              <IonItem button lines="none" style={{ marginBottom: '8px' }}>
                <IonIcon icon={calendar} slot="start" color="secondary" />
                <IonLabel>
                  <h3>Google Calendar</h3>
                  <p>Gestion des événements</p>
                </IonLabel>
                <IonBadge color="success">Actif</IonBadge>
              </IonItem>
              
              <IonItem button lines="none">
                <IonIcon icon={notifications} slot="start" color="tertiary" />
                <IonLabel>
                  <h3>Notifications</h3>
                  <p>Alertes et rappels</p>
                </IonLabel>
                <IonBadge color="warning">Bientôt</IonBadge>
              </IonItem>
            </IonCardContent>
          </IonCard>

          {/* Status Section */}
          <IonCard>
            <IonCardContent>
              <IonText>
                <h3 style={{ margin: '0 0 16px', color: '#2c3e50' }}>Statut</h3>
              </IonText>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IonText color="medium">API Backend</IonText>
                <IonBadge color="success">Connecté</IonBadge>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: '8px' 
              }}>
                <IonText color="medium">Session</IonText>
                <IonBadge color="primary">Active</IonBadge>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DashboardPage;