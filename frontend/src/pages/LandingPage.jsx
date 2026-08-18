import React from 'react';
import { Link } from 'react-router-dom';
import HeroScene3D from '../components/3d/HeroScene3D';
import VerificationBadge from '../components/VerificationBadge';
import RatingStars from '../components/RatingStars';
import { mockFreelancers, mockProjects } from '../services/mockData';
import {
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  Briefcase,
  TrendingUp,
  Globe2,
  Star,
  Award
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION WITH THREE.JS 3D CANVAS */}
      <section className="relative pt-8 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 z-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 glass-panel border border-primary-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-primary-300">
                <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
                <span>Next-Generation Freelancer Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-tight">
                Connect. <br />
                <span className="gradient-text">Collaborate.</span> <br />
                <span className="gradient-text-cyan">Create in 3D.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                A trusted global platform connecting rigorously verified freelance professionals with forward-thinking clients under bank-grade milestone escrow.
              </p>

              {/* Primary Call to Actions */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/freelancers"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold text-sm shadow-glow flex items-center gap-2 transition transform hover:-translate-y-0.5"
                >
                  Find Top Talent <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/projects"
                  className="px-6 py-3.5 rounded-xl glass-panel text-slate-200 hover:text-white hover:border-primary-500/40 font-bold text-sm transition transform hover:-translate-y-0.5"
                >
                  Browse Projects
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-left">
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold font-display text-white">100%</h4>
                  <p className="text-xs text-slate-400">KYC Verified ID</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold font-display text-white">$0 Risk</h4>
                  <p className="text-xs text-slate-400">Escrow Protected</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold font-display text-white">4.9/5.0</h4>
                  <p className="text-xs text-slate-400">Client Rating</p>
                </div>
              </div>
            </div>

            {/* Right 3D Visualizer Canvas */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-accent-cyan rounded-3xl blur-2xl opacity-25" />
              <div className="relative glass-card rounded-2xl p-2 border border-white/10">
                <HeroScene3D />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TOP RATED VERIFIED FREELANCERS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-accent-cyan text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" /> Vetted Professionals
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Featured Verified Talent
            </h2>
          </div>
          <Link
            to="/freelancers"
            className="text-xs font-bold text-primary-400 hover:text-primary-300 flex items-center gap-1.5"
          >
            View all 500+ verified freelancers <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockFreelancers.slice(0, 3).map((f) => (
            <div
              key={f.id}
              className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10 space-y-4 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <img
                    src={f.avatarUrl}
                    alt={f.fullName}
                    className="w-14 h-14 rounded-2xl object-cover border border-primary-500/30 shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-white truncate">{f.fullName}</h3>
                      <VerificationBadge verified={f.identityVerified} size="sm" />
                    </div>
                    <p className="text-xs text-primary-300 font-medium truncate mt-0.5">{f.title}</p>
                    <div className="mt-1.5 flex items-center gap-3">
                      <RatingStars rating={f.rating} reviewsCount={f.totalReviewsCount} />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 mt-4 leading-relaxed">
                  {f.overview}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {f.skills.slice(0, 4).map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-dark-700 text-slate-300 border border-white/5"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Rate</span>
                  <span className="text-base font-bold text-white">${f.hourlyRate}<span className="text-xs text-slate-400">/hr</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/freelancers/${f.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-glow transition"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TRENDING CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Explore In-Demand Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Discover pre-vetted specialists in frontier technologies and creative disciplines.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "3D & WebGL", count: "128 jobs", icon: Sparkles, color: "text-accent-cyan" },
            { name: "Full-Stack Dev", count: "240 jobs", icon: Zap, color: "text-primary-400" },
            { name: "AI & GenAI", count: "95 jobs", icon: TrendingUp, color: "text-purple-400" },
            { name: "UI/UX Design", count: "160 jobs", icon: Award, color: "text-pink-400" },
            { name: "Mobile Flutter", count: "82 jobs", icon: Globe2, color: "text-emerald-400" },
            { name: "Cloud & DevOps", count: "110 jobs", icon: Lock, color: "text-amber-400" }
          ].map((cat, i) => (
            <Link
              key={i}
              to={`/projects?category=${encodeURIComponent(cat.name)}`}
              className="glass-panel glass-panel-hover p-4 rounded-2xl border border-white/10 text-center space-y-2 block"
            >
              <div className="w-10 h-10 rounded-xl bg-dark-800 border border-white/10 flex items-center justify-center mx-auto">
                <cat.icon className={`w-5 h-5 ${cat.color}`} />
              </div>
              <h4 className="text-xs font-bold text-white truncate">{cat.name}</h4>
              <p className="text-[11px] text-slate-400">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. PLATFORM PILLARS (VERIFIED KYC + ESCROW + WEBSOCKET CHAT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {/* Feature 1 */}
            <div className="space-y-3 p-4 rounded-2xl bg-dark-800/40 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-bold text-base text-white">8-Step KYC Verification</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Zero fake accounts. We authenticate official passport/government IDs and verify email and phone OTPs before awarding the Verified badge.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-3 p-4 rounded-2xl bg-dark-800/40 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-primary-950/80 border border-primary-500/30 flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="font-bold text-base text-white">Bank-Grade Milestone Escrow</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Clients fund milestones into secure escrow. Payments are released only when deliverables meet specification and you approve the work.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-3 p-4 rounded-2xl bg-dark-800/40 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent-cyan" />
              </div>
              <h3 className="font-bold text-base text-white">Real-Time WebSocket Workspace</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Live one-to-one STOMP chat, file document previews, instant typing signals, milestone tracking, and dispute arbitration in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-primary-900/60 via-dark-800 to-indigo-950/60 border border-primary-500/30 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
              Ready to hire verified talent or start earning?
            </h2>
            <p className="text-sm text-slate-300">
              Join thousands of clients and verified top-tier freelancers collaborating safely with 3D innovation on FreelanceHub.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/client/register"
                className="px-6 py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-sm shadow-glow transition"
              >
                Hire as Client
              </Link>
              <Link
                to="/freelancer/register"
                className="px-6 py-3.5 bg-accent-cyan hover:bg-cyan-400 text-dark-900 rounded-xl font-bold text-sm shadow-glow-cyan transition"
              >
                Apply as Freelancer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
