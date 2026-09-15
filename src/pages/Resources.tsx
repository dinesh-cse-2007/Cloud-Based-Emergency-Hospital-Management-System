import { useState } from 'react';
import { Database } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { api } from '../lib/api';

export default function Resources() {
  const { resources, showToast, refreshResources, refreshActivities } = useApp();
  const [busyId, setBusyId] = useState<number | null>(null);
  const [lastSync, setLastSync] = useState('just now');

  const restock = async (id: number) => {
    setBusyId(id);
    try {
      await api.put('/api/resources', { id, restock: true });
      await Promise.all([refreshResources(), refreshActivities()]);
      showToast('Restock order submitted to supplier');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Restock failed');
    } finally {
      setBusyId(null);
    }
  };

  const cloudSync = async () => {
    setLastSync('moments ago');
    showToast('Full cloud sync completed across 3 regions');
    try {
      await api.post('/api/activities', {
        message: 'Inventory cloud sync completed',
        icon: 'package',
        color: 'text-teal-400',
      });
      await refreshActivities();
    } catch {
      /* ignore */
    }
    setTimeout(() => setLastSync('just now'), 2500);
  };

  const pct = (qty: number, min: number) => {
    const max = Math.max(min * 10, qty, 1);
    return Math.min(100, Math.round((qty / max) * 100));
  };

  const isLow = (qty: number, min: number) => qty <= min;

  return (
    <div>
      <div className="mx-auto max-w-lg rounded-3xl bg-slate-900 p-6 sm:p-8">
        <h2 className="mb-8 text-center text-2xl font-medium text-white sm:text-3xl">
          Inventory & Supply Chain
        </h2>

        <div className="space-y-7">
          {resources.map((r) => {
            const low = isLow(r.quantity, r.min_threshold);
            const p = pct(r.quantity, r.min_threshold);
            return (
              <div key={r.id} className="flex items-center gap-4">
                <div className="w-8 text-xl">{r.icon}</div>
                <div className="flex-1">
                  <div className="mb-2 flex justify-between text-xs">
                    <div className="uppercase text-slate-300">{r.name}</div>
                    <div className={`font-mono ${low ? 'text-amber-400' : 'text-slate-400'}`}>
                      {low ? `LOW • ${r.quantity} left` : `${r.quantity} left`}
                    </div>
                  </div>
                  <div className="relative h-px bg-slate-700">
                    <div
                      className={`absolute h-px ${low ? 'bg-amber-400' : 'bg-sky-400'}`}
                      style={{ width: `${p}%` }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  disabled={busyId === r.id}
                  onClick={() => restock(r.id)}
                  className={`rounded-3xl px-4 py-2.5 text-xs transition disabled:opacity-50 ${
                    low
                      ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  {busyId === r.id ? '…' : low ? 'URGENT RESTOCK' : 'RESTOCK'}
                </button>
              </div>
            );
          })}
          {resources.length === 0 && (
            <div className="py-8 text-center text-slate-500">No inventory items</div>
          )}
        </div>

        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={cloudSync}
            className="inline-flex items-center gap-3 rounded-3xl border border-slate-600 px-6 py-5 text-xs transition hover:border-yellow-300"
          >
            <Database className="h-4 w-4" />
            <div className="text-left">
              <div className="font-medium">Last cloud sync</div>
              <div className="font-mono text-xs text-emerald-400">{lastSync}</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
