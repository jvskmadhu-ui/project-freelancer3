import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockFreelancers } from '../../services/mockData';
import VerificationBadge from '../../components/VerificationBadge';
import RatingStars from '../../components/RatingStars';
import PaymentModal from '../../components/PaymentModal';
import {
  MapPin,
  Clock,
  Globe2,
  DollarSign,
  Briefcase,
  Star,
  CheckCircle2,
  MessageSquare,
  Award,
  ExternalLink,
  ShieldCheck,
  Send,
  Zap
} from 'lucide-react';

const FreelancerProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const freelancer = mockFreelancers.find(f => f.id === Number(id)) || mockFreelancers[0];
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Profile Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <img
              src={freelancer.avatarUrl}
              alt={freelancer.fullName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-primary-500/40 shadow-glow"
            />
            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                  {freelancer.fullName}
                </h1>
                <VerificationBadge verified={freelancer.identityVerified} size="md" />
              </div>
              <p className="text-sm font-semibold text-primary-300">{freelancer.title}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-accent-cyan" /> {freelancer.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-accent-cyan" /> {freelancer.timezone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-accent-cyan" /> {freelancer.languages || 'English (Fluent)'}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs & Rates */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
            <div className="text-center lg:text-right">
              <span className="text-xs text-slate-400 block">Hourly Rate</span>
              <span className="text-3xl font-display font-extrabold text-white">
                ${freelancer.hourlyRate}
                <span className="text-xs text-slate-400 font-normal"> / hour</span>
              </span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                to={`/chat?partner=${freelancer.userId || 3}`}
                className="p-3 glass-panel rounded-xl text-slate-200 hover:text-white flex items-center justify-center shadow-sm"
                title="Open Direct Chat"
              >
                <MessageSquare className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="flex-1 sm:flex-initial px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs shadow-glow transition flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-accent-cyan" /> Hire & Open Contract
              </button>
            </div>
          </div>
        </div>

        {/* Badges / Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-center">
          <div className="p-3 bg-dark-900/60 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 block">Overall Rating</span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <RatingStars rating={freelancer.rating} />
            </div>
          </div>
          <div className="p-3 bg-dark-900/60 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 block">Completed Projects</span>
            <span className="text-base font-bold text-white">{freelancer.completedProjectsCount} jobs</span>
          </div>
          <div className="p-3 bg-dark-900/60 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 block">Job Success Score</span>
            <span className="text-base font-bold text-emerald-400">{freelancer.successRate}%</span>
          </div>
          <div className="p-3 bg-dark-900/60 rounded-xl border border-white/5">
            <span className="text-[11px] text-slate-400 block">Response Time</span>
            <span className="text-base font-bold text-accent-cyan">&lt; {freelancer.responseTimeHours || 1} hour</span>
          </div>
        </div>
      </div>

      {/* 2. Main Profile Content (About, Portfolio, Skills, Reviews) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-base font-bold text-white font-display">About the Professional</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {freelancer.overview}
            </p>
          </div>

          {/* Portfolio Showcase Gallery */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white font-display">Featured 3D & Web Portfolio</h2>
              <span className="text-xs text-slate-400">{freelancer.portfolioItems?.length || 2} projects</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(freelancer.portfolioItems || []).map((p) => (
                <div key={p.id} className="bg-dark-900/80 rounded-xl border border-white/10 overflow-hidden group">
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80" />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                      {p.projectUrl && (
                        <a href={p.projectUrl} target="_blank" rel="noreferrer" className="text-accent-cyan hover:underline text-[11px] flex items-center gap-1">
                          Live <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2">{p.description}</p>
                    <span className="text-[10px] text-primary-300 block">{p.tags}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Reviews Section */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white font-display">Verified Client Reviews (42)</h2>
              <RatingStars rating={freelancer.rating} />
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-dark-900/60 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&auto=format&fit=crop&q=80"
                      alt="Reviewer"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Sarah Jenkins (TechCorp Ventures)</span>
                      <span className="text-[10px] text-slate-400">Next-Gen 3D Interactive Metaverse Showcase</span>
                    </div>
                  </div>
                  <RatingStars rating={5.0} />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "Elena is in a league of her own when it comes to Three.js and custom GLSL WebGL shaders. She delivered all milestones well ahead of schedule and the 60fps performance on mobile is phenomenal!"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Details */}
        <div className="space-y-6">
          {/* Skills & Technologies */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white font-display">Skills & Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {freelancer.skills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-dark-800 text-primary-300 border border-primary-500/20 shadow-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Verification Shield Card */}
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-xs font-bold uppercase tracking-wider">FreelanceHub Verified</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This freelancer's government passport, email, phone number, and skills have been authenticated by FreelanceHub Compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Hire & Escrow Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        contractId={1}
        milestoneId={1}
        amount={1500.00}
        projectTitle="Direct Hire Contract"
        milestoneTitle="Initial Project Milestone"
        onPaymentSuccess={() => {
          setPaymentModalOpen(false);
          navigate('/contracts/1');
        }}
      />
    </div>
  );
};

export default FreelancerProfilePage;
