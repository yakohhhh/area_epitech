import React from 'react';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenuToggle,
  IonNote,
  IonText,
  IonButton
} from '@ionic/react';
import {
  homeOutline,
  construct,
  flash,
  statsChart,
  person,
  settings,
  lockClosed
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../../state/useAuthStore';

interface NavItem {
  title: string;
  url: string;
  icon: string;
  requiresAuth: boolean;
}

const navItems: NavItem[] = [
  {
    title: 'Accueil',
    url: '/',
    icon: homeOutline,
    requiresAuth: false
  },
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: statsChart,
    requiresAuth: true
  },
  {
    title: 'Automatisations',
    url: '/automations',
    icon: flash,
    requiresAuth: true
  },
  {
    title: 'Intégrations',
    url: '/integrations',
    icon: construct,
    requiresAuth: true
  },
  {
    title: 'Profil',
    url: '/profile',
    icon: person,
    requiresAuth: true
  },
  {
    title: 'Paramètres',
    url: '/settings',
    icon: settings,
    requiresAuth: true
  },
  {
    title: 'Diagnostics',
    url: '/diagnostics',
    icon: construct,
    requiresAuth: true
  }
];

export const SideNavbar: React.FC = () => {
  const history = useHistory();
  const { token, user } = useAuthStore();

  const handleNavigation = (item: NavItem) => {
    if (item.requiresAuth && !token) {
      // Rediriger vers la page de connexion
      history.push('/auth');
    } else {
      history.push(item.url);
    }
  };

  return (
    <IonMenu contentId="main-content" type="overlay">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Navigation</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        {/* Status utilisateur */}
        {token && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#3880ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                <IonIcon icon={person} style={{ color: 'white', fontSize: '1.2rem' }} />
              </div>
              <div>
                <IonText>
                  <p style={{ margin: 0, fontWeight: 'bold', color: '#1e2749', fontSize: '0.9rem' }}>
                    Connecté
                  </p>
                  <p style={{ margin: 0, color: '#273469', fontSize: '0.8rem' }}>
                    {user?.email?.split('@')[0] || 'Utilisateur'}
                  </p>
                </IonText>
              </div>
            </div>
          </div>
        )}
        
        <IonList>
          {navItems.map((item, index) => (
            <IonMenuToggle key={index}>
              <IonItem 
                button 
                onClick={() => handleNavigation(item)}
                disabled={item.requiresAuth && !token}
                className={item.requiresAuth && !token ? 'item-disabled' : ''}
              >
                <IonIcon 
                  icon={item.requiresAuth && !token ? lockClosed : item.icon} 
                  slot="start"
                  color={item.requiresAuth && !token ? "medium" : "primary"}
                />
                <IonLabel color={item.requiresAuth && !token ? "medium" : undefined}>
                  {item.title}
                  {item.requiresAuth && !token && (
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>
                      Connexion requise
                    </p>
                  )}
                </IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>
        
        {!token && (
          <div style={{ 
            padding: '1rem', 
            marginTop: '2rem',
            backgroundColor: '#fff3cd',
            borderRadius: '0.5rem',
            margin: '1rem',
            border: '1px solid #ffeaa7'
          }}>
            <IonText>
              <p style={{ 
                margin: 0, 
                fontSize: '0.9rem', 
                lineHeight: '1.4',
                color: '#856404',
                textAlign: 'center'
              }}>
                <IonIcon icon={lockClosed} style={{ marginRight: '0.5rem' }} />
                Connectez-vous pour débloquer toutes les fonctionnalités
              </p>
            </IonText>
            <IonMenuToggle>
              <IonButton 
                expand="block" 
                size="small" 
                style={{ marginTop: '1rem' }}
                onClick={() => history.push('/auth')}
              >
                <IonIcon icon={person} slot="start" />
                Se connecter
              </IonButton>
            </IonMenuToggle>
          </div>
        )}
      </IonContent>
    </IonMenu>
  );
};