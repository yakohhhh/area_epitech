import React from 'react';
import { useAuth } from '../../auth/hooks/useAuth';

export const DashboardHome: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-home">
      <header className="dashboard-header">
        <h1>Welcome to AREA Dashboard</h1>
        {user && <p>Hello, {user.name}!</p>}
      </header>

      <div className="dashboard-content">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Active Areas</h3>
            <p className="dashboard-stat">0</p>
          </div>

          <div className="dashboard-card">
            <h3>Total Actions</h3>
            <p className="dashboard-stat">0</p>
          </div>

          <div className="dashboard-card">
            <h3>Connected Services</h3>
            <p className="dashboard-stat">0</p>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Recent Activity</h2>
          <p>No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
};
