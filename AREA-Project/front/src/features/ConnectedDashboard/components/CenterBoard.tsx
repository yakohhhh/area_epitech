import React from 'react';
import { useDashboardStore } from '../store/dashboard.store';
import { getServiceById } from './servicesCatalog';
import type { ServiceId } from './types';

const CenterBoard: React.FC = () => {
  const {
    activeServices,
    addActiveService,
    removeActiveService,
    selectActiveService,
    selectedUid,
  } = useDashboardStore();

  const onDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('text/service-id')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const onDrop = (e: React.DragEvent) => {
    const id = e.dataTransfer.getData('text/service-id') as ServiceId;
    if (!id) return;
    addActiveService(id);
  };

  return (
    <main className="cd-board" onDragOver={onDragOver} onDrop={onDrop}>
      <div className="cd-board-header">
        <h2>Mes services actifs</h2>
        <p>Glisse un service depuis la gauche pour l’ajouter ici.</p>
      </div>

      {activeServices.length === 0 ? (
        <div className="cd-drop-hint">Dépose un service ici</div>
      ) : (
        <div className="cd-active-grid">
          {activeServices.map(s => {
            const def = getServiceById(s.serviceId);
            return (
              <div
                key={s.uid}
                className={`cd-active-card ${selectedUid === s.uid ? 'is-selected' : ''}`}
                onClick={() => selectActiveService(s.uid)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  // NEW: a11y clavier
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectActiveService(s.uid);
                  }
                }}
              >
                <div className="cd-active-head">
                  <span className="cd-service-icon">{def?.icon ?? '⚙️'}</span>
                  <strong>{s.name}</strong>
                </div>
                <div className="cd-active-meta">
                  <span className={`cd-chip ${s.connected ? 'ok' : 'ko'}`}>
                    {s.connected ? 'Connecté' : 'Non connecté'}
                  </span>
                  {s.selectedActionId && (
                    <span className="cd-chip neutral">
                      Action: {s.selectedActionId}
                    </span>
                  )}
                </div>
                <button
                  className="cd-btn cd-btn-ghost"
                  onClick={e => {
                    e.stopPropagation();
                    removeActiveService(s.uid);
                  }}
                >
                  Supprimer
                </button>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default CenterBoard;
