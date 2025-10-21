import React, { useEffect, useState } from 'react';
import { PageWithSidebar } from '../components/Layout';
import '../styles/HelpPage.css';

const HelpPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('getting-started');

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const helpSections = [
    {
      id: 'getting-started',
      title: 'Démarrage rapide',
      icon: '🚀',
      content: [
        {
          question: 'Comment créer ma première automatisation ?',
          answer:
            "Rendez-vous dans le tableau de bord connecté, sélectionnez un service, choisissez une action et configurez les paramètres. C'est aussi simple que cela !",
        },
        {
          question: 'Quels sont les services disponibles ?',
          answer:
            "Actuellement, nous supportons Gmail, Google Calendar et Google Contacts. D'autres services seront ajoutés prochainement.",
        },
        {
          question: 'Comment me connecter à mes services ?',
          answer:
            "Utilisez l'authentification Google OAuth pour connecter vos services en toute sécurité. Vos données restent protégées.",
        },
      ],
    },
    {
      id: 'services',
      title: 'Services & Intégrations',
      icon: '🔗',
      content: [
        {
          question: 'Comment configurer Gmail ?',
          answer:
            'Dans le tableau de bord, sélectionnez Gmail, puis "Envoyer un mail". Remplissez les champs destinataire, objet et contenu. Vous pouvez également choisir l\'expéditeur si vous avez plusieurs comptes.',
        },
        {
          question: 'Comment créer des événements dans Google Calendar ?',
          answer:
            'Sélectionnez Google Calendar, puis "Créer un événement". Définissez le titre, la description, les dates de début et fin, et ajoutez des participants si nécessaire.',
        },
        {
          question: 'Comment gérer mes contacts Google ?',
          answer:
            "Avec Google Contacts, vous pouvez créer de nouveaux contacts en spécifiant le nom complet et l'adresse email.",
        },
      ],
    },
    {
      id: 'troubleshooting',
      title: 'Résolution de problèmes',
      icon: '🔧',
      content: [
        {
          question: 'Mon automatisation ne fonctionne pas',
          answer:
            "Vérifiez que tous les champs obligatoires sont remplis et que les formats d'email sont corrects. Assurez-vous également que vos services sont bien connectés.",
        },
        {
          question: 'Erreur de connexion aux services',
          answer:
            "Essayez de vous déconnecter et de vous reconnecter à votre compte Google. Vérifiez également que vous avez autorisé l'accès aux services demandés.",
        },
        {
          question: "Les emails ne s'envoient pas",
          answer:
            'Vérifiez le format des adresses email (expéditeur et destinataire) et assurez-vous que vous avez les permissions nécessaires pour envoyer des emails depuis ce compte.',
        },
      ],
    },
    {
      id: 'account',
      title: 'Compte & Sécurité',
      icon: '🔒',
      content: [
        {
          question: 'Comment protéger mon compte ?',
          answer:
            "Nous utilisons l'authentification OAuth2 de Google pour sécuriser vos connexions. Vos mots de passe ne sont jamais stockés sur nos serveurs.",
        },
        {
          question: 'Puis-je déconnecter mes services ?',
          answer:
            "Oui, vous pouvez révoquer l'accès à tout moment depuis les paramètres de votre compte Google ou nous contacter pour assistance.",
        },
        {
          question: 'Mes données sont-elles sécurisées ?',
          answer:
            'Absolument. Nous suivons les meilleures pratiques de sécurité et ne stockons que les informations nécessaires au fonctionnement des automatisations.',
        },
      ],
    },
  ];

  const quickActions = [
    {
      title: 'Créer une automatisation',
      description: 'Commencez à automatiser vos tâches',
      action: () => (window.location.href = '/connected-dashboard'),
      icon: '⚡',
    },
    {
      title: 'Voir les intégrations',
      description: 'Découvrez tous nos services',
      action: () => (window.location.href = '/integrations'),
      icon: '🔗',
    },
    {
      title: 'Mes automatisations',
      description: 'Gérez vos automatisations existantes',
      action: () => (window.location.href = '/automations'),
      icon: '🤖',
    },
  ];

  return (
    <PageWithSidebar>
      <div className={`help-page ${isVisible ? 'visible' : ''}`}>
        {/* Header */}
        <div className="help-header fade-in">
          <h1 className="help-title">
            <span className="help-icon">❓</span>
            Centre d&apos;aide
          </h1>
          <p className="help-subtitle">
            Trouvez toutes les réponses à vos questions sur AREA
          </p>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions slide-up">
          <h2 className="section-title">Actions rapides</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="action-card"
                onClick={action.action}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    action.action();
                  }
                }}
                role="button"
                tabIndex={0}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="action-icon">{action.icon}</div>
                <h3 className="action-title">{action.title}</h3>
                <p className="action-description">{action.description}</p>
                <div className="action-arrow">→</div>
              </div>
            ))}
          </div>
        </div>

        {/* Help Content */}
        <div className="help-content">
          {/* Navigation */}
          <div className="help-nav slide-up">
            <h3 className="nav-title">Catégories</h3>
            {helpSections.map(section => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="nav-icon">{section.icon}</span>
                {section.title}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="help-main fade-in">
            {helpSections.map(section => (
              <div
                key={section.id}
                className={`help-section ${activeSection === section.id ? 'active' : ''}`}
              >
                <div className="section-header">
                  <span className="section-icon">{section.icon}</span>
                  <h2 className="section-title">{section.title}</h2>
                </div>

                <div className="faq-list">
                  {section.content.map((item, index) => (
                    <div key={index} className="faq-item">
                      <h3 className="faq-question">
                        <span className="question-icon">Q.</span>
                        {item.question}
                      </h3>
                      <div className="faq-answer">
                        <span className="answer-icon">A.</span>
                        {item.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="help-contact slide-up">
          <div className="contact-card">
            <h3 className="contact-title">
              <span className="contact-icon">💬</span>
              Besoin d&apos;aide supplémentaire ?
            </h3>
            <p className="contact-description">
              Notre équipe est là pour vous aider ! N&apos;hésitez pas à nous
              contacter.
            </p>
            <div className="contact-actions">
              <button className="contact-button primary">
                📧 Envoyer un email
              </button>
              <button className="contact-button secondary">
                💬 Chat en direct
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageWithSidebar>
  );
};

export default HelpPage;
