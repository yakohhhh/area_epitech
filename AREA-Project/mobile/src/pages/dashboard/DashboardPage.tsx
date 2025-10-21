import React from 'react';
import { IonPage, IonContent, IonText } from '@ionic/react';
import { AppHeader } from '../../components/ui/AppHeader';
import { useAuth } from '../../state/auth.context';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  return (
    <IonPage>
      <AppHeader title="Dashboard" showLogout />
      <IonContent className="ion-padding">
        <IonText>Bienvenue {user?.email || 'Utilisateur'} !</IonText>
      </IonContent>
    </IonPage>
  );
};
