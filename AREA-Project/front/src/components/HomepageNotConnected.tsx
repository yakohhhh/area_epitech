import React, { useState, useEffect } from 'react';
import Navbar from './Navigation/Navbar';

// Interface pour les animations
interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fade' | 'slide-up' | 'slide-left' | 'slide-right';
  delay?: number;
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  className = '',
  variant = 'fade',
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [elementRef, setElementRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef) {
      observer.observe(elementRef);
    }

    return () => {
      if (elementRef) {
        observer.unobserve(elementRef);
      }
    };
  }, [elementRef, delay]);

  const getVariantStyles = () => {
    const baseStyles = `transition-all duration-700 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`;

    switch (variant) {
      case 'slide-up':
        return `${baseStyles} transform ${isVisible ? 'translate-y-0' : 'translate-y-8'}`;
      case 'slide-left':
        return `${baseStyles} transform ${isVisible ? 'translate-x-0' : 'translate-x-8'}`;
      case 'slide-right':
        return `${baseStyles} transform ${isVisible ? 'translate-x-0' : '-translate-x-8'}`;
      default:
        return baseStyles;
    }
  };

  return (
    <div ref={setElementRef} className={`${getVariantStyles()} ${className}`}>
      {children}
    </div>
  );
};

const HomepageNotConnected = () => {
  const [scrollY, setScrollY] = useState<number>(0);

  // Effet pour détecter le scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Section Hero
  const HeroSection = () => (
    <section className="hero-section" aria-labelledby="hero-title">
      <div
        className="hero-background"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
        aria-hidden="true"
      >
        <div className="hero-gradient"></div>
      </div>

      <div className="hero-content">
        <ScrollAnimation variant="slide-up" delay={0.2}>
          <h1 id="hero-title" className="hero-title">
            Connectez Vos <span className="hero-highlight">Services</span>
          </h1>
          <p className="hero-subtitle">
            Créez des automatisations puissantes entre tous vos services
            préférés sans écrire une ligne de code.
          </p>
        </ScrollAnimation>

        <ScrollAnimation variant="slide-up" delay={0.6}>
          <div className="hero-buttons">
            <button
              className="btn btn-primary"
              aria-describedby="cta-description"
            >
              Commencer Gratuitement
              <svg
                className="btn-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
            <span id="cta-description" className="sr-only">
              Inscription gratuite pour commencer à créer vos automatisations
            </span>
          </div>
        </ScrollAnimation>
      </div>

      {/* Vagues en bas */}
      <div className="hero-waves" aria-hidden="true">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="presentation"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
            fill="#FAFBFF"
          />
        </svg>
      </div>
    </section>
  );

  // Section Services
  const ServicesSection = () => {
    const services = [
      {
        icon: '🔗',
        title: 'Intégrations API',
        description:
          'Connectez facilement vos services préférés grâce à nos intégrations API pré-configurées.',
      },
      {
        icon: '⚡',
        title: 'Automatisations',
        description:
          "Créez des flux de travail personnalisés qui s'exécutent automatiquement quand vous le souhaitez.",
      },
      {
        icon: '📊',
        title: 'Workflows',
        description:
          'Combinez plusieurs services dans un flux de travail puissant et sans friction.',
      },
      {
        icon: '⚙️',
        title: 'Personnalisation',
        description:
          'Configurez chaque détail pour que vos automatisations répondent parfaitement à vos besoins.',
      },
    ];

    return (
      <section className="services-section" aria-labelledby="services-title">
        <div className="container">
          <ScrollAnimation variant="slide-up">
            <div className="section-header">
              <h2 id="services-title" className="section-title">
                Une plateforme, des possibilités infinies
              </h2>
              <p className="section-subtitle">
                Découvrez tout ce que vous pouvez accomplir avec notre
                plateforme d&apos;automatisation
              </p>
            </div>
          </ScrollAnimation>

          <div className="services-grid" role="list">
            {services.map((service, index) => (
              <ScrollAnimation
                key={index}
                variant="slide-up"
                delay={index * 0.1}
              >
                <div className="service-card" role="listitem">
                  <div className="service-icon" aria-hidden="true">
                    <span>{service.icon}</span>
                  </div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Section Comment ça marche
  const HowItWorksSection = () => {
    const steps = [
      {
        number: '01',
        title: 'Choisissez vos services',
        description:
          'Sélectionnez parmi plus de 100 services disponibles dans notre catalogue.',
      },
      {
        number: '02',
        title: 'Configurez vos déclencheurs',
        description:
          'Définissez quand et comment vos automatisations doivent se déclencher.',
      },
      {
        number: '03',
        title: 'Ajoutez vos actions',
        description:
          'Configurez ce qui doit se passer quand votre déclencheur est activé.',
      },
      {
        number: '04',
        title: "Profitez de l'automatisation",
        description:
          'Laissez notre plateforme gérer vos tâches répétitives automatiquement.',
      },
    ];

    return (
      <section
        className="how-it-works-section"
        aria-labelledby="how-it-works-title"
      >
        <div className="container">
          <ScrollAnimation variant="slide-up">
            <div className="section-header">
              <h2 id="how-it-works-title" className="section-title">
                Comment ça marche ?
              </h2>
              <p className="section-subtitle">
                En quelques clics seulement, créez des automatisations
                puissantes
              </p>
            </div>
          </ScrollAnimation>

          <ol className="steps-grid">
            {steps.map((step, index) => (
              <ScrollAnimation
                key={index}
                variant="slide-left"
                delay={index * 0.15}
              >
                <li className="step-card">
                  <div
                    className="step-number"
                    aria-label={`Étape ${step.number}`}
                  >
                    {step.number}
                  </div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </li>
              </ScrollAnimation>
            ))}
          </ol>
        </div>
      </section>
    );
  };

  // Section CTA
  const CallToActionSection = () => (
    <section className="cta-section" aria-labelledby="cta-title">
      <ScrollAnimation variant="slide-up">
        <div className="cta-content">
          <h2 id="cta-title" className="cta-title">
            Prêt à automatiser votre flux de travail ?
          </h2>
          <p className="cta-subtitle">
            Rejoignez des milliers d&apos;utilisateurs qui économisent du temps
            et augmentent leur productivité.
          </p>
          <div className="cta-buttons">
            <button
              className="btn btn-light"
              aria-describedby="cta-final-description"
            >
              Commencer Gratuitement
            </button>
            <button className="btn btn-outline">Contacter l&apos;équipe</button>
            <span id="cta-final-description" className="sr-only">
              Inscription gratuite sans engagement
            </span>
          </div>
        </div>
      </ScrollAnimation>
    </section>
  );

  return (
    <div className="homepage-container">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <CallToActionSection />
    </div>
  );
};

export default HomepageNotConnected;
