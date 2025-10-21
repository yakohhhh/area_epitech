import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonText,
  IonButton,
  IonIcon,
  IonLoading,
  IonToast,
  IonModal,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
  IonDatetime,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonList,
  IonSpinner
} from '@ionic/react';
import { 
  construct, 
  arrowBack, 
  checkmarkCircle, 
  play, 
  settings,
  calendar,
  mail,
  people,
  chatbubbles,
  logoGoogle
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { TopBar } from '../components/ui/TopBar';
import { SideNavbar } from '../components/ui/SideNavbar';
import { integrationsService, Integration, IntegrationAction } from '../services/integrations.service';

const IntegrationsPage: React.FC = () => {
  const history = useHistory();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [selectedAction, setSelectedAction] = useState<IntegrationAction | null>(null);
  const [testParams, setTestParams] = useState<Record<string, any>>({});
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const data = await integrationsService.getAvailableIntegrations();
      setIntegrations(data);
    } catch (error: any) {
      setToastMessage(error.message || 'Erreur lors du chargement des intégrations');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const getIntegrationIcon = (integrationId: string) => {
    switch (integrationId) {
      case 'google-calendar': return calendar;
      case 'google-contacts': return people;
      case 'email': return mail;
      case 'slack': return chatbubbles;
      case 'discord': return chatbubbles;
      default: return construct;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'success';
      case 'available': return 'warning';
      case 'coming-soon': return 'medium';
      default: return 'medium';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Connecté';
      case 'available': return 'Disponible';
      case 'coming-soon': return 'Bientôt disponible';
      default: return 'Inconnu';
    }
  };

  const handleTestAction = (integration: Integration, action: IntegrationAction) => {
    setSelectedIntegration(integration);
    setSelectedAction(action);
    setTestParams({});
    setTestResult(null);
    setIsTestModalOpen(true);
  };

  const executeTest = async () => {
    if (!selectedIntegration || !selectedAction) return;

    try {
      setIsTestLoading(true);
      const result = await integrationsService.testIntegration(
        selectedIntegration.id,
        selectedAction.id,
        testParams
      );
      setTestResult(result);
      setToastMessage('Test exécuté avec succès !');
      setToastColor('success');
      setShowToast(true);
    } catch (error: any) {
      setToastMessage(error.message || 'Erreur lors du test');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setIsTestLoading(false);
    }
  };

  const handleConnect = async (integration: Integration) => {
    if (integration.status === 'connected' || integration.status === 'coming-soon') {
      return;
    }

    try {
      setLoading(true);
      const authUrl = await integrationsService.connectIntegration(integration.id);
      // Ouvrir l'URL OAuth dans le navigateur
      window.open(authUrl, '_blank');
      setToastMessage('Redirection vers l\'authentification...');
      setToastColor('success');
      setShowToast(true);
    } catch (error: any) {
      setToastMessage(error.message || 'Erreur lors de la connexion');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <SideNavbar />
        <IonPage id="main-content">
          <TopBar />
          <IonContent className="ion-padding">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <IonSpinner name="crescent" />
            </div>
          </IonContent>
        </IonPage>
      </>
    );
  }

  return (
    <>
      <SideNavbar />
      <IonPage id="main-content">
        <TopBar />
        
        <IonContent className="ion-padding">
          <div style={{ padding: '1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <IonIcon 
                icon={construct} 
                style={{ fontSize: '4rem', color: '#273469', marginBottom: '1rem' }}
              />
              
              <IonText>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e2749' }}>
                  Intégrations
                </h1>
                <p style={{ color: '#273469', fontSize: '1.1rem' }}>
                  Connectez vos services préférés et créez des automatisations
                </p>
              </IonText>
            </div>

            {/* Actions rapides */}
            <div style={{ marginBottom: '2rem' }}>
              <IonText>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e2749' }}>
                  Actions rapides
                </h2>
              </IonText>
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                <IonButton 
                  expand="block" 
                  fill="outline"
                  onClick={loadIntegrations}
                >
                  <IonIcon icon={construct} slot="start" />
                  Actualiser
                </IonButton>
                <IonButton 
                  expand="block" 
                  fill="outline"
                  onClick={() => history.push('/automations')}
                >
                  <IonIcon icon={arrowBack} slot="start" />
                  Automatisations
                </IonButton>
              </div>
            </div>
            
            {/* Intégrations disponibles */}
            <div style={{ marginBottom: '2rem' }}>
              <IonText>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e2749' }}>
                  Services disponibles
                </h2>
              </IonText>
              
              <IonGrid>
                <IonRow>
                  {integrations.map((integration, index) => (
                    <IonCol size="12" sizeMd="6" key={index}>
                      <IonCard>
                        <IonCardContent style={{ padding: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                            <IonIcon 
                              icon={getIntegrationIcon(integration.id)} 
                              style={{ 
                                fontSize: '2.5rem', 
                                color: '#273469',
                                marginRight: '1rem'
                              }}
                            />
                            <div style={{ flex: 1 }}>
                              <IonText>
                                <h3 style={{ margin: 0, color: '#1e2749', fontSize: '1.2rem' }}>
                                  {integration.name}
                                </h3>
                                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                                  {integration.description}
                                </p>
                              </IonText>
                              <IonBadge color={getStatusColor(integration.status)} style={{ fontSize: '0.8rem' }}>
                                {getStatusText(integration.status)}
                              </IonBadge>
                            </div>
                          </div>
                          
                          <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: '1fr 1fr' }}>
                            <IonButton 
                              expand="block" 
                              fill={integration.status === 'connected' ? 'solid' : 'outline'}
                              disabled={integration.status === 'coming-soon'}
                              size="small"
                              onClick={() => handleConnect(integration)}
                            >
                              {integration.status === 'connected' ? 'Configuré' : 
                               integration.status === 'available' ? 'Connecter' : 'Bientôt'}
                            </IonButton>
                            
                            {integration.actions.length > 0 && (
                              <IonButton 
                                expand="block" 
                                fill="outline"
                                size="small"
                                disabled={integration.status !== 'connected'}
                                onClick={() => handleTestAction(integration, integration.actions[0])}
                              >
                                <IonIcon icon={play} slot="start" />
                                Tester
                              </IonButton>
                            )}
                          </div>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                  ))}
                </IonRow>
              </IonGrid>
            </div>
          </div>

          {/* Modal de test d'intégration */}
          <IonModal isOpen={isTestModalOpen} onDidDismiss={() => setIsTestModalOpen(false)}>
            <IonContent className="ion-padding">
              <div style={{ padding: '1rem' }}>
                <IonText>
                  <h2>Tester {selectedIntegration?.name}</h2>
                  <h3>{selectedAction?.name}</h3>
                  <p>{selectedAction?.description}</p>
                </IonText>

                {selectedAction?.params.map((param) => (
                  <IonItem key={param.id}>
                    <IonLabel position="stacked">
                      {param.name} {param.required && '*'}
                    </IonLabel>
                    {param.type === 'text' && (
                      <IonInput
                        value={testParams[param.id] || ''}
                        onIonInput={(e) => setTestParams(prev => ({
                          ...prev,
                          [param.id]: e.detail.value!
                        }))}
                        placeholder={`Entrez ${param.name.toLowerCase()}`}
                      />
                    )}
                    {param.type === 'email' && (
                      <IonInput
                        type="email"
                        value={testParams[param.id] || ''}
                        onIonInput={(e) => setTestParams(prev => ({
                          ...prev,
                          [param.id]: e.detail.value!
                        }))}
                        placeholder={`Entrez ${param.name.toLowerCase()}`}
                      />
                    )}
                    {param.type === 'datetime' && (
                      <IonDatetime
                        value={testParams[param.id] || ''}
                        onIonChange={(e) => setTestParams(prev => ({
                          ...prev,
                          [param.id]: e.detail.value
                        }))}
                      />
                    )}
                  </IonItem>
                ))}

                {testResult && (
                  <IonCard style={{ marginTop: '1rem' }}>
                    <IonCardContent>
                      <IonText>
                        <h4>Résultat du test :</h4>
                        <pre style={{ fontSize: '0.8rem', overflow: 'auto' }}>
                          {JSON.stringify(testResult, null, 2)}
                        </pre>
                      </IonText>
                    </IonCardContent>
                  </IonCard>
                )}

                <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                  <IonButton 
                    expand="block" 
                    fill="outline"
                    onClick={() => setIsTestModalOpen(false)}
                  >
                    Fermer
                  </IonButton>
                  <IonButton 
                    expand="block"
                    onClick={executeTest}
                    disabled={isTestLoading}
                  >
                    {isTestLoading ? <IonSpinner name="crescent" /> : 'Exécuter test'}
                  </IonButton>
                </div>
              </div>
            </IonContent>
          </IonModal>

          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={toastMessage}
            duration={3000}
            color={toastColor}
          />
        </IonContent>
      </IonPage>
    </>
  );
};

export default IntegrationsPage;