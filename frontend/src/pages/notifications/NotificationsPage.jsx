import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  DollarSign,
  MessageSquare,
  ShieldCheck,
  Briefcase,
  AlertCircle
} from 'lucide-react';

const NotificationsPage = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case 'PAYMENT_SUCCESS':
        return <DollarSign className="w-5 h-5 text-emerald-400" />;
      case 'NEW_PROPOSAL':
      case 'PROPOSAL_ACCEPTED':
        return <Briefcase className="w-5 h-5 text-primary-400" />;
      case 'NEW_MESSAGE':
        return <MessageSquare className="w-5 h-5 text-accent-cyan" />;
      case 'VERIFICATION':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'DISPUTE_OPENED':
      case 'DISPUTE_RESOLVED':
        return <AlertCircle className="w-5 h-5 text-rose-400" />;
      default:
        return <Bell className="w-5 h-5 text-primary-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Bell className="w-4 h-4" /> Activity Feed
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white">Notifications Center</h1>
        </div>

        <button
          onClick={markAllAsRead}
          className="px-3.5 py-2 glass-panel hover:bg-dark-700 text-xs font-semibold text-slate-300 hover:text-white rounded-xl transition flex items-center gap-1.5"
        >
          <CheckCheck className="w-4 h-4 text-emerald-400" /> Mark All as Read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markAsRead(n.id)}
            className={`p-4 sm:p-5 rounded-2xl border transition flex items-start justify-between gap-4 cursor-pointer ${n.isRead ? 'glass-panel bg-dark-900/40 border-white/5 opacity-80' : 'bg-primary-950/30 border-primary-500/30 shadow-glow'}`}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-dark-900 border border-white/10 flex items-center justify-center shrink-0">
                {getIcon(n.type)}
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">{n.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-400 block pt-1">
                  {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                </span>
              </div>
            </div>

            {n.linkUrl && (
              <Link
                to={n.linkUrl}
                className="px-3 py-1.5 bg-dark-800 hover:bg-dark-700 text-primary-300 rounded-lg text-xs font-semibold shrink-0 transition"
              >
                View Details
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
