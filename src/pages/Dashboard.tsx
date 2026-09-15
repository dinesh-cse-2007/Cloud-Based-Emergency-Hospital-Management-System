import { useOutletContext } from 'react-router-dom';
import {
  RefreshCw,
  UserPlus,
  MapPin,
  ClipboardList,
  ArrowRight,
  ExternalLink,
  Truck,
  Flame,
  Wind,
  Droplets,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { api, timeAgo } from '../lib/api';
import type { LayoutOutletContext } from '../components/Layout';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { setAdmitOpen, setMapOpen } = useOutletContext<LayoutOutletContext>();
  const {
    patients,
    incidents,
    metrics,
    ambulances,
    staff,
    showToast,
    refreshAll,
    refreshMetrics,
  } = useApp();

  const monitored = patients.filter((p) => p.status === 'critical' || p.department === 'ER' || p.department === 'ICU' || p.department === 'Trauma').slice(0, 8);
  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');
  const triageQueue = [...patients]
    .filter((p) => p.triage === 'red' || p.triage === 'yellow')
    .sort((a, b) => (a.triage === 'red' ? -1 : 1))
    .slice(0, 5);
  const enroute = ambulances.find((a) => a.status === 'enroute' || a.status === 'on_mission');
  const onCall = staff.filter((s) => s.status === 'on-call' || s.status === 'available').length;

  const refresh = async () => {
    try {
      if (metrics) {
        const delta = Math.random() > 0.5 ? 1 : -1;
        await api.put('/api/metrics', {
          available_beds: Math.max(0, (metrics.available_beds || 0) + delta),
          wait_time_mins: Math.max(1, (metrics.wait_time_mins || 10) + (Math.random() > 0.5 ? 1 : -1)),
        });
        await refreshMetrics();
      }
      await refreshAll();
      showToast('Dashboard metrics refreshed from cloud');
    } catch {
      showToast('Refresh failed');
    }
  };

  const triageColor = (t: string) => {
    if (t === 'red') return '#f43f5e';
    if (t === 'yellow') return '#eab308';
    return '#22c55e';
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-[1px] text-yellow-400">
            EMERGENCY OPERATIONS CENTER
          </div>
          <h1 className="logo-font text-3xl font-semibold tracking-tighter text-white sm:text-5xl">
            Hospital Command
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={refresh}
            className="flex h-9 items-center gap-2 rounded-3xl border border-slate-600 bg-slate-900 px-5 transition hover:bg-slate-800"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            REFRESH
          </button>
          <button
            type="button"
            onClick={() => setAdmitOpen(true)}
            className="flex h-9 items-center gap-2 rounded-3xl bg-white px-5 font-semibold text-slate-900 transition hover:shadow-xl active:scale-95"
          >
            <UserPlus className="h-3.5 w-3.5" />
            ADMIT PATIENT
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Live Vitals */}
        <div className="col-span-12 lg:col-span-8">
          <div className="rounded-3xl bg-slate-900 p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 font-semibold">
                <span className="text-amber-400">LIVE VITALS</span>
                <span className="rounded-3xl bg-slate-800 px-3 py-1 font-mono text-xs text-slate-400">
                  {monitored.length} PATIENTS MONITORED
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {monitored.map((p) => (
                <div
                  key={p.id}
                  className="card-hover rounded-3xl border border-transparent bg-slate-800 p-4 transition hover:border-slate-600"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="text-xs text-slate-400">{p.name.split(' ')[0]} {p.name.split(' ')[1]?.[0]}.</div>
                      <div
                        className="mt-1 text-4xl font-light"
                        style={{ color: triageColor(p.triage) }}
                      >
                        {p.heart_rate}
                      </div>
                      <div className="text-xs text-slate-400">BPM</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">O₂</div>
                      <div className="text-3xl font-semibold text-teal-300">{p.o2}</div>
                      <div className="text-[10px] text-slate-500">%</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <div className="font-mono text-slate-300">{p.bp}</div>
                    <Link to="/patients" className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300">
                      DETAILS <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
              {monitored.length === 0 && (
                <div className="col-span-full py-8 text-center text-sm text-slate-500">No patients monitored</div>
              )}
            </div>
          </div>
        </div>

        {/* Incident Map */}
        <div className="col-span-12 lg:col-span-4">
          <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase">
                <MapPin className="h-3.5 w-3.5 text-rose-400" />
                INCIDENT MAP
              </div>
              <div className="flex items-center rounded-3xl bg-rose-400/10 px-3 py-1 text-xs text-rose-400">
                <span className="relative mr-2 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-400" />
                </span>
                {activeIncidents.length} ACTIVE
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMapOpen(true)}
              className="map-container relative flex min-h-[200px] flex-1 cursor-pointer items-center justify-center"
            >
              <div className="absolute left-[25%] top-[30%] flex h-6 w-6 items-center justify-center rounded-full bg-red-500 shadow-2xl shadow-red-500/70">
                <span className="text-[10px]">!</span>
              </div>
              {enroute && (
                <div className="absolute left-[55%] top-[50%] flex items-center gap-2 rounded-3xl bg-slate-900 px-3 py-1 text-[10px] text-white shadow-xl">
                  <div className="h-2 w-2 animate-ping rounded-full bg-yellow-400" />
                  <span className="font-medium">AMBULANCE ENROUTE</span>
                </div>
              )}
              {enroute && (
                <div
                  className="absolute bottom-4 left-4 rounded-3xl border border-slate-600 bg-slate-900/80 px-4 py-3 text-xs backdrop-blur-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="h-6 w-6 text-amber-400 ambulance-icon" />
                    <div>
                      <div className="text-sm font-semibold text-amber-300">
                        ETA {enroute.eta_minutes ?? 4} min
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {enroute.code} • {enroute.location}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeIncidents[0] && (
                <div className="absolute right-4 top-4 flex items-center gap-2 rounded-3xl bg-black/70 px-4 py-2 text-xs">
                  <Flame className="h-3.5 w-3.5 text-orange-400" />
                  <span className="font-medium uppercase">{activeIncidents[0].location.split(' ')[0]}</span>
                </div>
              )}
            </button>

            <div className="flex items-center justify-between border-t border-slate-700 bg-slate-950 px-5 py-3 text-xs">
              <div className="flex items-center gap-1 text-emerald-400">
                <span className="font-medium">4.2km radius</span>
              </div>
              <button
                type="button"
                onClick={() => setMapOpen(true)}
                className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300"
              >
                FULL MAP <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Patients */}
        <div className="col-span-12 lg:col-span-7">
          <div className="mb-3 flex items-center justify-between px-1">
            <div className="font-semibold">
              Active Cases • <span className="text-sm font-normal text-slate-400">{patients.length} total</span>
            </div>
            <Link to="/patients" className="flex items-center text-xs text-yellow-300 hover:text-yellow-200">
              VIEW ALL <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-3xl bg-slate-900">
            <div className="max-h-[280px] overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-slate-900">
                  <tr className="border-b border-slate-700 text-xs">
                    <th className="py-3 pl-6 text-left font-normal text-slate-400">NAME</th>
                    <th className="py-3 text-left font-normal text-slate-400">STATUS</th>
                    <th className="hidden py-3 text-left font-normal text-slate-400 sm:table-cell">ARRIVED</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {patients.slice(0, 8).map((p) => (
                    <tr key={p.id} className="patient-row border-b border-slate-700 last:border-none">
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-7 w-7 items-center justify-center rounded-2xl bg-white text-xs font-semibold text-slate-900">
                            {p.name[0]}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{p.name}</div>
                            <div className="text-xs text-slate-400">
                              {p.age} • {p.gender}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="inline-flex items-center gap-2">
                          <div
                            className={`h-2.5 w-2.5 rounded-full ${
                              p.status === 'critical' ? 'bg-red-400' : 'bg-emerald-400'
                            }`}
                          />
                          <span className="text-xs capitalize">{p.status}</span>
                        </div>
                      </td>
                      <td className="hidden text-xs text-slate-400 sm:table-cell">{timeAgo(p.arrived_at)}</td>
                      <td className="pr-6 text-right text-slate-500">›</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Triage Queue */}
        <div className="col-span-12 lg:col-span-5">
          <div className="h-full rounded-3xl bg-slate-900 p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-rose-400" />
                <span className="font-semibold">Triage Queue</span>
              </div>
              <Link
                to="/triage"
                className="rounded-3xl bg-slate-800 px-4 py-1 text-xs transition hover:bg-rose-500 hover:text-white"
              >
                MANAGE QUEUE
              </Link>
            </div>
            <div className="space-y-3">
              {triageQueue.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-3xl bg-slate-800 px-4 py-3 transition hover:bg-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        p.triage === 'red' ? 'bg-red-400' : 'bg-amber-400'
                      }`}
                    />
                    <div>
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-xs uppercase text-slate-400">{p.triage} priority</div>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-mono">{timeAgo(p.arrived_at)}</div>
                    <div className="text-[10px] text-slate-500">wait</div>
                  </div>
                </div>
              ))}
              {triageQueue.length === 0 && (
                <div className="py-6 text-center text-sm text-slate-500">Queue clear</div>
              )}
            </div>
          </div>
        </div>

        {/* Resource Status */}
        <div className="col-span-12">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="card-hover rounded-3xl bg-slate-900 p-5">
              <div className="flex justify-between">
                <div>
                  <div className="text-xs font-medium uppercase text-teal-400">O2 Supply</div>
                  <div className="mt-1 text-5xl font-semibold text-white sm:text-6xl">
                    {metrics?.o2_supply_pct ?? 84}%
                  </div>
                </div>
                <Wind className="h-12 w-12 text-teal-300/30 sm:h-16 sm:w-16" />
              </div>
              <div className="relative mt-6 h-2.5 overflow-hidden rounded-3xl bg-slate-700">
                <div
                  className="absolute left-0 top-0 h-full rounded-3xl bg-teal-400"
                  style={{ width: `${metrics?.o2_supply_pct ?? 84}%` }}
                />
              </div>
            </div>

            <div className="card-hover rounded-3xl bg-slate-900 p-5">
              <div className="flex justify-between">
                <div>
                  <div className="text-xs font-medium uppercase text-purple-400">BLOOD BANK</div>
                  <div className="mt-1 text-5xl font-semibold text-white sm:text-6xl">
                    {metrics?.blood_bank_type || 'A+'}
                  </div>
                  <div className="text-xs text-slate-400">{metrics?.blood_units ?? 0} units</div>
                </div>
                <Droplets className="h-12 w-12 text-purple-300/30 sm:h-16 sm:w-16" />
              </div>
              <Link to="/resources" className="mt-5 flex items-center gap-2 text-xs text-purple-400">
                RESTOCK REQUIRED ↗
              </Link>
            </div>

            <div className="card-hover flex flex-col justify-between rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-500 p-5 text-slate-950">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider">ON CALL</div>
                  <div className="mt-2 text-5xl font-semibold">{metrics?.surgeons_on_call ?? onCall}</div>
                  <div className="text-xs opacity-70">surgeons available</div>
                </div>
                <div className="rounded-3xl bg-white/20 px-3 py-1 text-xs font-medium text-white">24/7</div>
              </div>
              <div className="mt-4 flex items-center gap-3 text-xs">
                <div className="flex -space-x-2">
                  {staff.slice(0, 2).map((s) => (
                    <div
                      key={s.id}
                      className="flex h-6 w-6 items-center justify-center rounded-2xl border-2 border-yellow-400 bg-white text-[10px] font-semibold"
                    >
                      {s.avatar}
                    </div>
                  ))}
                </div>
                <div className="opacity-70">{staff[0]?.name?.split(' ').slice(-1)[0] || 'Team'} ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
