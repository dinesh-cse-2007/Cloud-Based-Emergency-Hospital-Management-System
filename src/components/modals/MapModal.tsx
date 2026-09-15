import { X, MapPin, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MapModal({ open, onClose }: Props) {
  const { incidents, ambulances } = useApp();
  const active = incidents.filter((i) => i.status !== 'resolved');
  const moving = ambulances.find((a) => a.status === 'enroute' || a.status === 'on_mission');

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-[95%] max-w-5xl overflow-hidden rounded-3xl bg-slate-900"
          >
            <div className="flex h-14 items-center justify-between border-b border-slate-700 px-6 text-sm sm:px-8">
              <div className="flex items-center gap-4">
                <span className="font-medium text-white">LIVE CITY MAP</span>
                <span className="rounded-3xl bg-teal-400 px-4 py-1 text-xs text-slate-900">
                  {active.length} ACTIVE INCIDENTS
                </span>
              </div>
              <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="map-container relative flex h-80 items-center justify-center sm:h-96">
              <div className="absolute text-center text-white">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/30 bg-white/10 backdrop-blur-xl">
                  <MapPin className="h-8 w-8" />
                </div>
                <div className="text-xl font-light sm:text-2xl">Interactive geospatial layer</div>
                <div className="mx-auto mt-2 max-w-xs text-xs text-slate-400">
                  Real-time ambulance tracking, hospital capacity heat map and incident pins
                </div>
              </div>

              {moving && (
                <div className="absolute left-6 top-8 flex items-center gap-2 rounded-3xl bg-black/60 px-4 py-2 text-xs">
                  <Truck className="h-4 w-4 text-amber-400" />
                  <div className="font-medium">{moving.code}</div>
                  <div className="h-2 w-2 animate-ping rounded-full bg-green-400" />
                  <div className="text-emerald-400">MOVING</div>
                </div>
              )}

              <div className="absolute bottom-8 right-6 rounded-3xl bg-slate-800 px-6 py-3 text-xs shadow-2xl">
                <div className="mb-3 text-center font-medium text-amber-300">HOSPITAL ZONES</div>
                <div className="flex gap-5 text-[10px]">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-emerald-400" /> LOW
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-yellow-400" /> MED
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-red-400" /> HIGH
                  </div>
                </div>
              </div>

              {active.slice(0, 3).map((inc, i) => (
                <div
                  key={inc.id}
                  className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-500/50"
                  style={{ top: `${25 + i * 18}%`, left: `${20 + i * 22}%` }}
                  title={inc.title}
                >
                  <span className="text-[10px]">!</span>
                </div>
              ))}
            </div>

            <div className="flex h-14 items-center bg-slate-950 px-6 sm:px-8">
              <button
                type="button"
                onClick={onClose}
                className="ml-auto rounded-3xl border border-slate-300 px-8 py-2 text-xs font-medium"
              >
                CLOSE MAP
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
