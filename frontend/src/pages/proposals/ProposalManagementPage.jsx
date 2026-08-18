import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import VerificationBadge from '../../components/VerificationBadge';
import RatingStars from '../../components/RatingStars';
import api from '../../services/api';
import {
  CheckSquare,
  Users,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign,
  Clock
} from 'lucide-react';

const ProposalManagementPage = () => {
  const { isClient, isFreelancer } = useAuth();
  const { showToast, addNotification } = useNotification();
  const navigate = useNavigate();

  const [proposals, setProposals] = useState([
    {
      id: 1,
      projectId: 1,
      projectTitle: "Next-Gen 3D Interactive Metaverse Showcase",
      freelancerId: 3,
      freelancerName: "Elena Vance",
      freelancerTitle: "Lead 3D WebGL & Three.js Creative Technologist",
      freelancerAvatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      freelancerRating: 5.0,
      freelancerVerified: true,
      bidAmount: 4500.00,
      estimatedDays: 18,
      coverLetter: "Hi Sarah, I would love to build this 3D showcase for TechCorp! I have built dozens of WebGL experiences and custom GLSL shaders with 60fps mobile performance. Looking forward to collaborating.",
      status: "ACCEPTED",
      createdAt: "2026-08-11T09:12:00"
    },
    {
      id: 2,
      projectId: 1,
      projectTitle: "Next-Gen 3D Interactive Metaverse Showcase",
      freelancerId: 4,
      freelancerName: "Alex Chen",
      freelancerTitle: "Principal Full-Stack Architect",
      freelancerAvatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      freelancerRating: 4.9,
      freelancerVerified: true,
      bidAmount: 4800.00,
      estimatedDays: 20,
      coverLetter: "Experienced with WebGL and React Three Fiber rendering pipelines. Can guarantee smooth 60fps across iOS and Android.",
      status: "PENDING",
      createdAt: "2026-08-11T14:30:00"
    }
  ]);

  const handleAccept = async (propId) => {
    try {
      await api.post(`/proposals/${propId}/accept`);
    } catch (err) {
      console.warn('API proposal accept fallback used');
    }

    setProposals(prev => prev.map(p => p.id === propId ? { ...p, status: 'ACCEPTED' } : p));
    showToast('Proposal Accepted!', 'Contract generated and project workspace activated.', 'success');
    addNotification({
      title: 'Contract Created',
      message: 'You accepted the proposal. Please proceed to fund Milestone 1.',
      type: 'PROPOSAL_ACCEPTED',
      linkUrl: '/contracts/1'
    });
    navigate('/contracts/1');
  };

  const handleReject = async (propId) => {
    try {
      await api.post(`/proposals/${propId}/reject`);
    } catch (err) {
      console.warn('API proposal reject fallback used');
    }

    setProposals(prev => prev.map(p => p.id === propId ? { ...p, status: 'REJECTED' } : p));
    showToast('Proposal Rejected', 'The freelancer has been notified.', 'info');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-primary-400 text-xs font-bold uppercase tracking-wider mb-2">
          <CheckSquare className="w-4 h-4" /> Bids & Proposals
        </div>
        <h1 className="text-3xl font-display font-extrabold text-white">Proposal Evaluation Center</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Compare candidate proposals, review estimated turnaround times, and accept bids to generate binding contracts.
        </p>
      </div>

      {/* Proposals Comparison List */}
      <div className="space-y-6">
        {proposals.map((p) => (
          <div key={p.id} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <img
                  src={p.freelancerAvatarUrl}
                  alt={p.freelancerName}
                  className="w-14 h-14 rounded-2xl object-cover border border-primary-500/30 shadow-md"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-white">{p.freelancerName}</h3>
                    <VerificationBadge verified={p.freelancerVerified} size="sm" />
                  </div>
                  <p className="text-xs text-primary-300 font-medium">{p.freelancerTitle}</p>
                  <RatingStars rating={p.freelancerRating} />
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400 block">Proposed Price</span>
                <span className="text-2xl font-display font-extrabold text-emerald-400">
                  ${p.bidAmount.toFixed(2)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Est. Turnaround: {p.estimatedDays} days</span>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="p-4 bg-dark-900/60 rounded-xl border border-white/5 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Cover Letter</span>
              <p className="text-xs text-slate-200 leading-relaxed">{p.coverLetter}</p>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Proposal Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${p.status === 'ACCEPTED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : p.status === 'REJECTED' ? 'bg-rose-950 text-rose-400 border border-rose-500/30' : 'bg-primary-950 text-primary-400 border border-primary-500/30'}`}>
                  {p.status}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/chat?partner=${p.freelancerId}`}
                  className="p-2 glass-panel rounded-xl text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-semibold"
                >
                  <MessageSquare className="w-4 h-4" /> Message
                </Link>

                {p.status === 'PENDING' && isClient && (
                  <>
                    <button
                      onClick={() => handleReject(p.id)}
                      className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-400 rounded-xl text-xs font-bold border border-rose-500/30 transition flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                    <button
                      onClick={() => handleAccept(p.id)}
                      className="px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold shadow-glow transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Accept & Open Contract
                    </button>
                  </>
                )}

                {p.status === 'ACCEPTED' && (
                  <Link
                    to="/contracts/1"
                    className="px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold shadow-glow transition flex items-center gap-1.5"
                  >
                    Go to Contract Workspace <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProposalManagementPage;
