import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import AuthPage from '../pages/auth/AuthPage';
import GoogleCallbackPage from '../pages/auth/GoogleCallbackPage';
import ApiTestPage from '../pages/ApiTestPage';
import LandingPage from '../pages/LandingPage';
import ProtectedDashboard from '../pages/dashboard/ProtectedDashboard';
import AutomationsPage from '../pages/AutomationsPage';
import IntegrationsPage from '../pages/IntegrationsPage';
import ProfilePage from '../pages/ProfilePage';
import DemoPage from '../pages/DemoPage';
import DiagnosticsPage from '../pages/DiagnosticsPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import ProtectedRoute from '../components/ProtectedRoute';
import { UnconnectedHomepage } from '../components/home/UnconnectedHomepage';
import { Switch } from 'react-router';

export const AppRoutes: React.FC = () => (
  <Switch>
    <Route path="/" render={() => <UnconnectedHomepage />} exact />
    <Route path="/landing" component={LandingPage} exact />
    <Route path="/auth" component={AuthPage} exact />
    <Route path="/auth/google/callback" component={GoogleCallbackPage} exact />
    <Route path="/api-test" component={ApiTestPage} exact />
    <Route path="/demo" render={() => <DemoPage />} exact />
    <ProtectedRoute path="/dashboard" exact>
      <ProtectedDashboard />
    </ProtectedRoute>
    <ProtectedRoute path="/automations" exact>
      <AutomationsPage />
    </ProtectedRoute>
    <ProtectedRoute path="/integrations" exact>
      <IntegrationsPage />
    </ProtectedRoute>
    <ProtectedRoute path="/profile" exact>
      <ProfilePage />
    </ProtectedRoute>
          <ProtectedRoute path="/settings" exact>
        <SettingsPage />
      </ProtectedRoute>
      <ProtectedRoute path="/diagnostics" exact>
        <DiagnosticsPage />
      </ProtectedRoute>
      <Redirect to="/" />
  </Switch>
);
