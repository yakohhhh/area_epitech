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
import { play, arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { TopBar } from '../components/ui/TopBar';
import { SideNavbar } from '../components/ui/SideNavbar';

const DemoPage: React.FC = () => {
  const history = useHistory();

  return (
    <>
      <SideNavbar />
      <IonPage id="main-content">
        <TopBar />
        
        <IonContent className="ion-padding">
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <IonIcon 
              icon={play} 
              style={{ fontSize: '4rem', color: '#273469', marginBottom: '1rem' }}
            />
            
            <IonText>
              <h1>Démonstration</h1>
              <p>Découvrez comment fonctionne notre plateforme.</p>
            </IonText>
            
            <IonCard>
              <IonCardContent style={{ textAlign: 'center', padding: '2rem' }}>
                <IonText>
                  <h2>Démo interactive</h2>
                  <p>
                    Bientôt disponible : une démonstration interactive qui vous montrera :
                  </p>
                  <ul style={{ textAlign: 'left', maxWidth: '300px', margin: '1rem auto' }}>
                    <li>Comment créer une automatisation</li>
                    <li>Comment connecter vos services</li>
                    <li>Comment surveiller vos workflows</li>
                    <li>Les possibilités d'intégration</li>
                    <li>L'interface utilisateur</li>
                  </ul>
                </IonText>
                
                <div style={{ marginTop: '2rem' }}>
                  <IonButton 
                    onClick={() => history.push('/auth')}
                    style={{ marginBottom: '1rem' }}
                  >
                    Essayer maintenant
                  </IonButton>
                  
                  <br />
                  
                  <IonButton 
                    onClick={() => history.goBack()}
                    fill="outline"
                  >
                    <IonIcon icon={arrowBack} slot="start" />
                    Retour
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default DemoPage;