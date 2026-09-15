import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';
import { useApp } from '../../contexts/AppContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AdmitPatientModal({ open, onClose }: Props) {
  const { showToast, refreshPatients, refreshMetrics, refreshActivities } = useApp();
  const [name, setName] = useState('');
  const [age, setAge] = useState('34');
  const [gender, setGender] = useState('F');
  const [complaint, setComplaint] = useState('');
  const [triage, setTriage] = useState('yellow');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setName('');
    setAge('34');
    setGender('F');
    setComplaint('');
    setTriage('yellow');
    setError('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Patient name is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const status = triage === 'red' ? 'critical' : 'stable';
      const hr = triage === 'red' ? 120 : triage === 'yellow' ? 95 : 78;
      const o2 = triage === 'red' ? 88 : triage === 'yellow' ? 94 : 98;
      const bp = triage === 'red' ? '90/55' : triage === 'yellow' ? '130/85' : '118/76';
      await api.post('/api/patients', {
        name: name.trim(),
        age: parseInt(age, 10) || 30,
        gender,
        condition: complaint.trim() || 'Evaluation',
        department: 'ER',
        vitals: `BP ${bp} • HR ${hr}`,
        heart_rate: hr,
        bp,
        o2,
        status,
        triage,
      });
      await Promise.all([refreshPatients(), refreshMetrics(), refreshActivities()]);
      showToast(`${name.trim()} admitted successfully`);
      handleClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to admit patient');
    } finally {
      setSaving(false);
    }
  };

  const pills = [
    { id: 'red', label: 'RED', active: 'border-2 border-red-500 bg-red-500/10 text-red-400', idle: 'border border-red-500/40 text-red-400' },
    { id: 'yellow', label: 'YELLOW', active: 'border-2 border-yellow-400 bg-yellow-400/10 text-yellow-400', idle: 'border border-yellow-400/40 text-yellow-400' },
    { id: 'green', label: 'GREEN', active: 'border-2 border-emerald-400 bg-emerald-400/10 text-emerald-400', idle: 'border border-emerald-400/40 text-emerald-400' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-slate-900 shadow-2xl"
          >
            <div className="flex items-center border-b border-slate-700 px-6 pb-4 pt-5 sm:px-8">
              <span className="text-xl font-semibold text-white">New Patient Admission</span>
              <button type="button" onClick={handleClose} className="ml-auto text-slate-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-5 p-6 sm:p-8">
              {error && (
                <div className="rounded-2xl bg-rose-500/10 px-4 py-2 text-sm text-rose-400">{error}</div>
              )}
              <div>
                <label className="mb-2 block text-xs text-slate-400">FULL NAME</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Patient full name"
                  className="h-12 w-full rounded-3xl border border-slate-600 bg-slate-800 px-5 text-white outline-none focus:border-yellow-400"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-slate-400">AGE • GENDER</label>
                  <div className="flex gap-3">
                    <input
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="h-12 w-full rounded-3xl border border-slate-600 bg-slate-800 px-5 text-white outline-none focus:border-yellow-400"
                    />
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="h-12 w-full rounded-3xl border border-slate-600 bg-slate-800 px-4 text-white outline-none focus:border-yellow-400"
                    >
                      <option value="F">Female</option>
                      <option value="M">Male</option>
                      <option value="O">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs text-slate-400">CHIEF COMPLAINT</label>
                  <input
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    placeholder="e.g. Chest pain"
                    className="h-12 w-full rounded-3xl border border-slate-600 bg-slate-800 px-5 text-white outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-xs text-slate-400">TRIAGE LEVEL</label>
                <div className="flex gap-2">
                  {pills.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setTriage(p.id)}
                      className={`flex-1 rounded-3xl py-3.5 text-center text-sm font-medium transition ${
                        triage === p.id ? p.active : p.idle
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t border-slate-700 px-6 py-5 sm:px-8">
              <button
                type="button"
                onClick={handleClose}
                className="h-12 flex-1 rounded-3xl text-sm font-medium text-slate-400 transition hover:bg-slate-800"
              >
                CANCEL
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="h-12 flex-1 rounded-3xl bg-white text-sm font-semibold text-slate-900 transition hover:bg-amber-300 disabled:opacity-60"
              >
                {saving ? 'ADMITTING…' : 'ADMIT TO ER'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
