// src/store/dashboard.store.ts
import * as React from 'react';
import { getServiceById } from '../components/servicesCatalog';

export type ServiceId = 'slack' | 'gmail' | 'gdrive' | 'notion';

export interface ActiveService {
  uid: string;
  serviceId: ServiceId;
  name: string;
  connected: boolean;
  selectedActionId?: string;
  valuesByAction: Record<string, Record<string, unknown>>;
}

type State = {
  catalogFilter: string;
  activeServices: ActiveService[];
  selectedUid?: string;
};

type Actions = {
  setCatalogFilter: (q: string) => void;
  addActiveService: (serviceId: ServiceId) => void;
  removeActiveService: (uid: string) => void;
  selectActiveService: (uid?: string) => void;
  toggleConnection: (uid: string, connected: boolean) => void;
  setSelectedAction: (uid: string, actionId?: string) => void;
  setValue: (
    uid: string,
    actionId: string,
    field: string,
    value: unknown
  ) => void;
};

// --- mini-store global (sans lib) ---
const uid = () => Math.random().toString(36).slice(2, 10);

let state: State = {
  catalogFilter: '',
  activeServices: [],
  selectedUid: undefined,
};

const listeners = new Set<() => void>();
const notify = () => listeners.forEach(l => l());

const setState = (updater: Partial<State> | ((s: State) => Partial<State>)) => {
  const patch = typeof updater === 'function' ? updater(state) : updater;
  state = { ...state, ...patch };
  notify();
};

const actions: Actions = {
  setCatalogFilter: q => setState({ catalogFilter: q }),

  addActiveService: serviceId => {
    const def = getServiceById(serviceId);
    if (!def) return;
    const item: ActiveService = {
      uid: uid(),
      serviceId,
      name: def.name,
      connected: false,
      valuesByAction: {},
    };
    setState(s => ({
      activeServices: [...s.activeServices, item],
      selectedUid: item.uid,
    }));
  },

  removeActiveService: rmUid => {
    setState(s => ({
      activeServices: s.activeServices.filter(x => x.uid !== rmUid),
      selectedUid: s.selectedUid === rmUid ? undefined : s.selectedUid,
    }));
  },

  selectActiveService: uid => setState({ selectedUid: uid }),

  toggleConnection: (uid, connected) => {
    setState(s => ({
      activeServices: s.activeServices.map(x =>
        x.uid === uid ? { ...x, connected } : x
      ),
    }));
  },

  setSelectedAction: (uid, actionId) => {
    setState(s => ({
      activeServices: s.activeServices.map(x =>
        x.uid === uid ? { ...x, selectedActionId: actionId } : x
      ),
    }));
  },

  setValue: (uid, actionId, field, value) => {
    setState(s => ({
      activeServices: s.activeServices.map(x => {
        if (x.uid !== uid) return x;
        const prev = x.valuesByAction[actionId] ?? {};
        return {
          ...x,
          valuesByAction: {
            ...x.valuesByAction,
            [actionId]: { ...prev, [field]: value },
          },
        };
      }),
    }));
  },
};

// Hook compatible avec useZustand : useDashboardStore(selector?)
export function useDashboardStore<T = State & Actions>(
  selector?: (s: State & Actions) => T
): T {
  const subscribe = React.useCallback((cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  }, []);

  const getSnapshot = React.useCallback(() => state, []);
  const current = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot
  );

  const combined = React.useMemo(() => ({ ...current, ...actions }), [current]);

  return (selector ? selector(combined) : combined) as T;
}
