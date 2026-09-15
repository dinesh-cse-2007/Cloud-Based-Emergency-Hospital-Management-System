import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ActivityFeed from './ActivityFeed';
import Toast from './Toast';
import AdmitPatientModal from './modals/AdmitPatientModal';
import IncidentModal from './modals/IncidentModal';
import MapModal from './modals/MapModal';
import { useApp } from '../contexts/AppContext';
import { Server } from 'lucide-react';

export default function Layout() {
  const { toast, clearToast, showToast, loading, error } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [admitOpen, setAdmitOpen] = useState(false);
  const [incidentOpen, setIncidentOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">
      <Sidebar
        onNewIncident={() => setIncidentOpen(true)}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-auto bg-slate-950 p-4 sm:p-8">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent" />
                <span className="text-sm text-slate-400">Loading hospital data…</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <p className="text-rose-400">Failed to load: {error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-3xl bg-slate-800 px-6 py-2 text-sm hover:bg-slate-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <Outlet context={{ setAdmitOpen, setMapOpen, setIncidentOpen }} />
          )}
        </main>

        <footer className="flex h-9 items-center justify-between border-t border-slate-700 bg-slate-900 px-4 font-mono text-[10px] text-slate-400 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">DB REPLICATED ACROSS 3 REGIONS</span>
            <span className="hidden h-3 w-px bg-slate-600 sm:block" />
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">●</span> BACKUP COMPLETE
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                showToast('Backend: Node + Vercel. Database: PostgreSQL via Supabase.')
              }
              className="flex items-center gap-1 hover:text-slate-200"
            >
              <Server className="h-3 w-3" />
              <span className="hidden sm:inline">BACKEND v24.3.1</span>
            </button>
            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-teal-400">POSTGRES</span>
              <span className="h-3 w-px bg-slate-600" />
              <span className="text-violet-400">REDIS</span>
              <span className="h-3 w-px bg-slate-600" />
              <span className="text-sky-400">KAFKA</span>
            </div>
          </div>
        </footer>
      </div>

      <ActivityFeed />

      <AdmitPatientModal open={admitOpen} onClose={() => setAdmitOpen(false)} />
      <IncidentModal open={incidentOpen} onClose={() => setIncidentOpen(false)} />
      <MapModal open={mapOpen} onClose={() => setMapOpen(false)} />
      <Toast message={toast} onClose={clearToast} />
    </div>
  );
}

export type LayoutOutletContext = {
  setAdmitOpen: (v: boolean) => void;
  setMapOpen: (v: boolean) => void;
  setIncidentOpen: (v: boolean) => void;
};
