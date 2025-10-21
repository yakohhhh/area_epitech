import React from 'react';
import { IonPage, IonContent, IonButton, IonText, IonCard, IonCardContent, IonIcon } from '@ionic/react';
import { arrowForward, flash, construct, statsChart, settings } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

export const Homepage: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent fullscreen>
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
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 1, textShadow: '0 2px 4px rgba(0,0,0,0.3)', lineHeight: '1.6' }}>
                Créez des automatisations puissantes entre tous vos services préférés sans écrire une ligne de code.
              </p>
            </IonText>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
              <IonButton 
                expand="block" 
                size="large" 
                color="light"
                onClick={() => history.push('/login')}
              >
                Commencer Gratuitement
                <IonIcon icon={arrowForward} slot="end" />
              </IonButton>
              <IonButton 
                expand="block" 
                size="large" 
                fill="outline" 
                color="light"
              >
                Voir une Démo
              </IonButton>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div style={{ padding: '3rem 1rem', background: '#f8fafc' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <IonText>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e2749', marginBottom: '0.5rem' }}>
                Une plateforme, des possibilités infinies
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#1e2749', opacity: 0.95, fontWeight: '500' }}>
                Découvrez tout ce que vous pouvez accomplir avec notre plateforme d'automatisation
              </p>
            </IonText>
          </div>
          
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {[
              { icon: construct, title:'Intégrations API', desc:'Connectez facilement vos services préférés grâce à nos intégrations API.'},
              { icon: flash, title:'Automatisations', desc:'Créez des flux de travail personnalisés qui s\'exécutent automatiquement.'},
              { icon: statsChart, title:'Workflows', desc:'Combinez plusieurs services dans un flux puissant.'},
                            { icon: settings, title:'Personnalisation', desc:'Adaptez l\'interface et les fonctionnalités selon vos besoins.'},
            ].map(service => (
              <IonCard key={service.title} style={{ margin: 0 }}>
                <IonCardContent style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <IonIcon 
                      icon={service.icon} 
                      style={{ fontSize: '3rem', color: '#273469' }}
                    />
                  </div>
                  <IonText>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e2749' }}>
                      {service.title}
                    </h3>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#273469', opacity: 0.9, fontWeight: '500' }}>
                      {service.desc}
                    </p>
                  </IonText>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div style={{ padding: '3rem 1rem', background: '#ffffff' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <IonText>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e2749', marginBottom: '0.5rem' }}>
                Comment ça marche ?
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#1e2749', opacity: 0.95, fontWeight: '500' }}>
                En quelques clics seulement, créez des automatisations puissantes
              </p>
            </IonText>
          </div>

          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {[
              { num:'01', title:'Choisissez vos services', desc:'Sélectionnez parmi les services disponibles.'},
              { num:'02', title:'Configurez vos déclencheurs', desc:'Définissez quand ils doivent se déclencher.'},
              { num:'03', title:'Ajoutez vos actions', desc:'Définissez ce qui doit se produire.'},
              { num:'04', title:'Profitez', desc:'Laissez la plateforme exécuter vos tâches.'}
            ].map(step => (
              <IonCard key={step.num} style={{ margin: 0, position: 'relative' }}>
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
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e2749' }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#273469', opacity: 0.9, fontWeight: '500' }}>
                      {step.desc}
                    </p>
                  </IonText>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          background: 'linear-gradient(135deg, #273469, #1e2749, #30343f)',
          color: 'white',
          textAlign: 'center',
          padding: '3rem 1rem'
        }}>
          <IonText>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              Prêt à automatiser votre flux de travail ?
            </h2>
            <p style={{ fontSize: '1.1rem', opacity: 1, marginBottom: '2rem', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
              Rejoignez les utilisateurs qui gagnent du temps quotidiennement.
            </p>
          </IonText>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
            <IonButton 
              expand="block" 
              size="large" 
              color="light"
              onClick={() => history.push('/login')}
            >
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
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
