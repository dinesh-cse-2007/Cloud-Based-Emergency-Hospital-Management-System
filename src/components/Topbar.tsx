import { useEffect, useState } from 'react';
import { Menu, Search, Bell, Cloud, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuth();
  const { showToast, activities } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      let h = d.getHours();
      const m = d.getMinutes();
      h = h % 12 || 12;
      setTime(`${h}:${m < 10 ? '0' : ''}${m}`);
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  const email = user?.email || 'dr.maya@medcloud.io';
  const initials = email
    .split('@')[0]
    .split(/[._]/)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2) || 'MP';
  const displayName = email
    .split('@')[0]
    .replace(/[._]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    showToast(`Searching for "${query}"...`);
    navigate(`/patients?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="z-30 flex h-14 items-center justify-between border-b border-slate-700 bg-slate-900 px-4 sm:px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="text-slate-400 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <form onSubmit={handleSearch} className="relative w-48 sm:w-80">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search patients, incidents..."
            className="h-9 w-full rounded-3xl border border-slate-600 bg-slate-800 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-yellow-400"
          />
          <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
        </form>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <button
          type="button"
          onClick={() => showToast('Connected to AWS us-east-2. All services operational.')}
          className="hidden items-center gap-2 rounded-3xl bg-slate-800 px-3 py-1.5 text-xs hover:bg-slate-700 sm:flex"
        >
          <Cloud className="h-3.5 w-3.5 text-sky-400" />
          <span className="font-medium text-sky-300">AWS • us-east-2</span>
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        </button>

        <button
          type="button"
          onClick={() => showToast(activities[0]?.message || 'No new notifications')}
          className="relative text-slate-300 hover:text-white"
        >
          <Bell className="h-5 w-5" />
          {activities.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 font-mono text-[9px] text-white">
              {Math.min(activities.length, 9)}
            </span>
          )}
        </button>

        <div className="hidden items-center gap-2 rounded-3xl bg-slate-800 px-3 py-1 font-mono text-xs text-emerald-300 sm:flex">
          <Clock className="h-3 w-3" />
          <span>{time}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden text-right sm:block">
            <div className="text-sm font-medium text-white">{displayName}</div>
            <div className="-mt-0.5 text-[10px] text-emerald-400">Online</div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl border-2 border-slate-700 bg-violet-200 text-sm font-semibold text-violet-700">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
