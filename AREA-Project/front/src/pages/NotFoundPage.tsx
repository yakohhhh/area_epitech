import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <h1 style={{ fontSize: '4rem', color: '#6366f1', margin: '0 0 1rem 0' }}>
        404
      </h1>
      <h2
        style={{ fontSize: '1.5rem', color: '#374151', margin: '0 0 1rem 0' }}
      >
        Page non trouvée
      </h2>
      <p style={{ color: '#6b7280', margin: '0 0 2rem 0' }}>
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Retour à l&apos;accueil
        </button>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '12px 24px',
            backgroundColor: 'transparent',
            color: '#6366f1',
            border: '2px solid #6366f1',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Retour
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
