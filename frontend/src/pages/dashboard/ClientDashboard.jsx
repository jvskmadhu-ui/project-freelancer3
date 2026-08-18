import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import VerificationBadge from '../../components/VerificationBadge';
import { mockContracts, mockProjects } from '../../services/mockData';
import {
  Briefcase,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  MessageSquare,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useAuth();

  const metrics = [
    { label: "Active Contracts", value: "1", icon: Briefcase, color: "text-primary-400", bg: "bg-primary-950/60 border-primary-500/30" },
    { label: "Total Escrow Volume", value: "$48,500.00", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-950/60 border-emerald-500/30" },
    { label: "Pending Proposals", value: "3", icon: Users, color: "text-accent-cyan", bg: "bg-cyan-950/60 border-cyan-500/30" },
    { label: "Pending Milestones", value: "2", icon: Clock, color: "text-amber-400", bg: "bg-amber-950/60 border-amber-500/30" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel rounded-2xl border border-white/10">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
            alt="Client Avatar"
            className="w-14 h-14 rounded-2xl object-cover border border-primary-500/40 shadow-glow"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-display text-white">Welcome back, {user?.fullName || 'Sarah'}</h1>
              <VerificationBadge verified={user?.identityVerified !== false} size="sm" />
            </div>
            <p className="text-xs text-slate-300 mt-0.5">TechCorp Ventures • Client Account</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/projects/create"
            className="px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold shadow-glow flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Post New Project
          </Link>
          <Link
            to="/chat"
            className="p-2.5 glass-panel rounded-xl text-slate-300 hover:text-white transition"
            title="Messages"
          >
            <MessageSquare className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${m.bg} flex items-center justify-between`}>
            <div>
              <span className="text-xs text-slate-400 font-medium block">{m.label}</span>
              <span className="text-2xl font-display font-extrabold text-white mt-1 block">{m.value}</span>
            </div>
            <div className={`p-3 rounded-xl bg-dark-900/80 border border-white/10 ${m.color}`}>
              <m.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Active Contracts & Milestones Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-display">Active Project Workspaces</h2>
            <Link to="/proposals" className="text-xs font-bold text-primary-400 hover:underline">
              View All Proposals (3)
            </Link>
          </div>

          <div className="space-y-4">
            {mockContracts.map((c) => (
              <div key={c.id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[11px] font-bold text-accent-cyan uppercase tracking-wider">Contract #{c.id} • Active</span>
                    <h3 className="text-base font-bold text-white">{c.title}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total Budget</span>
                    <span className="text-base font-bold text-white">${c.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Hired Freelancer info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.freelancerAvatarUrl}
                      alt={c.freelancerName}
                      className="w-9 h-9 rounded-xl object-cover border border-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{c.freelancerName}</span>
                        <VerificationBadge verified={true} size="sm" showLabel={false} />
                      </div>
                      <span className="text-[11px] text-slate-400">Lead 3D Artist</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/chat?partner=${c.freelancerId}`}
                      className="p-2 glass-panel rounded-xl text-slate-300 hover:text-white text-xs"
                      title="Direct Chat"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/contracts/${c.id}`}
                      className="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold shadow-glow transition"
                    >
                      Workspace & Milestones
                    </Link>
                  </div>
                </div>

                {/* Milestone Progress Mini Bar */}
                <div className="p-3 bg-dark-900/60 rounded-xl space-y-2 border border-white/5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Milestones: 1 Paid, 1 In Progress, 1 Pending</span>
                    <span className="text-emerald-400 font-bold">33% Completed</span>
                  </div>
                  <div className="w-full bg-dark-700 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full" style={{ width: '33.33%' }} />
                    <div className="bg-primary-500 h-full animate-pulse" style={{ width: '33.33%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Quick Actions & Escrow Overview */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white font-display">Escrow Protection</h2>
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Funds in Safe Escrow</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              $3,000.00 is currently held in escrow for upcoming milestones. Funds are only paid out after you review and explicitly approve deliverables.
            </p>
            <div className="pt-2">
              <Link
                to="/payments/history"
                className="w-full py-2.5 glass-panel hover:bg-dark-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <CreditCard className="w-4 h-4 text-amber-400" /> View Payment Ledger
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
