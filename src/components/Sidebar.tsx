import { NavLink } from 'react-router-dom';
import {
  Gauge,
  BedDouble,
  Truck,
  UserRound,
  Boxes,
  HeartPulse,
  Bell,
  Plus,
  LogOut,
  Wifi,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Gauge, end: true },
  { to: '/patients', label: 'Patients', icon: BedDouble },
  { to: '/ambulances', label: 'Ambulances', icon: Truck },
  { to: '/staff', label: 'Staff', icon: UserRound },
  { to: '/resources', label: 'Resources', icon: Boxes },
];

interface SidebarProps {
  onNewIncident: () => void;
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ onNewIncident, mobileOpen, onClose }: SidebarProps) {
  const { metrics, patients } = useApp();
  const { user, signOut } = useAuth();
  const triageWaiting = patients.filter((p) => p.department === 'Triage' || p.status === 'waiting').length
    || patients.filter((p) => p.triage === 'red' || p.triage === 'yellow').length;

  const email = user?.email || 'dr.maya@medcloud.io';
  const displayName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-700 bg-slate-900 transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-slate-700 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-yellow-400 shadow-inner">
            <Plus className="h-6 w-6 text-slate-900" strokeWidth={3} />
          </div>
          <span className="logo-font text-2xl font-semibold tracking-tighter text-white">MedCloud</span>
          <div className="ml-auto flex items-center gap-1 rounded-full bg-emerald-400 px-2.5 py-1 font-mono text-[10px] font-medium text-slate-900">
            <span className="status-dot h-1.5 w-1.5 rounded-full bg-slate-900" />
            LIVE
          </div>
        </div>

        <div className="border-b border-slate-700 bg-slate-950 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500 text-white shadow-md">
              <span className="text-lg">🏥</span>
            </div>
            <div>
              <div className="text-base font-semibold leading-none text-white">
                {metrics?.hospital_name || 'City General'}
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
                <Wifi className="h-3 w-3" />
                <span className="font-mono text-[10px]">CLOUD SYNCED</span>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="rounded-2xl bg-slate-800 p-2.5">
              <div className="text-xs text-emerald-400">BEDS</div>
              <div className="mt-0.5 text-2xl font-semibold text-white">{metrics?.available_beds ?? '—'}</div>
              <div className="text-slate-400">available</div>
            </div>
            <div className="rounded-2xl bg-slate-800 p-2.5">
              <div className="text-xs text-amber-400">ER</div>
              <div className="mt-0.5 text-2xl font-semibold text-white">{metrics?.er_patients ?? '—'}</div>
              <div className="text-slate-400">critical</div>
            </div>
            <div className="rounded-2xl bg-slate-800 p-2.5">
              <div className="text-xs text-rose-400">WAIT</div>
              <div className="mt-0.5 text-2xl font-semibold text-white">{metrics?.wait_time_mins ?? '—'}</div>
              <div className="text-slate-400">mins</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-3xl px-5 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-yellow-300'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}

          <div className="mb-2 mt-6 px-5 font-mono text-[10px] tracking-widest text-slate-500">
            INCIDENTS
          </div>

          <NavLink
            to="/triage"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-3xl px-5 py-3 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-slate-800 text-yellow-300'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <HeartPulse className="h-4 w-4" />
            Triage Queue
            <span className="ml-auto rounded-full bg-rose-500 px-2 py-px font-mono text-[10px] text-white">
              {triageWaiting}
            </span>
          </NavLink>

          <button
            type="button"
            onClick={() => {
              onNewIncident();
              onClose();
            }}
            className="mx-2 mt-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-3xl bg-gradient-to-r from-rose-500 to-orange-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:brightness-110"
          >
            <Bell className="h-4 w-4" />
            NEW INCIDENT
          </button>

          <div className="mx-3 mt-8 rounded-3xl bg-slate-800/50 p-4 text-xs">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-medium text-slate-300">System Health</span>
              <span className="flex items-center text-emerald-400">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                99.98%
              </span>
            </div>
            <div className="mb-4 h-2 overflow-hidden rounded-3xl bg-slate-700">
              <div className="h-2 w-[98%] rounded-3xl bg-gradient-to-r from-emerald-400 to-cyan-400" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-[10px]">
              <div>
                <div className="text-slate-400">API LATENCY</div>
                <div className="font-mono text-emerald-300">43ms</div>
              </div>
              <div>
                <div className="text-slate-400">DB SYNC</div>
                <div className="font-mono text-emerald-300">live</div>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-3 border-t border-slate-700 p-4">
          <div className="flex-1 min-w-0">
            <div className="truncate text-xs text-slate-300">{displayName}</div>
            <div className="font-mono text-[10px] text-slate-500">ER DIRECTOR • SHIFT A</div>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-800 text-slate-400 transition hover:bg-slate-700 hover:text-white"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </aside>
    </>
  );
}
