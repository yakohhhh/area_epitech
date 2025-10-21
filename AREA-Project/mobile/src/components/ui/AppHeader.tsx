import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton } from '@ionic/react';
import { useAuth } from '../../state/auth.context';

interface Props { title: string; showLogout?: boolean; }

export const AppHeader: React.FC<Props> = ({ title, showLogout }) => {
  const { logout } = useAuth();
  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>{title}</IonTitle>
        {showLogout && (
          <IonButtons slot="end">
            <IonButton onClick={logout}>Logout</IonButton>
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
};
