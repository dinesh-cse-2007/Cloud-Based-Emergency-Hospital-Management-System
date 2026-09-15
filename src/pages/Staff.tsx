import { useApp } from '../contexts/AppContext';
import { api } from '../lib/api';
import { Wifi } from 'lucide-react';

export default function Staff() {
  const { staff, showToast, refreshStaff, refreshActivities } = useApp();

  const statusStyle = (s: string) => {
    if (s === 'available') return 'bg-emerald-400 text-slate-900';
    if (s === 'busy') return 'bg-orange-400 text-white';
    if (s === 'on-call') return 'bg-yellow-400 text-slate-900';
    return 'bg-slate-600 text-white';
  };

  const contact = async (name: string, id: number, status: string) => {
    showToast(`Contacting ${name} via internal pager`);
    if (status === 'available') {
      try {
        await api.put('/api/staff', { id, status: 'busy' });
        await api.post('/api/activities', {
          message: `${name} assigned via pager`,
          icon: 'user-plus',
          color: 'text-violet-400',
        });
        await Promise.all([refreshStaff(), refreshActivities()]);
      } catch {
        /* toast already shown */
      }
    }
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-semibold text-white sm:text-4xl">
        On-Duty Personnel ({staff.length})
      </h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {staff.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => contact(s.name, s.id, s.status)}
            className="rounded-3xl border border-slate-700 bg-slate-900 p-6 text-left transition hover:border-slate-400"
          >
            <div className="flex justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-violet-500 text-lg font-semibold text-white">
                {s.avatar}
              </div>
              <span className={`h-fit rounded-3xl px-3 py-1 text-xs ${statusStyle(s.status)}`}>
                {s.status}
              </span>
            </div>
            <div className="mt-6">
              <div className="font-semibold text-white">{s.name}</div>
              <div className="text-xs text-slate-400">{s.role}</div>
              <div className="mt-1 text-[10px] text-slate-500">{s.department}</div>
            </div>
            <div className="mt-8 flex items-center gap-2 text-[10px] text-emerald-400">
              <Wifi className="h-3 w-3" />
              CONNECTED
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
