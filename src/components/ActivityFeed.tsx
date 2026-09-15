import {
  UserPlus,
  Truck,
  HeartPulse,
  Bell,
  Package,
  Info,
  UserCheck,
  ShieldAlert,
  Cloud,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { api, formatTime } from '../lib/api';

const iconMap: Record<string, typeof UserPlus> = {
  'user-plus': UserPlus,
  truck: Truck,
  'heart-pulse': HeartPulse,
  bell: Bell,
  package: Package,
  info: Info,
  'user-check': UserCheck,
  shield: ShieldAlert,
};

export default function ActivityFeed() {
  const { activities, showToast, refreshActivities, refreshAll } = useApp();

  const quickCommand = async (cmd: string) => {
    let message = '';
    let icon = 'info';
    let color = 'text-slate-300';
    if (cmd === 'code-blue') {
      message = 'CODE BLUE initiated across all ER stations';
      icon = 'heart-pulse';
      color = 'text-rose-400';
      showToast(message);
    } else if (cmd === 'discharge') {
      message = 'Patient discharge workflow started';
      icon = 'user-check';
      color = 'text-sky-400';
      showToast(message);
    } else if (cmd === 'lockdown') {
      message = 'LOCKDOWN protocol engaged. All entrances secured.';
      icon = 'shield';
      color = 'text-orange-400';
      showToast(message);
    }
    try {
      await api.post('/api/activities', { message, icon, color });
      await refreshActivities();
    } catch {
      /* toast already shown */
    }
  };

  return (
    <aside className="hidden w-80 flex-col border-l border-slate-700 bg-slate-900 xl:flex">
      <div className="flex items-center gap-2 border-b border-slate-700 px-5 py-5 text-xs font-medium">
        <span className="rounded bg-white px-2 py-px text-slate-900">LIVE</span>
        <span className="text-slate-400">ACTIVITY FEED</span>
      </div>

      <div className="flex-1 space-y-5 overflow-auto p-5 text-xs">
        {activities.length === 0 && (
          <div className="text-center text-slate-500">No activity yet</div>
        )}
        {activities.map((a) => {
          const Icon = iconMap[a.icon] || Info;
          return (
            <div key={a.id} className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-2xl bg-slate-700">
                <Icon className={`h-3 w-3 ${a.color || 'text-slate-300'}`} />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-light text-slate-400">{formatTime(a.created_at)}</div>
                <div className="mt-px leading-tight text-slate-200">{a.message}</div>
              </div>
            </div>
          );
        })}
        <div className="mt-2 text-center text-[10px] text-slate-500">— LIVE UPDATES ENABLED —</div>
      </div>

      <div className="border-t border-slate-700 p-5">
        <div className="mb-3 text-xs font-medium text-slate-400">QUICK COMMANDS</div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => quickCommand('discharge')}
            className="rounded-3xl bg-slate-800 px-3 py-1.5 text-[10px] transition hover:bg-slate-700"
          >
            DISCHARGE
          </button>
          <button
            type="button"
            onClick={() => quickCommand('code-blue')}
            className="rounded-3xl bg-red-500/10 px-3 py-1.5 text-[10px] text-red-400 transition hover:bg-red-500/20"
          >
            CODE BLUE
          </button>
          <button
            type="button"
            onClick={() => quickCommand('lockdown')}
            className="rounded-3xl bg-slate-800 px-3 py-1.5 text-[10px] transition hover:bg-slate-700"
          >
            LOCKDOWN
          </button>
          <button
            type="button"
            onClick={async () => {
              await refreshAll();
              showToast('Dashboard refreshed from cloud');
            }}
            className="rounded-3xl bg-slate-800 px-3 py-1.5 text-[10px] transition hover:bg-slate-700"
          >
            SYNC
          </button>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-center gap-2 border-t border-slate-700 bg-slate-950 px-6 py-4 text-[10px] text-slate-500">
        <Cloud className="h-3 w-3" />
        <span>POWERED BY AWS + SUPABASE</span>
      </div>
    </aside>
  );
}
