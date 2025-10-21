import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonText,
  IonButton,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonBadge,
  IonSpinner
} from '@ionic/react';
import { checkmark, close, refresh, wifi, server } from 'ionicons/icons';
import { apiService } from '../services/api';

interface HealthStatus {
  status: string;
  timestamp: string;
  origin?: string;
  userAgent?: string;
  message: string;
  version: string;
}

interface CorsStatus {
  cors: string;
  origin?: string;
  allowedMethods: string[];
  message: string;
}

const ApiTestPage: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [corsStatus, setCorsStatus] = useState<CorsStatus | null>(null);
  const [authStatus, setAuthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const testApiHealth = async () => {
    setLoading(true);
    try {
      const response = await apiService.get('/mobile/health');
      setHealthStatus(response.data);
      setErrors(prev => ({ ...prev, health: '' }));
    } catch (error: any) {
      console.error('Health check failed:', error);
      setErrors(prev => ({ ...prev, health: error.message || 'Health check failed' }));
      setHealthStatus(null);
    }
  };

  const testCors = async () => {
    setLoading(true);
    try {
      const response = await apiService.get('/mobile/cors-test');
      setCorsStatus(response.data);
      setErrors(prev => ({ ...prev, cors: '' }));
    } catch (error: any) {
      console.error('CORS test failed:', error);
      setErrors(prev => ({ ...prev, cors: error.message || 'CORS test failed' }));
      setCorsStatus(null);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    try {
      // Test d'un endpoint sans auth d'abord
      const aboutResponse = await apiService.get('/about');
      setAuthStatus(aboutResponse.data);
      setErrors(prev => ({ ...prev, auth: '' }));
    } catch (error: any) {
      console.error('Auth test failed:', error);
      setErrors(prev => ({ ...prev, auth: error.message || 'Auth test failed' }));
      setAuthStatus(null);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setErrors({});
    await Promise.all([
      testApiHealth(),
      testCors(),
      testAuth()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const getStatusIcon = (status: boolean) => status ? checkmark : close;
  const getStatusColor = (status: boolean) => status ? 'success' : 'danger';

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" />
          </IonButtons>
          <IonTitle>Test API Mobile</IonTitle>
          <IonButton fill="clear" slot="end" onClick={runAllTests} disabled={loading}>
            <IonIcon icon={refresh} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <div style={{ padding: '1rem' }}>
          {/* Header Info */}
          <IonCard>
            <IonCardContent style={{ textAlign: 'center' }}>
              <IonIcon 
                icon={server} 
                style={{ fontSize: '3rem', color: '#273469', marginBottom: '1rem' }}
              />
              <IonText>
                <h2>Test de Connectivité API</h2>
                <p style={{ color: '#666' }}>
                  Vérification de la liaison mobile ↔ backend
                </p>
              </IonText>
              {loading && <IonSpinner name="crescent" />}
            </IonCardContent>
          </IonCard>

          {/* Health Check */}
          <IonCard>
            <IonCardContent>
              <IonItem>
                <IonIcon 
                  icon={getStatusIcon(!!healthStatus && !errors.health)} 
                  color={getStatusColor(!!healthStatus && !errors.health)}
                  slot="start"
                />
                <IonLabel>
                  <h3>Santé de l'API</h3>
                  <p>{healthStatus?.message || errors.health || 'Test en cours...'}</p>
                </IonLabel>
                <IonBadge 
                  color={getStatusColor(!!healthStatus && !errors.health)}
                  slot="end"
                >
                  {healthStatus ? 'OK' : errors.health ? 'FAIL' : '...'}
                </IonBadge>
              </IonItem>
              
              {healthStatus && (
                <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>
                  <div><strong>Version:</strong> {healthStatus.version}</div>
                  <div><strong>Timestamp:</strong> {new Date(healthStatus.timestamp).toLocaleString()}</div>
                  <div><strong>Origin:</strong> {healthStatus.origin || 'N/A'}</div>
                </div>
              )}
            </IonCardContent>
          </IonCard>

          {/* CORS Test */}
          <IonCard>
            <IonCardContent>
              <IonItem>
                <IonIcon 
                  icon={getStatusIcon(!!corsStatus && !errors.cors)} 
                  color={getStatusColor(!!corsStatus && !errors.cors)}
                  slot="start"
                />
                <IonLabel>
                  <h3>Configuration CORS</h3>
                  <p>{corsStatus?.message || errors.cors || 'Test en cours...'}</p>
                </IonLabel>
                <IonBadge 
                  color={getStatusColor(!!corsStatus && !errors.cors)}
                  slot="end"
                >
                  {corsStatus ? 'OK' : errors.cors ? 'FAIL' : '...'}
                </IonBadge>
              </IonItem>
              
              {corsStatus && (
                <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>
                  <div><strong>CORS:</strong> {corsStatus.cors}</div>
                  <div><strong>Origin:</strong> {corsStatus.origin || 'N/A'}</div>
                  <div><strong>Méthodes:</strong> {corsStatus.allowedMethods?.join(', ')}</div>
                </div>
              )}
            </IonCardContent>
          </IonCard>

          {/* Auth Test */}
          <IonCard>
            <IonCardContent>
              <IonItem>
                <IonIcon 
                  icon={getStatusIcon(!!authStatus && !errors.auth)} 
                  color={getStatusColor(!!authStatus && !errors.auth)}
                  slot="start"
                />
                <IonLabel>
                  <h3>Endpoints API</h3>
                  <p>{authStatus?.message || errors.auth || 'Test en cours...'}</p>
                </IonLabel>
                <IonBadge 
                  color={getStatusColor(!!authStatus && !errors.auth)}
                  slot="end"
                >
                  {authStatus ? 'OK' : errors.auth ? 'FAIL' : '...'}
                </IonBadge>
              </IonItem>
              
              {authStatus && (
                <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>
                  <div><strong>Services:</strong> {authStatus.services?.join(', ') || 'API disponible'}</div>
                  <div><strong>Version:</strong> {authStatus.version || '1.0.0'}</div>
                </div>
              )}
            </IonCardContent>
          </IonCard>

          {/* Actions */}
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <IonButton 
              expand="block" 
              fill="outline"
              onClick={testApiHealth}
              disabled={loading}
            >
              <IonIcon icon={wifi} slot="start" />
              Test Santé
            </IonButton>
            <IonButton 
              expand="block" 
              fill="outline"
              onClick={testCors}
              disabled={loading}
            >
              <IonIcon icon={server} slot="start" />
              Test CORS
            </IonButton>
          </div>

          {/* Status Summary */}
          <IonCard style={{ marginTop: '2rem' }}>
            <IonCardContent style={{ textAlign: 'center' }}>
              <IonText>
                <h3 style={{ 
                  color: (healthStatus && corsStatus && authStatus) ? '#22c55e' : '#ef4444'
                }}>
                  {(healthStatus && corsStatus && authStatus) 
                    ? '✅ Connectivité Mobile OK' 
                    : '❌ Problèmes de connectivité'
                  }
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  API Backend: {import.meta.env.VITE_API_URL || 'http://localhost:5001'}
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ApiTestPage;