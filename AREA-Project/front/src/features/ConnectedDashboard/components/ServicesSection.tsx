import React from 'react';
import ServiceCard from './ServiceCards';

const services = [
  {
    id: 'slack',
    name: 'Slack',
    actions: [
      {
        title: 'Envoyer un message',
        description: 'Le bot envoie le message dans le canal.',
      },
      {
        title: 'Ajouter une réaction',
        description: 'Le bot ajoute un emoji au message.',
      },
    ],
  },
  {
    id: 'gmail',
    name: 'Gmail',
    actions: [
      {
        title: 'Envoyer un mail',
        description: 'Le mail est envoyé automatiquement.',
      },
      {
        title: 'Marquer comme lu',
        description: 'Un mail est marqué comme lu.',
      },
    ],
  },
  {
    id: 'gdrive',
    name: 'Google Drive',
    actions: [
      {
        title: 'Créer un dossier',
        description: 'Un dossier est créé sur Drive.',
      },
      {
        title: 'Ajouter un fichier',
        description: 'Un fichier est uploadé sur Drive.',
      },
    ],
  },
  {
    id: 'notion',
    name: 'Notion',
    actions: [
      {
        title: 'Ajouter une tâche',
        description: "Une tâche est ajoutée dans la base 'Projets'.",
      },
      {
        title: 'Créer un rappel',
        description: 'Un rappel est ajouté dans Google Calendar.',
      },
    ],
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section aria-labelledby="services-title" className="mt-16">
      {/* Titre centré (on surchage la classe CSS custom) */}
      <div className="flex flex-col items-center text-center mb-12">
        <h2 id="services-title" className="section-title !text-center">
          Services et Actions
        </h2>
        <p className="section-subtitle max-w-2xl">
          Choisissez un service et configurez vos actions/réactions.
        </p>
      </div>

      {/* Grille des services — espaces horizontaux & verticaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
        {services.map(s => (
          <ServiceCard key={s.id} name={s.name} actions={s.actions} />
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
