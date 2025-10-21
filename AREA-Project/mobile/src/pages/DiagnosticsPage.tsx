import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonText,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonSpinner,
  IonToast
} from '@ionic/react';
import { 
  checkmarkCircle, 
  closeCircle, 
  refresh, 
  bug, 
  construct,
  calendar,
  mail,
  people
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { TopBar } from '../components/ui/TopBar';
import { SideNavbar } from '../components/ui/SideNavbar';
import { api } from '../services/api';

interface TestResult {
  service: string;
  status: 'success' | 'error' | 'testing';
  message: string;
  details?: any;
}

const DiagnosticsPage: React.FC = () => {
  const history = useHistory();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const runDiagnostics = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    const tests = [
      {
        name: 'Backend Connection',
        endpoint: '/mobile/health',
        service: 'Backend'
      },
      {
        name: 'Google Calendar Auth',
        endpoint: '/google-auth/test-calendar',
        service: 'Google Calendar'
      },
      {
        name: 'Google Contacts Auth',
        endpoint: '/google-auth/test-contacts',
        service: 'Google Contacts'
      },
      {
        name: 'Email Service',
        endpoint: '/email/send',
        service: 'Email',
        method: 'POST',
        data: {
          to: 'test@example.com',
          subject: 'Test Email',
          body: 'This is a test email from AREA mobile app'
        }
      }
    ];

    for (const test of tests) {
      setTestResults(prev => [...prev, {
        service: test.service,
        status: 'testing',
        message: `Testing ${test.name}...`
      }]);

      try {
        let response;
        if (test.method === 'POST') {
          response = await api.post(test.endpoint, test.data);
        } else {
          response = await api.get(test.endpoint);
        }

        setTestResults(prev => prev.map(result => 
          result.service === test.service 
            ? {
                ...result,
                status: 'success',
                message: `${test.name}: OK`,
                details: response.data
              }
            : result
        ));
      } catch (error: any) {
        setTestResults(prev => prev.map(result => 
          result.service === test.service 
            ? {
                ...result,
                status: 'error',
                message: `${test.name}: ${error.response?.data?.message || error.message}`,
                details: error.response?.data
              }
            : result
        ));
      }

      // Attendre un peu entre les tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
    setToastMessage('Diagnostics completed');
    setShowToast(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return checkmarkCircle;
      case 'error': return closeCircle;
      case 'testing': return refresh;
      default: return bug;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'danger';
      case 'testing': return 'warning';
      default: return 'medium';
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'Google Calendar': return calendar;
      case 'Google Contacts': return people;
      case 'Email': return mail;
      default: return construct;
    }
  };

  return (
    <>
      <SideNavbar />
      <IonPage id="main-content">
        <TopBar />
        
        <IonContent className="ion-padding">
          <div style={{ padding: '1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <IonIcon 
                icon={bug} 
                style={{ fontSize: '4rem', color: '#273469', marginBottom: '1rem' }}
              />
              
              <IonText>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e2749' }}>
                  Diagnostics
                </h1>
                <p style={{ color: '#273469', fontSize: '1.1rem' }}>
                  Testez la connectivité avec le backend et les services
                </p>
              </IonText>
            </div>

            {/* Actions */}
            <div style={{ marginBottom: '2rem' }}>
              <IonButton 
                expand="block" 
                onClick={runDiagnostics}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                    <IonSpinner name="crescent" slot="start" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <IonIcon icon={refresh} slot="start" />
                    Run Diagnostics
                  </>
                )}
              </IonButton>
            </div>

            {/* Results */}
            {testResults.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <IonText>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e2749' }}>
                    Test Results
                  </h2>
                </IonText>
                
                <IonList>
                  {testResults.map((result, index) => (
                    <IonItem key={index}>
                      <IonIcon 
                        icon={getServiceIcon(result.service)} 
                        slot="start" 
                        color="primary"
                      />
                      <IonLabel>
                        <h3>{result.service}</h3>
                        <p>{result.message}</p>
                        {result.details && (
                          <p style={{ fontSize: '0.8rem', color: '#666' }}>
                            {JSON.stringify(result.details, null, 2).substring(0, 100)}...
                          </p>
                        )}
                      </IonLabel>
                      <IonBadge color={getStatusColor(result.status)} slot="end">
                        <IonIcon 
                          icon={result.status === 'testing' ? refresh : getStatusIcon(result.status)} 
                          style={{ 
                            marginRight: '0.25rem',
                            animation: result.status === 'testing' ? 'spin 1s linear infinite' : 'none'
                          }}
                        />
                        {result.status.toUpperCase()}
                      </IonBadge>
                    </IonItem>
                  ))}
                </IonList>
              </div>
            )}

            {/* Instructions */}
            <IonCard>
              <IonCardContent>
                <IonText>
                  <h3>Instructions de dépannage</h3>
                  <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                    <li><strong>Backend Connection:</strong> Vérifiez que le backend est démarré sur le bon port</li>
                    <li><strong>Google Calendar:</strong> Vérifiez les tokens OAuth et les scopes calendar</li>
                    <li><strong>Google Contacts:</strong> Vérifiez les tokens OAuth et les scopes contacts</li>
                    <li><strong>Email Service:</strong> Vérifiez la configuration SMTP/Gmail</li>
                  </ul>
                  <h4 style={{ marginTop: '1.5rem' }}>Solutions courantes:</h4>
                  <ul style={{ paddingLeft: '1.5rem' }}>
                    <li>Régénérer le refresh token Google avec tous les scopes</li>
                    <li>Vérifier les variables d'environnement dans .env</li>
                    <li>Redémarrer le backend après modification</li>
                  </ul>
                </IonText>
              </IonCardContent>
            </IonCard>
          </div>

          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={toastMessage}
            duration={2000}
            color="success"
          />
        </IonContent>
      </IonPage>
    </>
  );
};

export default DiagnosticsPage;