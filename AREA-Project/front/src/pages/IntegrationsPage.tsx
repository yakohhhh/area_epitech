import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PageWithSidebar } from '../components/Layout';
import '../styles/integrations.css';

const IntegrationsPage: React.FC = () => {
  const { user } = useAuth();

  const integrations = [
    {
      id: 1,
      name: 'Gmail',
      description: 'Recevez et envoyez des emails automatiquement',
      icon: '📧',
      status: 'connected',
      category: 'Google',
    },
    {
      id: 2,
      name: 'Google Calendar',
      description: 'Gérez vos événements et calendriers automatiquement',
      icon: '�',
      status: 'connected',
      category: 'Google',
    },
    {
      id: 3,
      name: 'Google Contacts',
      description: 'Synchronisez et gérez vos contacts Google',
      icon: '�',
      status: 'connected',
      category: 'Google',
    },
  ];

  const categories = ['Tous', 'Google'];
  const [selectedCategory, setSelectedCategory] = React.useState('Tous');

  const filteredIntegrations =
    selectedCategory === 'Tous'
      ? integrations
      : integrations.filter(
          integration => integration.category === selectedCategory
        );

  const connectedCount = integrations.filter(
    i => i.status === 'connected'
  ).length;

  return (
    <PageWithSidebar>
      <div className="integrations-container" style={{ paddingTop: '80px' }}>
        <div className="integrations-header">
          <h1 className="integrations-title">
            Intégrations de{' '}
            <span className="username-highlight">{user?.username}</span>
          </h1>
          <p className="integrations-subtitle">
            Connectez vos services préférés pour créer des automatisations
            puissantes
          </p>
          <div className="integrations-stats">
            <span className="stat-badge">
              {connectedCount} intégrations connectées
            </span>
            <span className="stat-badge">
              {integrations.length - connectedCount} disponibles
            </span>
          </div>
        </div>

        {/* Filtres par catégorie */}
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grille des intégrations */}
        <div className="integrations-grid">
          {filteredIntegrations.map(integration => (
            <div
              key={integration.id}
              className={`integration-card ${integration.status}`}
            >
              <div className="integration-header">
                <div className="integration-icon">{integration.icon}</div>
                <div className="integration-status">
                  {integration.status === 'connected' ? (
                    <span className="status-badge connected">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Connecté
                    </span>
                  ) : (
                    <span className="status-badge available">Disponible</span>
                  )}
                </div>
              </div>

              <div className="integration-content">
                <h3 className="integration-name">{integration.name}</h3>
                <p className="integration-description">
                  {integration.description}
                </p>
                <span className="integration-category">
                  {integration.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredIntegrations.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Aucune intégration trouvée</h3>
            <p>
              Essayez de changer de catégorie ou contactez-nous pour ajouter une
              nouvelle intégration.
            </p>
          </div>
        )}
      </div>
    </PageWithSidebar>
  );
};

export default IntegrationsPage;
