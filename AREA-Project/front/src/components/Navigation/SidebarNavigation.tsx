import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SidebarNavigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Détecter le scroll pour la top bar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le sidebar avec Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);

  // Empêcher le scroll du body quand le sidebar est ouvert
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    path: string
  ) => {
    e.preventDefault();
    setIsSidebarOpen(false);
    navigate(path);
  };

  const closeSidebarOnly = () => {
    setIsSidebarOpen(false);
  };

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Top Bar */}
      <header className={`topbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="topbar-brand">
          <button
            onClick={e => handleAnchorClick(e, '/')}
            className="topbar-brand-text"
            style={{
              background: 'var(--gradient-primary)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              fontWeight: 'inherit',
              padding: 0,
              margin: 0,
            }}
          >
            AREA
          </button>
        </div>

        <button
          className={`sidebar-toggle ${isSidebarOpen ? 'active' : ''}`}
          onClick={toggleSidebar}
          aria-label="Toggle navigation menu"
          aria-expanded={isSidebarOpen}
        >
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </button>
      </header>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <nav className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">AREA Platform</h2>
          <p className="sidebar-subtitle">Automatisation & Intégration</p>
        </div>

        <div className="sidebar-nav">
          {/* Section Navigation principale */}
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Navigation</h3>

            <a
              href="/"
              className={`sidebar-link ${isActiveLink('/') ? 'active' : ''}`}
              onClick={e => handleAnchorClick(e, '/')}
            >
              <svg
                className="sidebar-link-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Accueil
            </a>

            {/* Onglets pour utilisateurs connectés uniquement */}
            {isAuthenticated && (
              <>
                <a
                  href="/dashboard"
                  className={`sidebar-link ${isActiveLink('/dashboard') ? 'active' : ''}`}
                  onClick={e => handleAnchorClick(e, '/dashboard')}
                >
                  <svg
                    className="sidebar-link-icon"
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
                  Dashboard
                </a>

                <a
                  href="/integrations"
                  className={`sidebar-link ${isActiveLink('/integrations') ? 'active' : ''}`}
                  onClick={e => handleAnchorClick(e, '/integrations')}
                >
                  <svg
                    className="sidebar-link-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  Intégrations
                </a>

                <a
                  href="/automations"
                  className={`sidebar-link ${isActiveLink('/automations') ? 'active' : ''}`}
                  onClick={e => handleAnchorClick(e, '/automations')}
                >
                  <svg
                    className="sidebar-link-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Automatisations
                </a>
              </>
            )}
          </div>

          {/* Section Support */}
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Support</h3>

            <a
              href="/about"
              className={`sidebar-link ${isActiveLink('/about') ? 'active' : ''}`}
              onClick={e => handleAnchorClick(e, '/about')}
            >
              <svg
                className="sidebar-link-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              About Us
            </a>

            <a
              href="/help"
              className={`sidebar-link ${isActiveLink('/help') ? 'active' : ''}`}
              onClick={e => handleAnchorClick(e, '/help')}
            >
              <svg
                className="sidebar-link-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Aide & FAQ
            </a>

            <a
              href="/contact"
              className={`sidebar-link ${isActiveLink('/contact') ? 'active' : ''}`}
              onClick={e => handleAnchorClick(e, '/contact')}
            >
              <svg
                className="sidebar-link-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contact
            </a>

            <a
              href="/docs"
              className={`sidebar-link ${isActiveLink('/docs') ? 'active' : ''}`}
              onClick={e => handleAnchorClick(e, '/docs')}
            >
              <svg
                className="sidebar-link-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Documentation
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="sidebar-actions">
          {isAuthenticated ? (
            <>
              {/* Section utilisateur connecté */}
              <div className="user-profile-section">
                <div className="user-info">
                  <div className="user-avatar">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" />
                    ) : (
                      <span className="avatar-initials">
                        {user?.username?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="user-details">
                    <span className="username">{user?.username}</span>
                    <span className="user-email">{user?.email}</span>
                  </div>
                </div>

                <a
                  href="/profile"
                  className="sidebar-btn"
                  onClick={e => handleAnchorClick(e, '/profile')}
                >
                  <svg
                    style={{
                      width: '16px',
                      height: '16px',
                      marginRight: '8px',
                      display: 'inline',
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Mon Profil
                </a>

                <button
                  className="sidebar-btn sidebar-btn-secondary"
                  onClick={() => {
                    logout();
                    closeSidebarOnly();
                    window.location.href = '/';
                  }}
                >
                  <svg
                    style={{
                      width: '16px',
                      height: '16px',
                      marginRight: '8px',
                      display: 'inline',
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Se déconnecter
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Section utilisateur non connecté */}
              <a
                href="/login"
                className="sidebar-btn sidebar-btn-primary"
                onClick={e => handleAnchorClick(e, '/login')}
              >
                <svg
                  style={{
                    width: '16px',
                    height: '16px',
                    marginRight: '8px',
                    display: 'inline',
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Se connecter
              </a>

              <a
                href="/register"
                className="sidebar-btn sidebar-btn-secondary"
                onClick={e => handleAnchorClick(e, '/register')}
              >
                <svg
                  style={{
                    width: '16px',
                    height: '16px',
                    marginRight: '8px',
                    display: 'inline',
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                S&apos;inscrire
              </a>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default SidebarNavigation;
