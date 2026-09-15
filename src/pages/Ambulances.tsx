import { useApp } from '../contexts/AppContext';
import { api } from '../lib/api';
import { Truck } from 'lucide-react';

export default function Ambulances() {
  const { ambulances, showToast, refreshAmbulances, refreshActivities } = useApp();

  const enroute = ambulances.filter((a) => a.status === 'enroute' || a.status === 'on_mission');
  const available = ambulances.filter((a) => a.status === 'available');
  const featured = enroute[0] || ambulances[0];
  const ready = available[0];

  const statusStyle = (s: string) => {
    if (s === 'available') return 'bg-emerald-900 text-emerald-400';
    if (s === 'enroute' || s === 'on_mission') return 'bg-amber-900 text-amber-400';
    if (s === 'maintenance') return 'bg-sky-900 text-sky-400';
    return 'bg-slate-700 text-slate-300';
  };

  const prepareTrauma = async () => {
    try {
      await api.post('/api/activities', {
        message: 'Trauma bays 1 & 2 prepped for incoming criticals',
        icon: 'bell',
        color: 'text-amber-400',
      });
      await refreshActivities();
      showToast('Trauma bays 1 & 2 prepped for incoming criticals');
    } catch {
      showToast('Could not prep trauma bays');
    }
  };

  const dispatchUnit = async (id: number, code: string) => {
    try {
      await api.put('/api/ambulances', {
        id,
        status: 'enroute',
        eta_minutes: 8,
        location: 'Dispatch zone',
      });
      await Promise.all([refreshAmbulances(), refreshActivities()]);
      showToast(`${code} dispatched`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Dispatch failed');
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold text-white sm:text-3xl">Fleet Management</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {featured && (
          <div className="rounded-3xl bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-2xl">
                  🚑
                </div>
                <div>
                  <div className="font-semibold">{featured.code}</div>
                  <div className="text-xs text-emerald-400">
                    {featured.status === 'available' ? 'Standby' : featured.notes || featured.location}
                  </div>
                </div>
              </div>
              <div className="rounded-3xl bg-emerald-400 px-3 py-1 text-xs text-slate-900">
                {featured.status.replace('_', ' ').toUpperCase()}
              </div>
            </div>
            <div className="my-6 rounded-3xl border border-dashed border-slate-600 p-5 text-center">
              <div className="mb-3 flex justify-center gap-2 text-4xl">🩸 🦴</div>
              <div className="text-xs text-slate-400">
                ETA to hospital: {featured.eta_minutes ?? '—'} minutes
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <div className="text-slate-400">CREW</div>
              <div className="font-medium">{featured.crew}</div>
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-yellow-400 bg-slate-900 p-6">
          <div className="flex justify-between">
            <div>
              <div className="text-xs uppercase text-amber-400">INCOMING</div>
              <div className="mt-2 text-5xl font-semibold sm:text-6xl">
                {String(enroute.length).padStart(2, '0')}
              </div>
            </div>
            <Truck className="h-14 w-14 self-end text-amber-400" />
          </div>
          <div className="mt-6 text-xs leading-snug text-slate-400">
            {enroute.length > 0
              ? `${enroute.length} ambulance(s) inbound with critical patients.`
              : 'No units currently en route.'}
          </div>
          <button
            type="button"
            onClick={prepareTrauma}
            className="mt-6 h-11 w-full rounded-3xl bg-amber-400 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
          >
            PREPARE TRAUMA BAYS
          </button>
        </div>

        <div className="rounded-3xl bg-slate-900 p-6">
          <div className="mb-1 text-xs font-medium text-slate-400">AVAILABLE</div>
          {ready ? (
            <div className="flex items-center gap-4">
              <div className="text-5xl">🚑</div>
              <div className="flex-1">
                <div className="text-lg font-semibold">{ready.code} • READY</div>
                <div className="mt-4 flex items-center text-xs text-emerald-400">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-400 to-emerald-400" />
                  <div className="px-4">{ready.location}</div>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent via-emerald-400 to-emerald-400" />
                </div>
                <button
                  type="button"
                  onClick={() => dispatchUnit(ready.id, ready.code)}
                  className="mt-4 rounded-3xl bg-slate-800 px-4 py-2 text-xs hover:bg-slate-700"
                >
                  DISPATCH UNIT
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-slate-500">No units available</div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center gap-3 text-xs uppercase text-slate-400">
          <div className="h-px flex-1 bg-slate-700" />
          <span>ALL VEHICLES • {ambulances.length} TOTAL</span>
          <div className="h-px flex-1 bg-slate-700" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {ambulances.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => showToast(`${a.code} telemetry • ${a.status} @ ${a.location}`)}
              className={`min-w-[200px] rounded-3xl bg-slate-800 p-5 text-left transition hover:border hover:border-slate-400 ${
                a.status === 'enroute' || a.status === 'on_mission' ? 'border border-amber-400' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">🚑</span>
                <span className={`rounded-3xl px-2.5 py-1 text-xs ${statusStyle(a.status)}`}>
                  {a.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="mt-6 font-semibold">{a.code}</div>
              <div className="text-xs text-slate-400">
                {a.eta_minutes != null ? `ETA ${a.eta_minutes} min` : a.location}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
