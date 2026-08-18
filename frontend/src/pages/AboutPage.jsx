import React from 'react';
import { ShieldCheck, Lock, Globe2, Sparkles, Award, CheckCircle2, HeartHandshake } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-xs font-semibold text-primary-300">
          <Sparkles className="w-3.5 h-3.5 text-accent-cyan" /> Our Mission & Values
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          Pioneering the Future of <span className="gradient-text">Verified Freelance Work</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          FreelanceHub 3D was founded to eliminate fraud, ghosting, and substandard quality from the global gig economy. We combine mandatory KYC verification, bank-grade milestone escrow, real-time messaging, and spatial 3D experiences.
        </p>
      </div>

      {/* 4 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-white">100% Identity Verification (KYC)</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every freelancer and client undergoes an 8-step verification process, validating official passport/national IDs and contact channels. Unverified accounts cannot bid or hire.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary-950 border border-primary-500/30 flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Guaranteed Escrow Protection</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Milestone funds are deposited into secure third-party escrow prior to work beginning. Funds are only released upon explicit client sign-off or mediated arbitration.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center">
            <Globe2 className="w-5 h-5 text-accent-cyan" />
          </div>
          <h3 className="text-lg font-bold text-white">Global Transparent Collaboration</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Supporting clients and talent across 120+ countries with Stripe and Razorpay integrations, multi-currency conversion, and fair dispute mediation rules.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Fair Dispute Arbitration</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Neutral compliance specialists review milestone deliverables, contract specifications, and message logs to ensure both clients and freelancers are treated justly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
