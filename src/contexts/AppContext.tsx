import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { api } from '../lib/api';
import type {
  Patient,
  Ambulance,
  StaffMember,
  Resource,
  Incident,
  Activity,
  HospitalMetrics,
} from '../lib/types';

interface AppContextValue {
  patients: Patient[];
  ambulances: Ambulance[];
  staff: StaffMember[];
  resources: Resource[];
  incidents: Incident[];
  activities: Activity[];
  metrics: HospitalMetrics | null;
  loading: boolean;
  error: string | null;
  toast: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;
  refreshAll: () => Promise<void>;
  refreshPatients: () => Promise<void>;
  refreshAmbulances: () => Promise<void>;
  refreshStaff: () => Promise<void>;
  refreshResources: () => Promise<void>;
  refreshIncidents: () => Promise<void>;
  refreshActivities: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [metrics, setMetrics] = useState<HospitalMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => setToast(msg), []);
  const clearToast = useCallback(() => setToast(null), []);

  const refreshPatients = useCallback(async () => {
    const data = await api.get<Patient[]>('/api/patients');
    setPatients(data);
  }, []);

  const refreshAmbulances = useCallback(async () => {
    const data = await api.get<Ambulance[]>('/api/ambulances');
    setAmbulances(data);
  }, []);

  const refreshStaff = useCallback(async () => {
    const data = await api.get<StaffMember[]>('/api/staff');
    setStaff(data);
  }, []);

  const refreshResources = useCallback(async () => {
    const data = await api.get<Resource[]>('/api/resources');
    setResources(data);
  }, []);

  const refreshIncidents = useCallback(async () => {
    const data = await api.get<Incident[]>('/api/incidents');
    setIncidents(data);
  }, []);

  const refreshActivities = useCallback(async () => {
    const data = await api.get<Activity[]>('/api/activities');
    setActivities(data);
  }, []);

  const refreshMetrics = useCallback(async () => {
    const data = await api.get<HospitalMetrics>('/api/metrics');
    setMetrics(data);
  }, []);

  const refreshAll = useCallback(async () => {
    setError(null);
    try {
      await Promise.all([
        refreshPatients(),
        refreshAmbulances(),
        refreshStaff(),
        refreshResources(),
        refreshIncidents(),
        refreshActivities(),
        refreshMetrics(),
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [
    refreshPatients,
    refreshAmbulances,
    refreshStaff,
    refreshResources,
    refreshIncidents,
    refreshActivities,
    refreshMetrics,
  ]);

  useEffect(() => {
    refreshAll();
    const interval = setInterval(() => {
      refreshActivities().catch(() => {});
      refreshMetrics().catch(() => {});
    }, 15000);
    return () => clearInterval(interval);
  }, [refreshAll, refreshActivities, refreshMetrics]);

  return (
    <AppContext.Provider
      value={{
        patients,
        ambulances,
        staff,
        resources,
        incidents,
        activities,
        metrics,
        loading,
        error,
        toast,
        showToast,
        clearToast,
        refreshAll,
        refreshPatients,
        refreshAmbulances,
        refreshStaff,
        refreshResources,
        refreshIncidents,
        refreshActivities,
        refreshMetrics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
