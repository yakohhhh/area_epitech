import React from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonText,
  IonCard,
  IonCardContent,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonList
} from '@ionic/react';
import {
  arrowForward,
  flash,
  construct,
  statsChart,
  settings,
  checkmarkCircle,
  lockClosed,
  logIn
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../../state/useAuthStore';
import { TopBar } from '../ui/TopBar';
import { SideNavbar } from '../ui/SideNavbar';

export const UnconnectedHomepage: React.FC = () => {
  const history = useHistory();
  const { token } = useAuthStore();

  const services = [
    {
      icon: construct,
      title: 'Intégrations API',
      desc: 'Connectez facilement vos services préférés grâce à nos intégrations API.',
      available: false
    },
    {
      icon: flash,
      title: 'Automatisations',
      desc: 'Créez des flux de travail personnalisés qui s\'exécutent automatiquement.',
      available: false
    },
    {
      icon: statsChart,
      title: 'Dashboard',
      desc: 'Surveillez et gérez toutes vos automatisations depuis un tableau de bord.',
      available: false
    },
    {
      icon: settings,
      title: 'Paramètres',
      desc: 'Personnalisez votre expérience et gérez vos préférences.',
      available: false
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Créez votre compte',
      desc: 'Inscrivez-vous gratuitement en quelques clics.'
    },
    {
      num: '02',
      title: 'Choisissez vos services',
      desc: 'Sélectionnez parmi les services disponibles.'
    },
    {
      num: '03',
      title: 'Configurez vos automatisations',
      desc: 'Définissez vos déclencheurs et actions.'
    },
    {
      num: '04',
      title: 'Profitez !',
      desc: 'Laissez la plateforme travailler pour vous.'
    }
  ];

  const handleServiceClick = (serviceTitle: string) => {
    if (!token) {
      // Rediriger vers la page de connexion avec un message
      history.push('/auth');
    }
  };

  return (
    <>
      <SideNavbar />
      <IonPage id="main-content">
        <TopBar />
        
        <IonContent>
          {/* Hero Section */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(39,52,105,.95) 0%, rgba(30,39,73,.9) 30%, rgba(48,52,63,.85) 70%, rgba(39,52,105,.8) 100%)',
            minHeight: '50vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center',
            padding: '2rem 1rem'
          }}>
            <div>
              <IonText>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Connectez Vos <span style={{ color: '#e4d9ff' }}>Services</span>
                </h1>
                <p style={{ 
                  fontSize: '1.2rem', 
                  marginBottom: '2rem', 
                  opacity: 1, 
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)', 
                  lineHeight: '1.6' 
                }}>
                  Créez des automatisations puissantes entre tous vos services préférés sans écrire une ligne de code.
                </p>
              </IonText>
              
              {!token && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
                  <IonButton 
                    expand="block" 
                    size="large" 
                    color="light"
                    onClick={() => history.push('/auth')}
                  >
                    <IonIcon icon={logIn} slot="start" />
                    Commencer Gratuitement
                    <IonIcon icon={arrowForward} slot="end" />
                  </IonButton>
                  <IonButton 
                    expand="block" 
                    size="large" 
                    fill="outline" 
                    color="light"
                    onClick={() => history.push('/demo')}
                  >
                    Voir une Démo
                  </IonButton>
                </div>
              )}
              
              {token && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
                  <IonButton 
                    expand="block" 
                    size="large" 
                    color="light"
                    onClick={() => history.push('/dashboard')}
                  >
                    <IonIcon icon={statsChart} slot="start" />
                    Accéder au Dashboard
                    <IonIcon icon={arrowForward} slot="end" />
                  </IonButton>
                </div>
              )}
            </div>
          </div>

          {/* Status Banner */}
          {!token && (
            <div style={{
              background: '#fff3cd',
              borderLeft: '4px solid #ffc107',
              padding: '1rem',
              margin: '1rem',
              borderRadius: '0.5rem'
            }}>
              <IonText>
                <p style={{ margin: 0, color: '#856404', fontWeight: '500' }}>
                  <IonIcon icon={lockClosed} style={{ marginRight: '0.5rem' }} />
                  Vous naviguez en mode invité. Connectez-vous pour accéder à toutes les fonctionnalités.
                </p>
              </IonText>
            </div>
          )}

          {/* Services Section */}
          <div style={{ padding: '3rem 1rem', background: '#f8fafc' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <IonText>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e2749', marginBottom: '0.5rem' }}>
                  Fonctionnalités disponibles
                </h2>
                <p style={{ fontSize: '1.1rem', color: '#1e2749', opacity: 0.95, fontWeight: '500' }}>
                  {token ? 'Explorez toutes les fonctionnalités' : 'Connectez-vous pour débloquer ces fonctionnalités'}
                </p>
              </IonText>
            </div>
            
            <IonGrid>
              <IonRow>
                {services.map((service, index) => (
                  <IonCol size="12" sizeMd="6" key={index}>
                    <IonCard 
                      style={{ 
                        margin: 0,
                        opacity: !token ? 0.6 : 1,
                        cursor: !token ? 'not-allowed' : 'pointer'
                      }}
                      onClick={() => handleServiceClick(service.title)}
                    >
                      <IonCardContent style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                        <div style={{ marginBottom: '1rem', position: 'relative' }}>
                          <IonIcon 
                            icon={service.icon} 
                            style={{ 
                              fontSize: '3rem', 
                              color: !token ? '#ccc' : '#273469'
                            }}
                          />
                          {!token && (
                            <IonIcon 
                              icon={lockClosed} 
                              style={{ 
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                fontSize: '1.5rem',
                                color: '#ffc107',
                                background: 'white',
                                borderRadius: '50%',
                                padding: '2px'
                              }}
                            />
                          )}
                        </div>
                        <IonText>
                          <h3 style={{ 
                            fontSize: '1.25rem', 
                            fontWeight: 'bold', 
                            marginBottom: '0.5rem', 
                            color: !token ? '#ccc' : '#1e2749'
                          }}>
                            {service.title}
                          </h3>
                          <p style={{ 
                            fontSize: '0.95rem', 
                            lineHeight: '1.5', 
                            color: !token ? '#ccc' : '#273469', 
                            opacity: 0.9, 
                            fontWeight: '500' 
                          }}>
                            {service.desc}
                          </p>
                        </IonText>
                        {!token && (
                          <IonText>
                            <p style={{ 
                              fontSize: '0.85rem', 
                              color: '#ffc107', 
                              fontWeight: 'bold',
                              marginTop: '1rem',
                              marginBottom: 0
                            }}>
                              Connexion requise
                            </p>
                          </IonText>
                        )}
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </div>

          {/* How it works */}
          <div style={{ padding: '3rem 1rem', background: '#ffffff' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <IonText>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e2749', marginBottom: '0.5rem' }}>
                  Comment ça marche ?
                </h2>
                <p style={{ fontSize: '1.1rem', color: '#1e2749', opacity: 0.95, fontWeight: '500' }}>
                  En quelques étapes seulement, créez des automatisations puissantes
                </p>
              </IonText>
            </div>

            <IonGrid>
              <IonRow>
                {steps.map((step, index) => (
                  <IonCol size="12" sizeMd="6" key={index}>
                    <IonCard style={{ margin: 0, position: 'relative' }}>
                      <IonCardContent style={{ padding: '2rem 1.5rem' }}>
                        <div style={{ 
                          position: 'absolute', 
                          top: '-10px', 
                          right: '20px', 
                          fontSize: '3rem', 
                          fontWeight: 'bold', 
                          color: '#e4d9ff',
                          opacity: 0.3
                        }}>
                          {step.num}
                        </div>
                        <IonText>
                          <h3 style={{ 
                            fontSize: '1.25rem', 
                            fontWeight: 'bold', 
                            marginBottom: '0.5rem', 
                            color: '#1e2749' 
                          }}>
                            {step.title}
                          </h3>
                          <p style={{ 
                            fontSize: '0.95rem', 
                            lineHeight: '1.5', 
                            color: '#273469', 
                            opacity: 0.9, 
                            fontWeight: '500' 
                          }}>
                            {step.desc}
                          </p>
                        </IonText>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </div>

          {/* Features List */}
          {!token && (
            <div style={{ padding: '2rem 1rem', background: '#f8fafc' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <IonText>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e2749' }}>
                    Pourquoi choisir AREA ?
                  </h2>
                </IonText>
              </div>
              
              <IonList>
                {[
                  'Interface intuitive et facile à utiliser',
                  'Nombreuses intégrations disponibles',
                  'Automatisations personnalisables',
                  'Tableau de bord complet',
                  'Support technique réactif'
                ].map((feature, index) => (
                  <IonItem key={index}>
                    <IonIcon icon={checkmarkCircle} color="success" slot="start" />
                    <IonLabel>{feature}</IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </div>
          )}

          {/* CTA Section */}
          <div style={{
            background: 'linear-gradient(135deg, #273469, #1e2749, #30343f)',
            color: 'white',
            textAlign: 'center',
            padding: '3rem 1rem'
          }}>
            <IonText>
              <h2 style={{ 
                fontSize: '2.2rem', 
                fontWeight: 'bold', 
                marginBottom: '1rem', 
                textShadow: '0 2px 4px rgba(0,0,0,0.3)' 
              }}>
                {token ? 'Prêt à créer vos automatisations ?' : 'Prêt à automatiser votre flux de travail ?'}
              </h2>
              <p style={{ 
                fontSize: '1.1rem', 
                opacity: 1, 
                marginBottom: '2rem', 
                textShadow: '0 1px 3px rgba(0,0,0,0.3)' 
              }}>
                {token 
                  ? 'Accédez à votre dashboard pour commencer.'
                  : 'Rejoignez les utilisateurs qui gagnent du temps quotidiennement.'
                }
              </p>
            </IonText>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
              {token ? (
                <IonButton 
                  expand="block" 
                  size="large" 
                  color="light"
                  onClick={() => history.push('/dashboard')}
                >
                  <IonIcon icon={statsChart} slot="start" />
                  Accéder au Dashboard
                </IonButton>
              ) : (
                <>
                  <IonButton 
                    expand="block" 
                    size="large" 
                    color="light"
                    onClick={() => history.push('/auth')}
                  >
                    <IonIcon icon={logIn} slot="start" />
                    Commencer Gratuitement
                  </IonButton>
                  <IonButton 
                    expand="block" 
                    size="large" 
                    fill="outline" 
                    color="light"
                  >
                    Contacter l'équipe
                  </IonButton>
                </>
              )}
            </div>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};