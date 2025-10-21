import SidebarNavigation from './Navigation/SidebarNavigation';
import { authService } from '../shared/services/auth';
import { useNavigate } from 'react-router-dom';

const HomepageWithSidebar = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
    } else {
      // Redirige vers le dashboard ou autre page si déjà connecté
      navigate('/connected-dashboard');
    }
  };

  return (
    <div className="app-container">
      <SidebarNavigation />

      {/* Contenu principal */}
      <main className="main-content">
        {/* Hero Section avec sidebar */}
        <section className="hero-section" style={{ paddingTop: '80px' }}>
          <div className="hero-background">
            <div className="hero-gradient"></div>
          </div>

          <div className="hero-content">
            <div className="container">
              <h1 className="hero-title">
                Connectez Vos <span className="hero-highlight">Services</span>
              </h1>
              <p className="hero-subtitle">
                Créez des automatisations puissantes entre tous vos services
                préférés sans écrire une ligne de code.
              </p>

              <div className="hero-buttons">
                <button className="btn btn-primary" onClick={handleStartClick}>
                  Commencer Gratuitement
                  <svg
                    className="btn-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
                <button className="btn btn-secondary">Voir une Démo</button>
              </div>
            </div>
          </div>
        </section>

        {/* Section Services */}
        <section className="services-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                Une plateforme, des possibilités infinies
              </h2>
              <p className="section-subtitle">
                Découvrez tout ce que vous pouvez accomplir avec notre
                plateforme d&apos;automatisation
              </p>
            </div>

            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">
                  <span>🔗</span>
                </div>
                <h3 className="service-title">Intégrations API</h3>
                <p className="service-description">
                  Connectez facilement vos services préférés grâce à nos
                  intégrations API pré-configurées.
                </p>
              </div>

              <div className="service-card">
                <div className="service-icon">
                  <span>⚡</span>
                </div>
                <h3 className="service-title">Automatisations</h3>
                <p className="service-description">
                  Créez des flux de travail personnalisés qui s&apos;exécutent
                  automatiquement quand vous le souhaitez.
                </p>
              </div>

              <div className="service-card">
                <div className="service-icon">
                  <span>📊</span>
                </div>
                <h3 className="service-title">Workflows</h3>
                <p className="service-description">
                  Combinez plusieurs services dans un flux de travail puissant
                  et sans friction.
                </p>
              </div>

              <div className="service-card">
                <div className="service-icon">
                  <span>⚙️</span>
                </div>
                <h3 className="service-title">Personnalisation</h3>
                <p className="service-description">
                  Configurez chaque détail pour que vos automatisations
                  répondent parfaitement à vos besoins.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Comment ça marche */}
        <section className="how-it-works-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Comment ça marche ?</h2>
              <p className="section-subtitle">
                En quelques clics seulement, créez des automatisations
                puissantes
              </p>
            </div>

            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">01</div>
                <h3 className="step-title">Choisissez vos services</h3>
                <p className="step-description">
                  Sélectionnez parmi plus de 100 services disponibles dans notre
                  catalogue.
                </p>
              </div>

              <div className="step-card">
                <div className="step-number">02</div>
                <h3 className="step-title">Configurez vos déclencheurs</h3>
                <p className="step-description">
                  Définissez quand et comment vos automatisations doivent se
                  déclencher.
                </p>
              </div>

              <div className="step-card">
                <div className="step-number">03</div>
                <h3 className="step-title">Ajoutez vos actions</h3>
                <p className="step-description">
                  Configurez ce qui doit se passer quand votre déclencheur est
                  activé.
                </p>
              </div>

              <div className="step-card">
                <div className="step-number">04</div>
                <h3 className="step-title">
                  Profitez de l&apos;automatisation
                </h3>
                <p className="step-description">
                  Laissez notre plateforme gérer vos tâches répétitives
                  automatiquement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section CTA */}
        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">
              Prêt à automatiser votre flux de travail ?
            </h2>
            <p className="cta-subtitle">
              Rejoignez des milliers d&apos;utilisateurs qui économisent du
              temps et augmentent leur productivité.
            </p>
            <div className="cta-buttons">
              <button className="btn btn-light">
                Commencer Gratuitement lele
              </button>
              <button className="btn btn-outline">
                Contacter l&apos;équipe
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomepageWithSidebar;
