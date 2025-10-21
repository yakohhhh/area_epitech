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
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonList,
  IonSpinner,
  IonFab,
  IonFabButton
} from '@ionic/react';
import { 
  flash, 
  arrowBack, 
  play, 
  pause, 
  add, 
  settings,
  checkmarkCircle,
  closeCircle,
  time,
  construct
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { TopBar } from '../components/ui/TopBar';
import { SideNavbar } from '../components/ui/SideNavbar';
import { automationsService, integrationsService, Automation, Integration } from '../services/integrations.service';

const AutomationsPage: React.FC = () => {
  const history = useHistory();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAutomation, setNewAutomation] = useState<Omit<Automation, 'id' | 'runCount' | 'lastRun'>>({
    name: '',
    description: '',
    trigger: { integrationId: '', actionId: '', params: {} },
    actions: [{ integrationId: '', actionId: '', params: {} }],
    status: 'active'
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
  const [runningAutomation, setRunningAutomation] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [automationsData, integrationsData] = await Promise.all([
        automationsService.getAutomations(),
        integrationsService.getAvailableIntegrations()
      ]);
      setAutomations(automationsData);
      setIntegrations(integrationsData);
    } catch (error: any) {
      setToastMessage(error.message || 'Erreur lors du chargement');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAutomation = async (automationId: string) => {
    try {
      setRunningAutomation(automationId);
      const result = await automationsService.runAutomation(automationId);
      setToastMessage(result.message);
      setToastColor('success');
      setShowToast(true);
      await loadData(); // Refresh data
    } catch (error: any) {
      setToastMessage(error.message || 'Erreur lors de l\'exécution');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setRunningAutomation(null);
    }
  };

  const handleCreateAutomation = async () => {
    try {
      if (!newAutomation.name || !newAutomation.trigger.integrationId) {
        setToastMessage('Veuillez remplir tous les champs obligatoires');
        setToastColor('danger');
        setShowToast(true);
        return;
      }

      await automationsService.createAutomation(newAutomation);
      setToastMessage('Automatisation créée avec succès !');
      setToastColor('success');
      setShowToast(true);
      setIsCreateModalOpen(false);
      setNewAutomation({
        name: '',
        description: '',
        trigger: { integrationId: '', actionId: '', params: {} },
        actions: [{ integrationId: '', actionId: '', params: {} }],
        status: 'active'
      });
      await loadData();
    } catch (error: any) {
      setToastMessage(error.message || 'Erreur lors de la création');
      setToastColor('danger');
      setShowToast(true);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'active' ? 'success' : 'medium';
  };

  const getIntegrationName = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    return integration?.name || integrationId;
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
                icon={flash} 
                style={{ fontSize: '4rem', color: '#273469', marginBottom: '1rem' }}
              />
              
              <IonText>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e2749' }}>
                  Automatisations
                </h1>
                <p style={{ color: '#273469', fontSize: '1.1rem' }}>
                  Créez et gérez vos flux de travail automatisés
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
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <IonIcon icon={add} slot="start" />
                  Créer
                </IonButton>
                <IonButton 
                  expand="block" 
                  fill="outline"
                  onClick={() => history.push('/integrations')}
                >
                  <IonIcon icon={construct} slot="start" />
                  Intégrations
                </IonButton>
              </div>
            </div>

            {/* Liste des automatisations */}
            <div style={{ marginBottom: '2rem' }}>
              <IonText>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e2749' }}>
                  Mes automatisations ({automations.length})
                </h2>
              </IonText>
              
              {automations.length === 0 ? (
                <IonCard>
                  <IonCardContent style={{ textAlign: 'center', padding: '3rem' }}>
                    <IonIcon icon={flash} style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }} />
                    <IonText>
                      <h3>Aucune automatisation</h3>
                      <p>Créez votre première automatisation pour commencer</p>
                    </IonText>
                    <IonButton onClick={() => setIsCreateModalOpen(true)}>
                      <IonIcon icon={add} slot="start" />
                      Créer une automatisation
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              ) : (
                <IonGrid>
                  <IonRow>
                    {automations.map((automation) => (
                      <IonCol size="12" sizeMd="6" key={automation.id}>
                        <IonCard>
                          <IonCardContent style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                              <div style={{ flex: 1 }}>
                                <IonText>
                                  <h3 style={{ margin: 0, color: '#1e2749', fontSize: '1.2rem' }}>
                                    {automation.name}
                                  </h3>
                                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                                    {automation.description}
                                  </p>
                                </IonText>
                              </div>
                              <IonBadge color={getStatusBadgeColor(automation.status)}>
                                {automation.status === 'active' ? 'Actif' : 'Inactif'}
                              </IonBadge>
                            </div>

                            <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#666' }}>
                              <div style={{ marginBottom: '0.5rem' }}>
                                <strong>Déclencheur:</strong> {getIntegrationName(automation.trigger.integrationId)}
                              </div>
                              <div style={{ marginBottom: '0.5rem' }}>
                                <strong>Actions:</strong> {automation.actions.map(a => getIntegrationName(a.integrationId)).join(', ')}
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span><strong>Exécutions:</strong> {automation.runCount}</span>
                                {automation.lastRun && (
                                  <span><strong>Dernière:</strong> {new Date(automation.lastRun).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                            
                            <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: '1fr 1fr' }}>
                              <IonButton 
                                expand="block" 
                                fill="outline"
                                size="small"
                                onClick={() => handleRunAutomation(automation.id)}
                                disabled={runningAutomation === automation.id}
                              >
                                {runningAutomation === automation.id ? (
                                  <IonSpinner name="crescent" />
                                ) : (
                                  <>
                                    <IonIcon icon={play} slot="start" />
                                    Exécuter
                                  </>
                                )}
                              </IonButton>
                              
                              <IonButton 
                                expand="block" 
                                fill="outline"
                                size="small"
                                disabled
                              >
                                <IonIcon icon={settings} slot="start" />
                                Modifier
                              </IonButton>
                            </div>
                          </IonCardContent>
                        </IonCard>
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
              )}
            </div>
          </div>

          {/* Modal de création d'automatisation */}
          <IonModal isOpen={isCreateModalOpen} onDidDismiss={() => setIsCreateModalOpen(false)}>
            <IonContent className="ion-padding">
              <div style={{ padding: '1rem' }}>
                <IonText>
                  <h2>Créer une automatisation</h2>
                  <p>Configurez votre flux de travail automatisé</p>
                </IonText>

                <IonItem>
                  <IonLabel position="stacked">Nom de l'automatisation *</IonLabel>
                  <IonInput
                    value={newAutomation.name}
                    onIonInput={(e) => setNewAutomation(prev => ({
                      ...prev,
                      name: e.detail.value!
                    }))}
                    placeholder="Ex: Email vers Calendrier"
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Description</IonLabel>
                  <IonTextarea
                    value={newAutomation.description}
                    onIonInput={(e) => setNewAutomation(prev => ({
                      ...prev,
                      description: e.detail.value!
                    }))}
                    placeholder="Décrivez ce que fait cette automatisation"
                    rows={3}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Service déclencheur *</IonLabel>
                  <IonSelect
                    value={newAutomation.trigger.integrationId}
                    onIonChange={(e) => setNewAutomation(prev => ({
                      ...prev,
                      trigger: { ...prev.trigger, integrationId: e.detail.value }
                    }))}
                    placeholder="Choisissez un service"
                  >
                    {integrations
                      .filter(i => i.status === 'connected')
                      .map(integration => (
                        <IonSelectOption key={integration.id} value={integration.id}>
                          {integration.name}
                        </IonSelectOption>
                      ))}
                  </IonSelect>
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Service d'action *</IonLabel>
                  <IonSelect
                    value={newAutomation.actions[0]?.integrationId}
                    onIonChange={(e) => setNewAutomation(prev => ({
                      ...prev,
                      actions: [{
                        integrationId: e.detail.value,
                        actionId: '',
                        params: {}
                      }]
                    }))}
                    placeholder="Choisissez un service"
                  >
                    {integrations
                      .filter(i => i.status === 'connected')
                      .map(integration => (
                        <IonSelectOption key={integration.id} value={integration.id}>
                          {integration.name}
                        </IonSelectOption>
                      ))}
                  </IonSelect>
                </IonItem>

                <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                  <IonButton 
                    expand="block" 
                    fill="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Annuler
                  </IonButton>
                  <IonButton 
                    expand="block"
                    onClick={handleCreateAutomation}
                  >
                    Créer
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

export default AutomationsPage;