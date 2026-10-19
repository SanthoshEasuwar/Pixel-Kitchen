import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Copy, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info' | 'copied';
  colorHex?: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'copied', colorHex, onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-2.5 rounded-xl glass-panel-elevated border border-white/20 text-white shadow-2xl backdrop-blur-2xl"
          onClick={onClose}
        >
          {colorHex && (
            <span
              className="w-4 h-4 rounded-full shadow-inner ring-1 ring-white/30 shrink-0"
              style={{ backgroundColor: colorHex }}
            />
          )}
          {!colorHex && type === 'copied' && <Copy className="w-4 h-4 text-violet-400 shrink-0" />}
          {!colorHex && type === 'success' && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
          {!colorHex && type === 'info' && <Info className="w-4 h-4 text-cyan-400 shrink-0" />}
          
          <span className="text-xs font-medium tracking-wide text-slate-100">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
