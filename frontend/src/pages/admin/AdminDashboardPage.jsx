import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import VerificationBadge from '../../components/VerificationBadge';
import Modal from '../../components/Modal';
import {
  Shield,
  Users,
  Briefcase,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Lock,
  Search,
  ArrowRight,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { showToast } = useNotification();

  const [stats, setStats] = useState({
    totalUsers: 124,
    totalClients: 42,
    totalFreelancers: 82,
    verifiedUsers: 68,
    pendingKYCCount: 1,
    totalProjects: 36,
    activeProjects: 12,
    completedProjects: 24,
    openDisputesCount: 1,
    totalVolume: 78500.00,
    escrowInHold: 14250.00
  });

  const [kycQueue, setKycQueue] = useState([
    {
      id: 1,
      userId: 7,
      userName: "David Okafor",
      userEmail: "david@freelancehub.com",
      userRole: "ROLE_FREELANCER",
      documentType: "PASSPORT",
      documentNumber: "A09876543",
      documentFrontUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
      status: "PENDING",
      submittedAt: "2026-08-16T10:00:00"
    }
  ]);

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('Document photo is blurry or unreadable.');

  const handleApproveKYC = (docId) => {
    setKycQueue(prev => prev.filter(k => k.id !== docId));
    setStats(prev => ({
      ...prev,
      verifiedUsers: prev.verifiedUsers + 1,
      pendingKYCCount: Math.max(0, prev.pendingKYCCount - 1)
    }));
    showToast('KYC Approved!', 'User has been awarded the Verified Badge.', 'success');
  };

  const handleRejectKYC = (docId) => {
    setKycQueue(prev => prev.filter(k => k.id !== docId));
    setStats(prev => ({
      ...prev,
      pendingKYCCount: Math.max(0, prev.pendingKYCCount - 1)
    }));
    setRejectModalOpen(false);
    showToast('KYC Rejected', `User notified: ${rejectReason}`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-2xl border border-purple-500/30 bg-purple-950/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Platform Administration Console</h1>
            <p className="text-xs text-slate-300">Governance, KYC compliance verification, and dispute arbitration.</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-900/60 border border-purple-500/40 text-purple-300">
          ADMIN PRIVILEGES ACTIVE
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 glass-panel rounded-2xl border border-white/10 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Registered Users</span>
          <span className="text-2xl font-display font-extrabold text-white block">{stats.totalUsers}</span>
        </div>
        <div className="p-5 glass-panel rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-1">
          <span className="text-xs text-emerald-400 font-medium">KYC Verified Accounts</span>
          <span className="text-2xl font-display font-extrabold text-emerald-400 block">{stats.verifiedUsers}</span>
        </div>
        <div className="p-5 glass-panel rounded-2xl border border-primary-500/30 bg-primary-950/20 space-y-1">
          <span className="text-xs text-primary-300 font-medium">Total Platform Volume</span>
          <span className="text-2xl font-display font-extrabold text-white block">${stats.totalVolume.toLocaleString()}</span>
        </div>
        <div className="p-5 glass-panel rounded-2xl border border-amber-500/30 bg-amber-950/20 space-y-1">
          <span className="text-xs text-amber-400 font-medium">Active Escrow Locked</span>
          <span className="text-2xl font-display font-extrabold text-amber-400 block">${stats.escrowInHold.toLocaleString()}</span>
        </div>
      </div>

      {/* KYC Compliance Review Queue */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent-cyan" /> Pending KYC Verification Queue
            </h2>
            <p className="text-xs text-slate-400">Review official identification documents submitted by users.</p>
          </div>
          <span className="px-2.5 py-0.5 bg-accent-cyan/20 text-accent-cyan rounded-full text-xs font-bold">
            {kycQueue.length} Pending
          </span>
        </div>

        {kycQueue.length > 0 ? (
          <div className="space-y-4">
            {kycQueue.map((doc) => (
              <div key={doc.id} className="p-5 bg-dark-900/80 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <img
                    src={doc.documentFrontUrl}
                    alt="ID Document"
                    className="w-28 h-20 rounded-xl object-cover border border-white/20 shadow-md cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedDoc(doc)}
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{doc.userName}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-dark-800 text-slate-300 border border-white/10">
                        {doc.userRole.replace('ROLE_', '')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{doc.userEmail}</p>
                    <div className="text-[11px] text-accent-cyan font-mono">
                      Type: {doc.documentType} • ID Number: {doc.documentNumber}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <button
                    onClick={() => {
                      setSelectedDoc(doc);
                      setRejectModalOpen(true);
                    }}
                    className="px-4 py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-400 rounded-xl text-xs font-bold border border-rose-500/30 transition flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button
                    onClick={() => handleApproveKYC(doc.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-glow-emerald transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve & Verify
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-xs text-slate-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p>All KYC document submissions have been processed.</p>
          </div>
        )}
      </div>

      {/* Rejection Reason Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject KYC Submission"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Rejection Reason</label>
            <textarea
              rows="3"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 glass-panel text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => handleRejectKYC(selectedDoc?.id)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboardPage;
