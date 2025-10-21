import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuthStore } from '../state/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  exact?: boolean;
  path: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  exact = false, 
  path 
}) => {
  const { token } = useAuthStore();
  const isAuthenticated = !!token;

  return (
    <Route
      exact={exact}
      path={path}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/auth',
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;