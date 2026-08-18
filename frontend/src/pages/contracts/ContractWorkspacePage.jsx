import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import VerificationBadge from '../../components/VerificationBadge';
import Modal from '../../components/Modal';
import PaymentModal from '../../components/PaymentModal';
import api from '../../services/api';
import {
  Briefcase,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Lock,
  UploadCloud,
  FileCheck,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Plus
} from 'lucide-react';

const ContractWorkspacePage = () => {
  const { id } = useParams();
  const { isClient, isFreelancer, user } = useAuth();
  const { showToast, addNotification } = useNotification();

  const [contract, setContract] = useState({
    id: 1,
    title: "Next-Gen 3D Interactive Metaverse Showcase",
    clientName: "Sarah Jenkins",
    clientCompany: "TechCorp Ventures",
    clientAvatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    freelancerId: 3,
    freelancerName: "Elena Vance",
    freelancerAvatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    totalAmount: 4500.00,
    paidAmount: 1500.00,
    escrowAmount: 3000.00,
    status: "ACTIVE",
    startDate: "2026-08-12",
    endDate: "2026-09-02"
  });

  const [milestones, setMilestones] = useState([
    {
      id: 1,
      title: "Milestone 1: 3D Scene Architecture & Asset Shaders",
      description: "Setup Three.js canvas, lighting, camera controls, and custom procedural shaders.",
      amount: 1500.00,
      milestoneOrder: 1,
      dueDate: "2026-08-16",
      status: "PAID",
      submissionNotes: "Completed 3D scene architecture, particle systems, and shader pipelines.",
      deliverablesUrl: "https://github.com/techcorp/3d-scene-v1"
    },
    {
      id: 2,
      title: "Milestone 2: Interactive Animations & Scroll Reactivity",
      description: "Implement smooth camera panning, hover interactivity, and state transitions.",
      amount: 1500.00,
      milestoneOrder: 2,
      dueDate: "2026-08-25",
      status: "IN_PROGRESS",
      submissionNotes: null,
      deliverablesUrl: null
    },
    {
      id: 3,
      title: "Milestone 3: Final Polish, Mobile Optimization & Delivery",
      description: "LOD optimizations, responsive canvas scaling, and deployment.",
      amount: 1500.00,
      milestoneOrder: 3,
      dueDate: "2026-09-02",
      status: "PENDING",
      submissionNotes: null,
      deliverablesUrl: null
    }
  ]);

  // Submission modal state
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(2);
  const [submissionNotes, setSubmissionNotes] = useState("Completed high-performance camera panning and touch orbit controls running 60fps.");
  const [deliverablesUrl, setDeliverablesUrl] = useState("https://github.com/techcorp/3d-scene-v2");

  // Payment modal state
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [fundMilestone, setFundMilestone] = useState(null);

  const handleSubmitDeliverable = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/milestones/${selectedMilestoneId}/submit`, {
        submissionNotes,
        deliverablesUrl
      });
    } catch (err) {
      console.warn('Milestone submission API fallback used');
    }

    setMilestones(prev => prev.map(m => m.id === selectedMilestoneId ? {
      ...m,
      status: 'SUBMITTED',
      submissionNotes,
      deliverablesUrl
    } : m));

    setSubmitModalOpen(false);
    showToast('Work Submitted for Review', 'The client has been notified to inspect your deliverables.', 'success');
  };

  const handleApproveMilestone = async (mId, amount) => {
    try {
      await api.post(`/milestones/${mId}/approve`);
    } catch (err) {
      console.warn('Milestone approval API fallback used');
    }

    setMilestones(prev => prev.map(m => m.id === mId ? { ...m, status: 'PAID' } : m));
    setContract(prev => ({
      ...prev,
      paidAmount: prev.paidAmount + amount,
      escrowAmount: Math.max(0, prev.escrowAmount - amount)
    }));

    showToast('Milestone Approved & Paid!', `$${amount} released from escrow to the freelancer.`, 'success');
    addNotification({
      title: 'Funds Released',
      message: `Released $${amount} for completed milestone.`,
      type: 'PAYMENT_SUCCESS',
      linkUrl: `/contracts/${contract.id}`
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Workspace Bar */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                ACTIVE CONTRACT #{contract.id}
              </span>
              <span className="text-xs text-slate-400">Timeline: {contract.startDate} to {contract.endDate}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              {contract.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/chat?partner=${contract.freelancerId}`}
              className="px-4 py-2.5 glass-panel hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 transition"
            >
              <MessageSquare className="w-4 h-4 text-accent-cyan" /> Contract Chat
            </Link>
            <Link
              to="/disputes"
              className="px-4 py-2.5 bg-rose-950/60 hover:bg-rose-900 text-rose-400 rounded-xl text-xs font-bold border border-rose-500/30 transition flex items-center gap-1.5"
            >
              <AlertCircle className="w-4 h-4" /> Raise Dispute
            </Link>
          </div>
        </div>

        {/* Contract Financial Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="p-4 bg-dark-900/80 rounded-2xl border border-white/5 space-y-1">
            <span className="text-xs text-slate-400 block">Total Contract Value</span>
            <span className="text-2xl font-display font-extrabold text-white">${contract.totalAmount.toFixed(2)}</span>
          </div>

          <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 space-y-1">
            <span className="text-xs text-emerald-400 font-semibold block">Released to Freelancer</span>
            <span className="text-2xl font-display font-extrabold text-emerald-400">${contract.paidAmount.toFixed(2)}</span>
          </div>

          <div className="p-4 bg-primary-950/40 rounded-2xl border border-primary-500/30 space-y-1">
            <span className="text-xs text-primary-300 font-semibold block">Protected in Escrow</span>
            <span className="text-2xl font-display font-extrabold text-white">${contract.escrowAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Milestones Flow Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white font-display">Milestone Escrow Workflow</h2>
            <p className="text-xs text-slate-400 mt-0.5">Track work submission, review deliverables, and release protected funds.</p>
          </div>
        </div>

        <div className="space-y-4">
          {milestones.map((m) => (
            <div
              key={m.id}
              className={`p-5 rounded-2xl border transition ${m.status === 'PAID' ? 'bg-emerald-950/20 border-emerald-500/30' : m.status === 'SUBMITTED' ? 'bg-primary-950/30 border-primary-500/40 shadow-glow' : 'bg-dark-900/60 border-white/10'}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-400">PHASE 0{m.milestoneOrder}</span>
                    <h3 className="text-sm font-bold text-white">{m.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${m.status === 'PAID' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : m.status === 'SUBMITTED' ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40' : m.status === 'IN_PROGRESS' ? 'bg-primary-950 text-primary-300 border border-primary-500/30' : 'bg-dark-700 text-slate-400'}`}>
                      {m.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{m.description}</p>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-6 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10">
                  <div className="text-left lg:text-right">
                    <span className="text-xs text-slate-400 block">Amount</span>
                    <span className="text-lg font-bold font-display text-white">${m.amount.toFixed(2)}</span>
                  </div>

                  {/* Actions according to role and milestone status */}
                  <div className="flex items-center gap-2">
                    {/* Status: SUBMITTED -> Client can inspect and approve */}
                    {m.status === 'SUBMITTED' && isClient && (
                      <button
                        onClick={() => handleApproveMilestone(m.id, m.amount)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-glow-emerald flex items-center gap-1.5 transition"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve & Release ${m.amount}
                      </button>
                    )}

                    {/* Status: IN_PROGRESS -> Freelancer can submit work */}
                    {m.status === 'IN_PROGRESS' && isFreelancer && (
                      <button
                        onClick={() => {
                          setSelectedMilestoneId(m.id);
                          setSubmitModalOpen(true);
                        }}
                        className="px-4 py-2 bg-accent-cyan hover:bg-cyan-400 text-dark-900 rounded-xl text-xs font-bold shadow-glow-cyan flex items-center gap-1.5 transition"
                      >
                        <UploadCloud className="w-4 h-4" /> Submit Work Deliverables
                      </button>
                    )}

                    {/* Status: PENDING -> Client can fund in escrow */}
                    {m.status === 'PENDING' && isClient && (
                      <button
                        onClick={() => {
                          setFundMilestone(m);
                          setPayModalOpen(true);
                        }}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold shadow-glow flex items-center gap-1.5 transition"
                      >
                        <Lock className="w-3.5 h-3.5" /> Fund ${m.amount} in Escrow
                      </button>
                    )}

                    {/* Status: PAID */}
                    {m.status === 'PAID' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4" /> Paid & Released
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Deliverable submission notes if present */}
              {m.submissionNotes && (
                <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-300">
                  <div>
                    <strong className="text-white">Submission Notes:</strong> {m.submissionNotes}
                  </div>
                  {m.deliverablesUrl && (
                    <a
                      href={m.deliverablesUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent-cyan hover:underline flex items-center gap-1 font-semibold shrink-0"
                    >
                      Inspect Deliverables <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Freelancer Submit Work Deliverable Modal */}
      <Modal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title="Submit Milestone Deliverables"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmitDeliverable} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Deliverables Link / Repository / Drive URL *</label>
            <input
              type="url"
              value={deliverablesUrl}
              onChange={(e) => setDeliverablesUrl(e.target.value)}
              className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Work Description & Release Notes *</label>
            <textarea
              rows="4"
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-primary-500 leading-relaxed"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-accent-cyan hover:bg-cyan-400 text-dark-900 rounded-xl font-bold text-xs shadow-glow-cyan flex items-center justify-center gap-2 transition"
          >
            Confirm & Send to Client for Review <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </Modal>

      {/* Escrow Deposit Modal */}
      {fundMilestone && (
        <PaymentModal
          isOpen={payModalOpen}
          onClose={() => setPayModalOpen(false)}
          contractId={contract.id}
          milestoneId={fundMilestone.id}
          amount={fundMilestone.amount}
          projectTitle={contract.title}
          milestoneTitle={fundMilestone.title}
          onPaymentSuccess={() => {
            setMilestones(prev => prev.map(m => m.id === fundMilestone.id ? { ...m, status: 'IN_PROGRESS' } : m));
            setContract(prev => ({ ...prev, escrowAmount: prev.escrowAmount + fundMilestone.amount }));
            setPayModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ContractWorkspacePage;
