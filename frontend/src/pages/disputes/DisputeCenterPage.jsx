import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import {
  AlertCircle,
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  Plus
} from 'lucide-react';

const DisputeCenterPage = () => {
  const { showToast } = useNotification();

  const [disputes, setDisputes] = useState([
    {
      id: 1,
      contractId: 1,
      contractTitle: "Next-Gen 3D Interactive Metaverse Showcase",
      initiatorName: "Sarah Jenkins (Client)",
      reason: "SCOPE_CREEP",
      description: "Need clarity on whether custom shader shaders for Android Chrome were included in Milestone 2.",
      status: "UNDER_REVIEW",
      createdAt: "2026-08-16T15:00:00",
      resolutionSummary: "FreelanceHub Mediation assigned senior 3D referee to review contract scope specification."
    }
  ]);

  const [openNew, setOpenNew] = useState(false);
  const [reason, setReason] = useState('QUALITY_BELOW_SPEC');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');

  const handleCreateDispute = async (e) => {
    e.preventDefault();
    const newDisp = {
      id: Date.now(),
      contractId: 1,
      contractTitle: "Next-Gen 3D Interactive Metaverse Showcase",
      initiatorName: "Current User",
      reason,
      description,
      status: "OPEN",
      createdAt: new Date().toISOString(),
      resolutionSummary: "Dispute recorded. Compliance team will review evidence within 24 hours."
    };

    setDisputes([newDisp, ...disputes]);
    setOpenNew(false);
    showToast('Dispute Case Opened', 'FreelanceHub Mediation has been notified.', 'info');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <AlertCircle className="w-4 h-4" /> Impartial Arbitration
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white">Dispute Resolution Center</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Fair, evidence-based dispute arbitration under platform escrow guarantees.
          </p>
        </div>

        <button
          onClick={() => setOpenNew(!openNew)}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-glow flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" /> Open New Dispute
        </button>
      </div>

      {openNew && (
        <form onSubmit={handleCreateDispute} className="glass-panel p-6 sm:p-8 rounded-2xl border border-rose-500/30 bg-rose-950/20 space-y-4">
          <h3 className="text-sm font-bold text-white">Initiate Dispute Arbitration</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Dispute Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="WORK_NOT_DELIVERED">Work Not Delivered</option>
                <option value="QUALITY_BELOW_SPEC">Quality Below Agreed Specification</option>
                <option value="UNRESPONSIVE_CLIENT">Unresponsive Client</option>
                <option value="PAYMENT_WITHHELD">Payment Withheld Unreasonably</option>
                <option value="SCOPE_CREEP">Scope Creep Disagreement</option>
                <option value="OTHER">Other Conflict</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Evidence Cloud / Document URL</label>
              <input
                type="url"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://drive.google.com/... or screenshot link"
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Detailed Explanation & Chronology</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what occurred, what was agreed upon, and how you would like this resolved..."
              className="w-full bg-dark-900 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-rose-500 leading-relaxed"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpenNew(false)}
              className="px-4 py-2 glass-panel text-slate-400 hover:text-white rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-glow"
            >
              Submit Dispute for Mediation
            </button>
          </div>
        </form>
      )}

      {/* Disputes Timeline List */}
      <div className="space-y-4">
        {disputes.map((d) => (
          <div key={d.id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div>
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">CASE #{d.id} • {d.reason.replace('_', ' ')}</span>
                <h3 className="text-base font-bold text-white">{d.contractTitle}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${d.status === 'RESOLVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'}`}>
                STATUS: {d.status.replace('_', ' ')}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{d.description}</p>

            {d.resolutionSummary && (
              <div className="p-3.5 bg-dark-900/80 rounded-xl border border-white/5 space-y-1">
                <span className="text-[11px] font-bold text-accent-cyan uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Compliance Officer Notes
                </span>
                <p className="text-xs text-slate-300">{d.resolutionSummary}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisputeCenterPage;
