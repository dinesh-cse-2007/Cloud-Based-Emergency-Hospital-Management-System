import { useState } from 'react';
import { Bell, Ban, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';
import { useApp } from '../../contexts/AppContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function IncidentModal({ open, onClose }: Props) {
  const { showToast, refreshIncidents, refreshAmbulances, refreshActivities } = useApp();
  const [casualties, setCasualties] = useState('4');
  const [saving, setSaving] = useState(false);

  const handleDispatch = async () => {
    setSaving(true);
    try {
      await api.post('/api/incidents', {
        title: 'Multi-vehicle collision reported',
        description: 'Highway 101 • 3 vehicles involved',
        location: 'Highway 101 Downtown',
        severity: 'critical',
        casualties: parseInt(casualties, 10) || 4,
        eta_minutes: 6,
        status: 'dispatched',
      });
      await Promise.all([refreshIncidents(), refreshAmbulances(), refreshActivities()]);
      showToast('Emergency response dispatched to scene');
      onClose();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Dispatch failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-slate-900 p-8"
          >
            <div className="mb-2 text-sm font-medium tracking-wider text-rose-400">EMERGENCY ALERT</div>
            <div className="text-2xl font-semibold text-white sm:text-3xl">Multi-vehicle collision reported</div>
            <div className="mt-2 text-slate-400">Highway 101 • 3 vehicles involved • injured</div>

            <div className="my-8 rounded-3xl border border-slate-700 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Car className="h-10 w-10 text-orange-400" />
                  <div>
                    <div className="text-sm font-medium">Estimated casualties</div>
                    <input
                      type="text"
                      value={casualties}
                      onChange={(e) => setCasualties(e.target.value)}
                      className="w-16 bg-transparent font-mono text-4xl text-white outline-none"
                    />
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-emerald-400">RESPONDER ETA</div>
                  <div className="text-5xl font-light text-white">6</div>
                  <div className="-mt-1 text-xs text-slate-400">minutes</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs">
              <button
                type="button"
                disabled={saving}
                onClick={handleDispatch}
                className="flex w-28 flex-col items-center justify-center rounded-3xl bg-gradient-to-b from-red-500 to-rose-600 px-6 py-5 text-white transition active:scale-95 disabled:opacity-60"
              >
                <Bell className="mb-2 h-7 w-7" />
                <span className="font-semibold">{saving ? '…' : 'DISPATCH'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex w-28 flex-col items-center justify-center rounded-3xl border border-slate-300 px-6 py-5 text-slate-300 transition active:scale-95"
              >
                <Ban className="mb-2 h-7 w-7" />
                <span className="font-medium">IGNORE</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
