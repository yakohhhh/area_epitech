import React from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonText,
  IonButton,
  IonIcon
} from '@ionic/react';
import { person, arrowBack, settings } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { TopBar } from '../components/ui/TopBar';
import { SideNavbar } from '../components/ui/SideNavbar';
import { useAuthStore } from '../state/useAuthStore';

const ProfilePage: React.FC = () => {
  const history = useHistory();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    history.replace('/');
  };

  return (
    <>
      <SideNavbar />
      <IonPage id="main-content">
        <TopBar />
        
        <IonContent className="ion-padding">
          <div style={{ padding: '1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#3880ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <IonIcon 
                  icon={person} 
                  style={{ fontSize: '3rem', color: 'white' }}
                />
              </div>
              
              <IonText>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e2749' }}>
                  Mon Profil
                </h1>
                <p style={{ color: '#273469', fontSize: '1.1rem' }}>
                  {user?.email || 'Utilisateur'}
                </p>
              </IonText>
            </div>

            {/* Informations du compte */}
            <IonCard>
              <IonCardContent style={{ padding: '1.5rem' }}>
                <IonText>
                  <h2 style={{ marginBottom: '1rem', color: '#1e2749', fontSize: '1.3rem' }}>
                    Informations du compte
                  </h2>
                </IonText>
                
                <div style={{ marginBottom: '1rem' }}>
                  <IonText>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#1e2749' }}>
                      Email
                    </p>
                    <p style={{ margin: 0, color: '#273469' }}>
                      {user?.email || 'Non défini'}
                    </p>
                  </IonText>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <IonText>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#1e2749' }}>
                      ID Utilisateur
                    </p>
                    <p style={{ margin: 0, color: '#273469', fontSize: '0.9rem' }}>
                      {user?.id || 'Non défini'}
                    </p>
                  </IonText>
                </div>
                
                <IonButton expand="block" fill="outline" style={{ marginTop: '1rem' }}>
                  Modifier les informations
                </IonButton>
              </IonCardContent>
            </IonCard>

            {/* Préférences */}
            <IonCard>
              <IonCardContent style={{ padding: '1.5rem' }}>
                <IonText>
                  <h2 style={{ marginBottom: '1rem', color: '#1e2749', fontSize: '1.3rem' }}>
                    Préférences
                  </h2>
                </IonText>
                
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <IonButton expand="block" fill="outline" onClick={() => history.push('/settings')}>
                    <IonIcon icon={settings} slot="start" />
                    Paramètres
                  </IonButton>
                  
                  <IonButton expand="block" fill="outline">
                    Notifications
                  </IonButton>
                  
                  <IonButton expand="block" fill="outline">
                    Confidentialité
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Actions du compte */}
            <IonCard>
              <IonCardContent style={{ padding: '1.5rem' }}>
                <IonText>
                  <h2 style={{ marginBottom: '1rem', color: '#1e2749', fontSize: '1.3rem' }}>
                    Gestion du compte
                  </h2>
                </IonText>
                
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <IonButton expand="block" fill="outline">
                    Changer le mot de passe
                  </IonButton>
                  
                  <IonButton expand="block" fill="outline">
                    Historique d'activité
                  </IonButton>
                  
                  <IonButton 
                    expand="block" 
                    color="danger" 
                    fill="outline"
                    onClick={handleLogout}
                  >
                    <IonIcon icon={arrowBack} slot="start" />
                    Se déconnecter
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Zone dangereuse */}
            <IonCard style={{ borderColor: '#dc3545' }}>
              <IonCardContent style={{ padding: '1.5rem' }}>
                <IonText>
                  <h2 style={{ marginBottom: '1rem', color: '#dc3545', fontSize: '1.3rem' }}>
                    Zone dangereuse
                  </h2>
                  <p style={{ marginBottom: '1rem', color: '#273469' }}>
                    Cette action est irréversible et supprimera définitivement votre compte.
                  </p>
                </IonText>
                
                <IonButton 
                  expand="block" 
                  color="danger"
                >
                  Supprimer le compte
                </IonButton>
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default ProfilePage;