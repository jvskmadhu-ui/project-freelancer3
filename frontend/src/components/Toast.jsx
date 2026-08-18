import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toast } = useNotification();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-primary-400" />
  };

  const borders = {
    success: 'border-emerald-500/30 bg-emerald-950/80',
    error: 'border-rose-500/30 bg-rose-950/80',
    info: 'border-primary-500/30 bg-primary-950/80'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 glass-panel border px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md max-w-sm animate-in slide-in-from-bottom duration-300">
      {icons[toast.type] || icons.info}
      <div>
        <h5 className="text-xs font-bold text-white">{toast.title}</h5>
        <p className="text-xs text-slate-300 mt-0.5">{toast.message}</p>
      </div>
    </div>
  );
};

export default Toast;
