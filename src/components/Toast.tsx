import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [message, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10 }}
          onClick={onClose}
          className="fixed bottom-6 right-6 z-[1000] flex cursor-pointer items-center gap-3 rounded-3xl border border-yellow-400 bg-slate-800 px-6 py-3 text-sm text-yellow-300 shadow-2xl"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{message}</span>
          <X className="h-3.5 w-3.5 opacity-60" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
