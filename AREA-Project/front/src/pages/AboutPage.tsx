import React, { useEffect, useState } from 'react';
import { PageWithSidebar } from '../components/Layout';
import '../styles/AboutPage.css';

const AboutPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const services = [
    {
      name: 'Gmail',
      icon: '✉️',
      description: 'Gérez vos emails automatiquement',
      color: '#EA4335',
    },
    {
      name: 'Google Calendar',
      icon: '📅',
      description: 'Synchronisez vos événements',
      color: '#4285F4',
    },
    {
      name: 'Google Contacts',
      icon: '👥',
      description: 'Organisez vos contacts',
      color: '#34A853',
    },
  ];

  const features = [
    {
      icon: '⚡',
      title: 'Rapide et efficace',
      description: 'Automatisez vos tâches en quelques clics',
    },
    {
      icon: '🔒',
      title: 'Sécurisé',
      description: 'Vos données sont protégées',
    },
    {
      icon: '🎯',
      title: 'Précis',
      description: 'Des automatisations qui fonctionnent',
    },
  ];

  const stats = [
    { value: '3', label: 'Services intégrés' },
    { value: '100%', label: 'Temps réel' },
    { value: '∞', label: 'Possibilités' },
  ];

  return (
    <PageWithSidebar>
      <div className={`about-page ${isVisible ? 'visible' : ''}`}>
        <section className="about-hero">
          <div className="hero-content fade-in">
            <h1 className="hero-title">
              Bienvenue sur <span className="gradient-text">AREA</span>
            </h1>
            <p className="hero-subtitle">
              La plateforme d&apos;automatisation qui connecte vos services
              préférés
            </p>
          </div>
          <div className="hero-gradient"></div>
        </section>

        <section className="about-stats slide-up">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </section>

        <section className="about-features">
          <h2 className="section-title fade-in">Pourquoi choisir AREA ?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card slide-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-services">
          <h2 className="section-title fade-in">Services disponibles</h2>
          <div className="services-grid">
            {services.map((service, index) => (
              <div
                key={index}
                className="service-card scale-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-name">{service.name}</h3>
                <p className="service-description">{service.description}</p>
                <div className="service-glow"></div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-team">
          <h2 className="section-title fade-in">Notre Mission</h2>
          <div className="mission-content slide-up">
            <p className="mission-text">
              AREA est née de la volonté de simplifier l&apos;automatisation
              des tâches quotidiennes. Notre objectif est de vous permettre de
              connecter vos services préférés en quelques clics, sans avoir
              besoin de connaissances techniques.
            </p>
            <div className="mission-highlights">
              <div className="highlight">
                <span className="highlight-icon">🚀</span>
                <span>Innovation constante</span>
              </div>
              <div className="highlight">
                <span className="highlight-icon">💡</span>
                <span>Simplicité d&apos;utilisation</span>
              </div>
              <div className="highlight">
                <span className="highlight-icon">🤝</span>
                <span>Support réactif</span>
              </div>
            </div>
          </div>
        </section>

        <section className="about-cta">
          <div className="cta-content fade-in">
            <h2 className="cta-title">Prêt à automatiser ?</h2>
            <p className="cta-text">
              Commencez dès maintenant à créer vos premières automatisations
            </p>
            <button
              className="cta-button"
              onClick={() => (window.location.href = '/connected-dashboard')}
            >
              Créer une automatisation
              <span className="button-arrow">→</span>
            </button>
          </div>
        </section>
      </div>
    </PageWithSidebar>
  );
};

export default AboutPage;
