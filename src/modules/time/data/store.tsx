import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { minutesOfDay, toISODate } from '@core/lib/format';
import { admin, employees, projects, seedEntries, seedExceptions, settings as defaultSettings } from './seed';
import type { Employee, Project, Settings, TimeEntry, TimeException } from './types';

type State = { entries: TimeEntry[]; exceptions: TimeException[]; settings: Settings };

type Action =
  | { type: 'check-in'; entry: TimeEntry; exception?: TimeException }
  | { type: 'check-out'; entryId: string; at: number }
  | { type: 'resolve'; exceptionId: string; resolution: string; checkOut?: number; reject?: boolean }
  | { type: 'settings'; settings: Settings }
  | { type: 'replace'; state: State };

// Keyed by day so the demo re-seeds each morning.
const STORAGE_KEY = `studio-esene.time.${toISODate(new Date())}`;

function initialState(): State {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as State;
  } catch {
    /* storage unavailable — fall back to seed */
  }
  const entries = seedEntries();
  return { entries, exceptions: seedExceptions(entries), settings: defaultSettings };
}

function applyBreak(entry: TimeEntry, checkOut: number, s: Settings): number {
  return checkOut - entry.checkIn > s.breakAfterMinutes ? s.breakMinutes : 0;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'check-in':
      return {
        ...state,
        entries: [...state.entries, action.entry],
        exceptions: action.exception ? [...state.exceptions, action.exception] : state.exceptions,
      };
    case 'check-out':
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.id === action.entryId
            ? {
                ...e,
                checkOut: action.at,
                breakMinutes: applyBreak(e, action.at, state.settings),
                status: e.status === 'exception' ? 'exception' : 'completed',
              }
            : e,
        ),
      };
    case 'resolve': {
      const ex = state.exceptions.find((x) => x.id === action.exceptionId);
      if (!ex) return state;
      return {
        ...state,
        exceptions: state.exceptions.map((x) =>
          x.id === ex.id ? { ...x, resolved: true, resolution: action.resolution } : x,
        ),
        entries: state.entries.map((e) => {
          if (e.id !== ex.entryId) return e;
          if (action.reject) return { ...e, checkOut: e.checkOut ?? e.checkIn, breakMinutes: 0, status: 'completed' };
          const checkOut = action.checkOut ?? e.checkOut;
          return {
            ...e,
            checkOut,
            breakMinutes: checkOut != null ? applyBreak(e, checkOut, state.settings) : e.breakMinutes,
            status: checkOut == null ? 'working' : 'approved',
          };
        }),
      };
    }
    case 'settings':
      return { ...state, settings: action.settings };
    case 'replace':
      return action.state;
  }
}

/**
 * Location service. The prototype reports a fixed distance; replace with
 * navigator.geolocation + the project's coordinates.
 */
export function locateNearProject(_project: Project): { distance: number } {
  return { distance: 43 };
}

type Store = State & {
  employees: Employee[];
  admin: Employee;
  projects: Project[];
  checkIn: (employeeId: string, projectId: string, distance: number) => void;
  checkOut: (entryId: string) => void;
  resolveException: (exceptionId: string, resolution: string, opts?: { checkOut?: number; reject?: boolean }) => void;
  updateSettings: (settings: Settings) => void;
  resetDemo: () => void;
};

const TimeStoreContext = createContext<Store | null>(null);

export function TimeStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  // Keep an employee tab and an admin tab in sync during a demo.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) dispatch({ type: 'replace', state: JSON.parse(e.newValue) as State });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const checkIn = useCallback(
    (employeeId: string, projectId: string, distance: number) => {
      const now = new Date();
      const date = toISODate(now);
      const outside = distance > state.settings.gpsRadius;
      const entry: TimeEntry = {
        id: `t-${employeeId}-${date}-${now.getTime()}`,
        employeeId,
        projectId,
        date,
        checkIn: minutesOfDay(now),
        checkOut: null,
        breakMinutes: 0,
        distance,
        status: outside ? 'exception' : 'working',
      };
      dispatch({
        type: 'check-in',
        entry,
        exception: outside ? { id: `x-${entry.id}`, type: 'gps-deviation', entryId: entry.id, resolved: false } : undefined,
      });
    },
    [state.settings.gpsRadius],
  );

  const value = useMemo<Store>(
    () => ({
      ...state,
      employees,
      admin,
      projects,
      checkIn,
      checkOut: (entryId) => dispatch({ type: 'check-out', entryId, at: minutesOfDay(new Date()) }),
      resolveException: (exceptionId, resolution, opts) => dispatch({ type: 'resolve', exceptionId, resolution, ...opts }),
      updateSettings: (s) => dispatch({ type: 'settings', settings: s }),
      resetDemo: () => {
        const entries = seedEntries();
        dispatch({ type: 'replace', state: { entries, exceptions: seedExceptions(entries), settings: defaultSettings } });
      },
    }),
    [state, checkIn],
  );

  return <TimeStoreContext.Provider value={value}>{children}</TimeStoreContext.Provider>;
}

export function useTimeStore(): Store {
  const store = useContext(TimeStoreContext);
  if (!store) throw new Error('useTimeStore must be used inside <TimeStoreProvider>');
  return store;
}
