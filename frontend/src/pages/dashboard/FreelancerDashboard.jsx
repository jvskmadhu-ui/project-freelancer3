import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import VerificationBadge from '../../components/VerificationBadge';
import RatingStars from '../../components/RatingStars';
import { mockContracts } from '../../services/mockData';
import {
  DollarSign,
  Briefcase,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Send
} from 'lucide-react';

const FreelancerDashboard = () => {
  const { user } = useAuth();

  const metrics = [
    { label: "Total Net Earnings", value: "$6,200.00", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-950/60 border-emerald-500/30" },
    { label: "Active Contracts", value: "1", icon: Briefcase, color: "text-accent-cyan", bg: "bg-cyan-950/60 border-cyan-500/30" },
    { label: "Client Rating", value: "5.0 / 5.0", icon: Star, color: "text-amber-400", bg: "bg-amber-950/60 border-amber-500/30" },
    { label: "Completed Projects", value: "48", icon: CheckCircle2, color: "text-primary-400", bg: "bg-primary-950/60 border-primary-500/30" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel rounded-2xl border border-white/10">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'}
            alt="Freelancer Avatar"
            className="w-14 h-14 rounded-2xl object-cover border border-accent-cyan/40 shadow-glow-cyan"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-display text-white">Welcome back, {user?.fullName || 'Elena'}</h1>
              <VerificationBadge verified={user?.identityVerified !== false} size="sm" />
            </div>
            <p className="text-xs text-primary-300 mt-0.5">Lead 3D WebGL & Three.js Creative Technologist • $85/hr</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/projects"
            className="px-4 py-2.5 bg-accent-cyan hover:bg-cyan-400 text-dark-900 rounded-xl text-xs font-bold shadow-glow-cyan flex items-center gap-2 transition"
          >
            <Send className="w-4 h-4" /> Browse & Bid Projects
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

      {/* Active Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-display">Active Contracts & Milestones</h2>
            <Link to="/projects" className="text-xs font-bold text-accent-cyan hover:underline">
              Search New Projects
            </Link>
          </div>

          <div className="space-y-4">
            {mockContracts.map((c) => (
              <div key={c.id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Escrow Funded: $3,000.00</span>
                    <h3 className="text-base font-bold text-white">{c.title}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total Earnings</span>
                    <span className="text-base font-bold text-white">${c.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.clientAvatarUrl}
                      alt={c.clientName}
                      className="w-9 h-9 rounded-xl object-cover border border-white/10"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">{c.clientName}</span>
                      <span className="text-[11px] text-slate-400">TechCorp Ventures</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/chat?partner=${c.clientId}`}
                      className="p-2 glass-panel rounded-xl text-slate-300 hover:text-white text-xs"
                      title="Direct Chat"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/contracts/${c.id}`}
                      className="px-3.5 py-1.5 bg-accent-cyan hover:bg-cyan-400 text-dark-900 rounded-xl text-xs font-bold shadow-glow-cyan transition"
                    >
                      Submit Milestone Work
                    </Link>
                  </div>
                </div>

                {/* Milestone 2 in Progress */}
                <div className="p-3.5 bg-primary-950/40 border border-primary-500/30 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white">Current Target: Milestone 2</span>
                    <p className="text-[11px] text-slate-300">Interactive Animations & Scroll Reactivity ($1,500.00)</p>
                  </div>
                  <Link
                    to={`/contracts/${c.id}`}
                    className="px-3 py-1 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-xs font-semibold shadow-glow"
                  >
                    Submit Deliverable
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Reputation & Verification Box */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white font-display">Reputation & Verification</h2>
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Verified Talent Badge</span>
                <span className="text-[11px] text-emerald-400 font-semibold">Active & Authenticated ✓</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your profile is verified. You have 99% job success score with 42 verified client reviews.
            </p>
            <div className="pt-2">
              <Link
                to={`/freelancers/1`}
                className="w-full py-2.5 glass-panel hover:bg-dark-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                View Public Profile Preview
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
