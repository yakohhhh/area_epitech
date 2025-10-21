import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PageWithSidebar } from '../components/Layout';
import '../styles/dashboard.css';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <PageWithSidebar>
      <div className="dashboard-container" style={{ paddingTop: '80px' }}>
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Bienvenue,{' '}
            <span className="username-highlight">{user?.username}</span> !
          </h1>
          <p className="dashboard-subtitle">
            Gérez vos automatisations et surveillez vos intégrations depuis
            votre tableau de bord
          </p>
        </div>

        <div className="dashboard-grid">
          {/* Statistiques */}
          <div className="dashboard-card stats-card">
            <div className="card-header">
              <h3>Statistiques</h3>
              <svg
                className="card-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">12</span>
                <span className="stat-label">Automatisations actives</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">5</span>
                <span className="stat-label">Intégrations</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">248</span>
                <span className="stat-label">Actions effectuées</span>
              </div>
            </div>
          </div>

          {/* Automatisations récentes */}
          <div className="dashboard-card recent-automations">
            <div className="card-header">
              <h3>Automatisations récentes</h3>
              <svg
                className="card-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="automation-list">
              <div className="automation-item">
                <div className="automation-status active"></div>
                <div className="automation-info">
                  <h4>Email → Slack</h4>
                  <p>Nouveaux emails → Notification Slack</p>
                </div>
                <span className="automation-time">Il y a 2h</span>
              </div>
              <div className="automation-item">
                <div className="automation-status active"></div>
                <div className="automation-info">
                  <h4>GitHub → Discord</h4>
                  <p>Nouveaux commits → Message Discord</p>
                </div>
                <span className="automation-time">Il y a 5h</span>
              </div>
              <div className="automation-item">
                <div className="automation-status paused"></div>
                <div className="automation-info">
                  <h4>Twitter → RSS</h4>
                  <p>Nouveaux tweets → Flux RSS</p>
                </div>
                <span className="automation-time">Il y a 1j</span>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="dashboard-card quick-actions">
            <div className="card-header">
              <h3>Actions rapides</h3>
              <svg
                className="card-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                />
              </svg>
            </div>
            <div className="quick-actions-grid">
              <button
                className="quick-action-btn"
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
                Nouvelle automatisation
              </button>
              <button className="quick-action-btn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Ajouter une intégration
              </button>
              <button className="quick-action-btn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Voir les logs
              </button>
            </div>
          </div>

          {/* Activité récente */}
          <div className="dashboard-card activity-feed">
            <div className="card-header">
              <h3>Activité récente</h3>
              <svg
                className="card-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon success">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="activity-info">
                  <p>
                    Automatisation &quot;Email → Slack&quot; exécutée avec
                    succès
                  </p>
                  <span className="activity-time">Il y a 15 minutes</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon info">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="activity-info">
                  <p>Nouvelle intégration Discord configurée</p>
                  <span className="activity-time">Il y a 1 heure</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon warning">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div className="activity-info">
                  <p>Automatisation &quot;Twitter → RSS&quot; a échoué</p>
                  <span className="activity-time">Il y a 3 heures</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWithSidebar>
  );
};

export default DashboardPage;
