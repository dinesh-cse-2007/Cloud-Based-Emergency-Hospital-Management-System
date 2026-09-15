import { useState } from 'react';
import { HeartPulse, Check } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { api } from '../lib/api';

export default function Triage() {
  const { patients, showToast, refreshPatients, refreshActivities, refreshMetrics } = useApp();
  const [busyId, setBusyId] = useState<number | null>(null);

  const queue = patients.filter(
    (p) => p.department === 'Triage' || p.department === 'ER' || p.status === 'waiting'
  );
  const display = queue.length > 0 ? queue : patients.filter((p) => p.triage);

  const red = display.filter((p) => p.triage === 'red').length;
  const yellow = display.filter((p) => p.triage === 'yellow').length;
  const green = display.filter((p) => p.triage === 'green').length;

  const badge = (t: string) => {
    if (t === 'red') return 'bg-red-500 text-white';
    if (t === 'yellow') return 'bg-yellow-400 text-slate-900';
    return 'bg-emerald-400 text-white';
  };

  const border = (t: string) => {
    if (t === 'red') return 'border-red-400 text-red-300 hover:bg-red-400 hover:text-white';
    if (t === 'yellow') return 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-900';
    return 'border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-slate-900';
  };

  const emoji = (t: string, condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('gun') || c.includes('bleed') || c.includes('wound')) return '🩸';
    if (c.includes('fall') || c.includes('head') || c.includes('trauma')) return '🤕';
    if (c.includes('ankle') || c.includes('sprain') || c.includes('fracture')) return '🦵';
    if (c.includes('asthma') || c.includes('breath') || c.includes('chest')) return '🫁';
    if (t === 'red') return '🩸';
    if (t === 'yellow') return '🤕';
    return '💚';
  };

  const accept = async (id: number, name: string) => {
    setBusyId(id);
    try {
      await api.put('/api/patients', {
        id,
        department: 'ER',
        status: 'critical',
      });
      await api.post('/api/activities', {
        message: `${name} accepted from triage → ER`,
        icon: 'heart-pulse',
        color: 'text-rose-400',
      });
      await Promise.all([refreshPatients(), refreshActivities(), refreshMetrics()]);
      showToast(`${name} assigned to ER team`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Accept failed');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <HeartPulse className="h-9 w-9 text-rose-400" />
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-3xl font-semibold text-white sm:text-4xl">Triage Center</span>
            <span className="rounded-3xl bg-rose-500 px-3 py-1 text-xs text-white">
              {display.length} waiting
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-5 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-400" />
            Green - {green}
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            Yellow - {yellow}
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            Red - {red}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {display.map((p) => (
          <div key={p.id} className="rounded-3xl bg-slate-900 p-6">
            <div className={`mb-4 w-fit rounded-3xl px-4 py-1 text-xs uppercase ${badge(p.triage)}`}>
              {p.triage}
            </div>
            <div className="flex items-start gap-4">
              <div className="text-4xl">{emoji(p.triage, p.condition)}</div>
              <div className="flex-1">
                <div className="font-semibold text-white">{p.name}</div>
                <div className="text-xs text-slate-400">
                  {p.condition} • {p.age}yo
                </div>
                <div className="mt-1 font-mono text-[10px] text-slate-500">{p.vitals}</div>
                {p.department === 'ER' && p.status === 'critical' && p.triage === 'red' ? (
                  <div className="mt-5 inline-flex items-center gap-2 rounded-3xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-400">
                    <Check className="h-3.5 w-3.5" /> ASSIGNED
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={busyId === p.id}
                    onClick={() => accept(p.id, p.name)}
                    className={`mt-5 rounded-3xl border px-5 py-2.5 text-xs transition disabled:opacity-50 ${border(p.triage)}`}
                  >
                    {busyId === p.id ? '…' : 'ACCEPT CASE'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {display.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500">Triage queue is empty</div>
        )}
      </div>
    </div>
  );
}
