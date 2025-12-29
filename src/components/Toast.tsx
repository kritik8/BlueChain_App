import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const iconMap = {
  success: <CheckCircle className="w-5 h-5 text-success" />,
  error: <XCircle className="w-5 h-5 text-destructive" />,
  info: <Info className="w-5 h-5 text-info" />,
  warning: <AlertTriangle className="w-5 h-5 text-warning" />,
};

const bgMap = {
  success: 'bg-success-light border-success/30',
  error: 'bg-destructive/10 border-destructive/30',
  info: 'bg-info-light border-info/30',
  warning: 'bg-warning-light border-warning/30',
};

const Toast: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="absolute top-16 left-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg ${bgMap[toast.type]}`}
          >
            {iconMap[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{toast.message}</p>
              {toast.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
