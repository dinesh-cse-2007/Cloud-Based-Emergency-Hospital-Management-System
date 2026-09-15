import { useMemo, useState } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { api, timeAgo } from '../lib/api';
import type { LayoutOutletContext } from '../components/Layout';

export default function Patients() {
  const { setAdmitOpen } = useOutletContext<LayoutOutletContext>();
  const { patients, showToast, refreshPatients, refreshMetrics, refreshActivities } = useApp();
  const [params] = useSearchParams();
  const q = params.get('q')?.toLowerCase() || '';
  const [filter, setFilter] = useState<'all' | 'critical' | 'stable'>('all');
  const [busyId, setBusyId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      if (filter !== 'all' && p.status !== filter) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.condition.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [patients, filter, q]);

  const triageBadge = (t: string) => {
    if (t === 'red') return 'bg-red-400 text-white';
    if (t === 'yellow') return 'bg-yellow-400 text-slate-900';
    return 'bg-emerald-400 text-slate-900';
  };

  const transfer = async (id: number, name: string) => {
    setBusyId(id);
    try {
      await api.put('/api/patients', { id, department: 'ICU', status: 'stable' });
      await api.post('/api/activities', {
        message: `Transfer queued for ${name} → ICU`,
        icon: 'user-check',
        color: 'text-sky-400',
      });
      await Promise.all([refreshPatients(), refreshActivities()]);
      showToast(`Transfer request for ${name} queued`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Transfer failed');
    } finally {
      setBusyId(null);
    }
  };

  const discharge = async (id: number, name: string) => {
    setBusyId(id);
    try {
      await api.delete('/api/patients', { id });
      await Promise.all([refreshPatients(), refreshMetrics(), refreshActivities()]);
      showToast(`${name} discharged`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Discharge failed');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">All Patients</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex overflow-hidden rounded-3xl border border-slate-600 text-xs">
            {(['all', 'critical', 'stable'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 uppercase transition ${
                  filter === f ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setAdmitOpen(true)}
            className="flex h-10 items-center gap-2 rounded-3xl bg-white px-5 text-sm font-semibold text-slate-900"
          >
            <Plus className="h-4 w-4" />
            NEW ADMISSION
          </button>
        </div>
      </div>

      {q && (
        <div className="mb-4 text-xs text-slate-400">
          Search results for "{q}" — {filtered.length} found
        </div>
      )}

      <div className="overflow-hidden rounded-3xl bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-700 text-xs text-slate-400">
                <th className="py-4 pl-6 text-left font-normal">PATIENT</th>
                <th className="py-4 text-left font-normal">CONDITION</th>
                <th className="py-4 text-left font-normal">DEPARTMENT</th>
                <th className="py-4 text-left font-normal">VITALS</th>
                <th className="py-4 text-left font-normal">ARRIVED</th>
                <th className="py-4 pr-6 text-right font-normal">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 text-sm">
              {filtered.map((p) => (
                <tr key={p.id} className="patient-row hover:bg-slate-800/80">
                  <td className="py-5 pl-6">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">👤</span>
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-slate-400">
                          {p.age}yo • {p.gender}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5">
                    <span className={`rounded-3xl px-3 py-1 text-xs ${triageBadge(p.triage)}`}>
                      {p.condition}
                    </span>
                  </td>
                  <td className="py-5">{p.department}</td>
                  <td className="py-5 font-mono text-xs">{p.vitals}</td>
                  <td className="py-5 text-xs text-slate-400">{timeAgo(p.arrived_at)}</td>
                  <td className="py-5 pr-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        disabled={busyId === p.id}
                        onClick={() => transfer(p.id, p.name)}
                        className="rounded-3xl bg-slate-700 px-4 py-2 text-xs transition hover:bg-slate-600 disabled:opacity-50"
                      >
                        TRANSFER
                      </button>
                      <button
                        type="button"
                        disabled={busyId === p.id}
                        onClick={() => discharge(p.id, p.name)}
                        className="rounded-3xl bg-slate-800 px-4 py-2 text-xs text-slate-300 transition hover:bg-emerald-600 hover:text-white disabled:opacity-50"
                      >
                        DISCHARGE
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
