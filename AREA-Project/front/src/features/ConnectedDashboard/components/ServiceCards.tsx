import React from 'react';

interface ServiceCardProps {
  name: string;
  actions: { title: string; description: string }[];
}

const ServiceCard: React.FC<ServiceCardProps> = ({ name, actions }) => {
  return (
    <div className="step-card">
      <h3 className="step-title">{name}</h3>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((a, idx) => (
          <div key={idx} className="step-card bg-gray-50">
            <h4 className="step-title text-base">{a.title}</h4>
            <p className="step-description">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCard;
