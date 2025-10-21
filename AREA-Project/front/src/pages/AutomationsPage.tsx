import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PageWithSidebar } from '../components/Layout';
import { useDashboardStore } from '../features/ConnectedDashboard/store/dashboard.store';
import { getServiceById } from '../features/ConnectedDashboard/components/servicesCatalog';
import '../styles/automations.css';

const AutomationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { activeServices } = useDashboardStore();

  // Convertir les activeServices en format automations
  const automations = activeServices
    .filter(service => service.connected && service.selectedActionId)
    .map(service => {
      const serviceDef = getServiceById(service.serviceId);
      const actionDef = serviceDef?.actions.find(
        a => a.id === service.selectedActionId
      );

      return {
        id: service.uid,
        name: `${service.name} - ${actionDef?.label || 'Action'}`,
        description: actionDef?.description || serviceDef?.description || '',
        trigger: {
          service: service.name,
          action: 'Trigger configuré',
        },
        action: {
          service: service.name,
          action: actionDef?.label || 'Action inconnue',
        },
        status: service.connected ? 'active' : 'inactive',
        lastRun: '2 minutes ago',
        runCount: Math.floor(Math.random() * 100),
      };
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'paused':
        return '#f59e0b';
      case 'inactive':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'paused':
        return 'En pause';
      case 'inactive':
        return 'Inactif';
      default:
        return 'Inconnu';
    }
  };

  return (
    <PageWithSidebar>
      <div className="automations-container" style={{ paddingTop: '80px' }}>
        <div className="automations-header">
          <h1 className="automations-title">
            Automatisations de{' '}
            <span className="username-highlight">{user?.username}</span>
          </h1>
          <p className="automations-subtitle">
            Créez et gérez vos automatisations pour connecter vos services
          </p>
          <button
            className="btn btn-primary create-automation-btn"
            onClick={() => navigate('/connected-dashboard')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Créer une automatisation
          </button>
        </div>

        {/* Statistiques */}
        <div className="automations-stats">
          <div className="stat-card">
            <div className="stat-icon active">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-number">
                {automations.filter(a => a.status === 'active').length}
              </span>
              <span className="stat-label">Actives</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon paused">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6"
                />
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-number">
                {automations.filter(a => a.status === 'paused').length}
              </span>
              <span className="stat-label">En pause</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon total">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-number">
                {automations.reduce((sum, a) => sum + a.runCount, 0)}
              </span>
              <span className="stat-label">Exécutions totales</span>
            </div>
          </div>
        </div>

        {/* Liste des automatisations */}
        <div className="automations-list">
          {automations.map(automation => (
            <div key={automation.id} className="automation-card">
              <div className="automation-main">
                <div className="automation-info">
                  <div className="automation-header-row">
                    <h3 className="automation-name">{automation.name}</h3>
                    <div
                      className="automation-status-badge"
                      style={{
                        backgroundColor: getStatusColor(automation.status),
                      }}
                    >
                      {getStatusText(automation.status)}
                    </div>
                  </div>
                  <p className="automation-description">
                    {automation.description}
                  </p>
                </div>

                <div className="automation-flow">
                  <div className="flow-step trigger">
                    <div className="step-icon">🔥</div>
                    <div className="step-content">
                      <span className="step-service">
                        {automation.trigger.service}
                      </span>
                      <span className="step-action">
                        {automation.trigger.action}
                      </span>
                    </div>
                  </div>

                  <div className="flow-arrow">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>

                  <div className="flow-step action">
                    <div className="step-icon">⚡</div>
                    <div className="step-content">
                      <span className="step-service">
                        {automation.action.service}
                      </span>
                      <span className="step-action">
                        {automation.action.action}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="automation-footer">
                <div className="automation-stats">
                  <span className="stat-item">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Dernière exécution: {automation.lastRun}
                  </span>
                  <span className="stat-item">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    {automation.runCount} exécutions
                  </span>
                </div>

                <div className="automation-actions">
                  <button className="btn btn-secondary">Modifier</button>
                  {automation.status === 'active' ? (
                    <button className="btn btn-warning">Pause</button>
                  ) : automation.status === 'paused' ? (
                    <button className="btn btn-primary">Reprendre</button>
                  ) : (
                    <button className="btn btn-primary">Activer</button>
                  )}
                  <button className="btn btn-danger">Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {automations.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🤖</div>
            <h3>Aucune automatisation</h3>
            <p>
              Créez votre première automatisation pour commencer à connecter vos
              services.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/connected-dashboard')}
            >
              Créer ma première automatisation
            </button>
          </div>
        )}
      </div>
    </PageWithSidebar>
  );
};

export default AutomationsPage;
