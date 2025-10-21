import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/Auth';
import HomepageWithSidebar from './components/HomepageWithSidebar';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import IntegrationsPage from './pages/IntegrationsPage';
import AutomationsPage from './pages/AutomationsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ConnectedDashboard from './pages/ConnectedDasboard';
import GoogleCallbackPage from './pages/GoogleCallbackPage';

import './styles/globals.css';
import './styles/homepage.css';
import './styles/sidebar.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomepageWithSidebar />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/contact" element={<AboutPage />} />
          <Route path="/docs" element={<AboutPage />} />
          {/* Route de callback Google OAuth */}
          <Route
            path="/auth/google/callback"
            element={<GoogleCallbackPage />}
          />

          {/* Routes publiques (redirigent si déjà connecté) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/connected-dashboard"
            element={
              <ProtectedRoute>
                <ConnectedDashboard />
              </ProtectedRoute>
            }
          />

          {/* Routes protégées */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/integrations"
            element={
              <ProtectedRoute>
                <IntegrationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/automations"
            element={
              <ProtectedRoute>
                <AutomationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Route 404 - doit être en dernier */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
