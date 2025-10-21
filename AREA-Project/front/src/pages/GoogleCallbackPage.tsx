import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');
        const isNewUser = searchParams.get('isNewUser') === 'true';
        const error = searchParams.get('error');

        if (error) {
          console.error("Erreur d'authentification Google:", error);
          navigate(`/login?error=${encodeURIComponent(error)}`);
          return;
        }

        if (!token || !userParam) {
          console.error('Paramètres manquants dans le callback Google');
          navigate(
            '/login?error=' +
              encodeURIComponent(
                "Erreur lors de l'authentification avec Google"
              )
          );
          return;
        }

        // Parser les informations utilisateur
        let user;
        try {
          user = JSON.parse(decodeURIComponent(userParam));
        } catch (e) {
          console.error('Erreur lors du parsing des données utilisateur:', e);
          navigate(
            '/login?error=' +
              encodeURIComponent(
                'Erreur lors du traitement des données utilisateur'
              )
          );
          return;
        }

        const { id, email, username } = user;

        if (!email || !id) {
          console.error('Données utilisateur incomplètes');
          navigate(
            '/login?error=' +
              encodeURIComponent('Données utilisateur incomplètes')
          );
          return;
        }

        // Stocker le token et les informations utilisateur
        localStorage.setItem('token', token);
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: parseInt(id),
            email,
            username: username || null,
          })
        );

        login(
          {
            id: parseInt(id),
            email,
            username: username || null,
            access_token: token,
          },
          token
        );

        if (isNewUser) {
          navigate('/connected-dashboard?welcome=true&registered=google');
        } else {
          navigate('/connected-dashboard');
        }
      } catch (error) {
        console.error('Erreur lors du traitement du callback Google:', error);
        navigate('/login?error=auth_failed');
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          color: 'white',
        }}
      >
        <div
          style={{
            width: '50px',
            height: '50px',
            border: '3px solid white',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px',
          }}
        />
        <h2>Connexion avec Google...</h2>
        <p>Veuillez patienter</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
