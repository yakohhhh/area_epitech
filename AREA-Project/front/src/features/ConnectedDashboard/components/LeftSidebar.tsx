import React from 'react';
import { SERVICES_CATALOG } from './servicesCatalog';
import { useDashboardStore } from '../store/dashboard.store';
import { Service } from './types';

const LeftSidebar: React.FC = () => {
  const { catalogFilter, setCatalogFilter } = useDashboardStore();
  const list = SERVICES_CATALOG.filter(s =>
    s.name.toLowerCase().includes(catalogFilter.toLowerCase())
  );

  const onDragStart = (e: React.DragEvent, service: Service) => {
    e.dataTransfer.setData('text/service-id', service.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside className="cd-sidebar-left">
      <div className="cd-sidebar-header">
        <h3>Services</h3>
        <input
          className="cd-input"
          placeholder="Rechercher..."
          value={catalogFilter}
          onChange={e => setCatalogFilter(e.target.value)}
        />
      </div>

      <div className="cd-services-list">
        {list.map(s => (
          <div
            key={s.id}
            className="cd-service-item"
            draggable
            onDragStart={e => onDragStart(e, s)}
            title="Glisser vers la zone centrale"
          >
            <span className="cd-service-icon">{s.icon ?? '⚙️'}</span>
            <span>{s.name}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default LeftSidebar;
