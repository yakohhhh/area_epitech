import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonMenuButton,
  IonPopover,
  IonContent,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react';
import { person, logIn, logOut, settings, chevronDown } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../../state/useAuthStore';

export const TopBar: React.FC = () => {
  const history = useHistory();
  const { token, user, logout } = useAuthStore();
  const [showPopover, setShowPopover] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    setShowPopover(false);
    history.replace('/');
  };

  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        
        <IonTitle>AREA</IonTitle>
        
        <IonButtons slot="end">
          {token ? (
            <>
              <IonButton 
                id="user-menu-trigger"
                onClick={() => setShowPopover(true)}
              >
                <IonIcon icon={person} slot="start" />
                <span style={{ marginLeft: '0.5rem', marginRight: '0.25rem' }}>
                  {user?.email?.split('@')[0] || 'Utilisateur'}
                </span>
                <IonIcon icon={chevronDown} size="small" />
              </IonButton>
              
              <IonPopover
                trigger="user-menu-trigger"
                isOpen={showPopover}
                onDidDismiss={() => setShowPopover(false)}
                side="bottom"
                alignment="end"
              >
                <IonContent>
                  <IonList>
                    <IonItem button onClick={() => {
                      setShowPopover(false);
                      history.push('/profile');
                    }}>
                      <IonIcon icon={person} slot="start" />
                      <IonLabel>Mon profil</IonLabel>
                    </IonItem>
                    
                    <IonItem button onClick={() => {
                      setShowPopover(false);
                      history.push('/settings');
                    }}>
                      <IonIcon icon={settings} slot="start" />
                      <IonLabel>Paramètres</IonLabel>
                    </IonItem>
                    
                    <IonItem button onClick={handleLogout} color="danger">
                      <IonIcon icon={logOut} slot="start" />
                      <IonLabel>Se déconnecter</IonLabel>
                    </IonItem>
                  </IonList>
                </IonContent>
              </IonPopover>
            </>
          ) : (
            <IonButton onClick={() => history.push('/auth')}>
              <IonIcon icon={logIn} slot="start" />
              Connexion
            </IonButton>
          )}
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};