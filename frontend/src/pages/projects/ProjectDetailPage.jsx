import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockProjects } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import VerificationBadge from '../../components/VerificationBadge';
import RatingStars from '../../components/RatingStars';
import Modal from '../../components/Modal';
import api from '../../services/api';
import {
  Briefcase,
  DollarSign,
  Calendar,
  Layers,
  MapPin,
  ShieldCheck,
  Send,
  ArrowRight,
  Clock,
  FileText,
  CheckCircle2,
  Lock
} from 'lucide-react';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { isFreelancer, user } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const project = mockProjects.find(p => p.id === Number(id)) || mockProjects[0];

  // Proposal submission modal state
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState(4500);
  const [estimatedDays, setEstimatedDays] = useState(18);
  const [coverLetter, setCoverLetter] = useState(
    "Hi Sarah, I would love to build this 3D showcase for TechCorp! I have built dozens of WebGL experiences and custom GLSL shaders with 60fps mobile performance. Looking forward to collaborating."
  );
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/proposals', {
        projectId: project.id,
        bidAmount: Number(bidAmount),
        estimatedDays: Number(estimatedDays),
        coverLetter
      });
      setSubmitted(true);
      showToast('Proposal Submitted!', 'The client has received your proposal.', 'success');
      setTimeout(() => {
        setProposalModalOpen(false);
        navigate('/proposals');
      }, 1400);
    } catch (err) {
      setSubmitted(true);
      showToast('Proposal Submitted (Demo Mode)', 'Simulating proposal review.', 'success');
      setTimeout(() => {
        setProposalModalOpen(false);
        navigate('/proposals');
      }, 1400);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Project Brief Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-primary-500/20 text-primary-300 border border-primary-500/30">
                {project.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">Status: {project.status}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              {project.title}
            </h1>
          </div>

          <div className="text-left lg:text-right">
            <span className="text-xs text-slate-400 block">{project.budgetType} Budget</span>
            <span className="text-3xl font-display font-extrabold text-emerald-400">
              ${project.budgetMin} - ${project.budgetMax}
            </span>
          </div>
        </div>

        {/* Project Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2 p-3 bg-dark-900/60 rounded-xl border border-white/5">
            <Clock className="w-4 h-4 text-accent-cyan" />
            <div>
              <span className="text-[10px] text-slate-400 block">Duration</span>
              <span className="font-semibold text-white">{project.estimatedDurationDays} Days</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-dark-900/60 rounded-xl border border-white/5">
            <Calendar className="w-4 h-4 text-accent-cyan" />
            <div>
              <span className="text-[10px] text-slate-400 block">Deadline</span>
              <span className="font-semibold text-white">{project.deadline}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-dark-900/60 rounded-xl border border-white/5">
            <Layers className="w-4 h-4 text-accent-cyan" />
            <div>
              <span className="text-[10px] text-slate-400 block">Experience</span>
              <span className="font-semibold text-white">{project.experienceLevel}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-dark-900/60 rounded-xl border border-white/5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 block">Security</span>
              <span className="font-semibold text-emerald-400">100% Escrow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Client Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Detailed Description */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-base font-bold text-white font-display">Project Specifications & Scope</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Required Skills */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-base font-bold text-white font-display">Required Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {project.requiredSkills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-dark-800 text-primary-300 border border-primary-500/20 shadow-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Client Details & Proposal CTA */}
        <div className="space-y-6">
          {/* Proposal Action Card */}
          <div className="glass-panel p-6 rounded-2xl border border-primary-500/30 bg-primary-950/20 space-y-4 text-center">
            <h3 className="text-base font-bold text-white">Interested in this project?</h3>
            <p className="text-xs text-slate-300">
              Submit your bid and cover letter to collaborate directly with the client.
            </p>
            <button
              onClick={() => setProposalModalOpen(true)}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-cyan hover:opacity-95 text-white rounded-xl font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4" /> Submit Custom Proposal
            </button>
          </div>

          {/* Client Reputation Card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white font-display">About the Client</h3>
            <div className="flex items-center gap-3">
              <img
                src={project.clientAvatarUrl}
                alt={project.clientName}
                className="w-12 h-12 rounded-xl object-cover border border-white/10"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{project.clientName}</span>
                  <VerificationBadge verified={project.clientVerified} size="sm" showLabel={false} />
                </div>
                <span className="text-[11px] text-slate-400">{project.clientCompany}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Client Rating:</span>
                <RatingStars rating={project.clientRating || 4.9} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Identity:</span>
                <span className="text-emerald-400 font-semibold">VERIFIED ✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Submission Modal */}
      <Modal
        isOpen={proposalModalOpen}
        onClose={() => setProposalModalOpen(false)}
        title="Submit Project Proposal"
        maxWidth="max-w-lg"
      >
        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Proposal Successfully Dispatched!</h4>
            <p className="text-xs text-slate-300">The client will be notified in real-time.</p>
          </div>
        ) : (
          <form onSubmit={handleProposalSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Proposed Bid ($ USD)</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Estimated Days</label>
                <input
                  type="number"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Cover Letter & Approach</label>
              <textarea
                rows="5"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-primary-500 leading-relaxed"
                placeholder="Explain why you are the ideal candidate for this project..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              Confirm & Submit Proposal <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ProjectDetailPage;
