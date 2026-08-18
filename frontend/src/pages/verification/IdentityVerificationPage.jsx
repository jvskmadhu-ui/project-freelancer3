import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import VerificationBadge from '../../components/VerificationBadge';
import api from '../../services/api';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileText,
  Lock,
  ArrowRight,
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';

const IdentityVerificationPage = () => {
  const { user, markIdentityVerified } = useAuth();
  const { showToast } = useNotification();

  const [docType, setDocType] = useState('PASSPORT'); // PASSPORT, NATIONAL_ID, DRIVERS_LICENSE, TAX_ID
  const [docNumber, setDocNumber] = useState('USA-87654321');
  const [docFrontUrl, setDocFrontUrl] = useState('https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isVerified = user?.identityVerified;
  const isEmailDone = user?.emailVerified !== false;
  const isPhoneDone = user?.phoneVerified !== false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/verification/submit', {
        documentType: docType,
        documentNumber: docNumber,
        documentFrontUrl: docFrontUrl
      });
      setSubmitted(true);
      showToast('Document Submitted', 'Your identity document has been submitted for review.', 'info');
    } catch (err) {
      setSubmitted(true);
      showToast('Document Submitted (Demo Mode)', 'Simulating verification review queue.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantApprovalDemo = () => {
    markIdentityVerified();
    showToast('Verified Badge Awarded!', 'Your profile now displays the Verified Talent badge.', 'success');
  };

  const steps = [
    { num: 1, title: 'Account Created', status: 'COMPLETED', desc: 'Registered on FreelanceHub 3D' },
    { num: 2, title: 'Email Verified', status: isEmailDone ? 'COMPLETED' : 'PENDING', desc: 'Confirmed via 6-digit OTP' },
    { num: 3, title: 'Phone Verified', status: isPhoneDone ? 'COMPLETED' : 'PENDING', desc: 'SMS security verification active' },
    { num: 4, title: 'Profile Completed', status: 'COMPLETED', desc: 'Bio, skills, rates, and portfolio configured' },
    { num: 5, title: 'Identity Document Submitted', status: isVerified || submitted ? 'COMPLETED' : 'CURRENT', desc: 'Government issued photo ID / Passport' },
    { num: 6, title: 'Compliance & Admin Review', status: isVerified ? 'COMPLETED' : submitted ? 'CURRENT' : 'PENDING', desc: 'Audit trail and document validation' },
    { num: 7, title: 'Verified Badge Issued', status: isVerified ? 'COMPLETED' : 'PENDING', desc: 'Platform trust badge displayed across platform' },
    { num: 8, title: 'Annual Re-Authentication', status: 'PENDING', desc: 'Continuous security audit' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
          <ShieldCheck className="w-4 h-4" /> 8-Step Trust & Safety Verification
        </div>
        <h1 className="text-3xl font-display font-extrabold text-white">Identity Verification Center</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Obtain the official <strong className="text-emerald-400">VERIFIED</strong> badge on your profile. Verified users enjoy 3x more proposal visibility, instant escrow payouts, and priority support.
        </p>
      </div>

      {/* Verification Status Banner */}
      {isVerified ? (
        <div className="p-6 bg-gradient-to-r from-emerald-950/70 via-dark-800 to-emerald-950/70 rounded-2xl border border-emerald-500/40 shadow-glow-emerald flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h3 className="text-base font-bold text-white">Identity Fully Verified</h3>
                <VerificationBadge verified={true} size="md" />
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Your passport/national ID credentials have been authenticated. Your profile is trusted worldwide.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-primary-950/40 rounded-2xl border border-primary-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary-400 shrink-0" />
            <div className="text-xs text-slate-200">
              <strong className="text-white">Testing Demo Option:</strong> You can submit the KYC document form below or immediately simulate compliance approval.
            </div>
          </div>
          <button
            onClick={handleInstantApprovalDemo}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-glow-emerald shrink-0 transition"
          >
            Simulate Instant Admin Approval
          </button>
        </div>
      )}

      {/* 8-Step Tracker Progress */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Verification Pipeline Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s) => {
            const isDone = s.status === 'COMPLETED';
            const isCurr = s.status === 'CURRENT';

            return (
              <div
                key={s.num}
                className={`p-4 rounded-xl border transition ${isDone ? 'bg-emerald-950/30 border-emerald-500/30' : isCurr ? 'bg-primary-950/40 border-primary-500/40 shadow-glow' : 'bg-dark-900/40 border-white/5 opacity-60'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-slate-400">STEP 0{s.num}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurr ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-ping" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-dark-600" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-white">{s.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* KYC Document Submission Form */}
      {!isVerified && (
        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <FileText className="w-5 h-5 text-primary-400" />
            <h3 className="text-base font-bold text-white">Step 5: Submit Identification Document</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Document Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
              >
                <option value="PASSPORT">Passport (International)</option>
                <option value="NATIONAL_ID">National Identity Card</option>
                <option value="DRIVERS_LICENSE">Driver's License</option>
                <option value="TAX_ID">Tax / Corporate ID</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Document ID Number</label>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
                placeholder="A12345678"
                required
              />
            </div>
          </div>

          {/* Secure Document Preview / Mock Upload */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Encrypted ID Document Photo</label>
            <div className="p-4 bg-dark-900/80 border border-dashed border-white/20 rounded-xl text-center space-y-3">
              <img
                src={docFrontUrl}
                alt="Document Front Preview"
                className="w-48 h-28 object-cover rounded-lg mx-auto border border-white/10 shadow-md"
              />
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>AES-256 Encrypted document storage. Never shared publicly.</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || submitted}
            className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : submitted ? (
              <>Submitted for Compliance Review <CheckCircle2 className="w-4 h-4 text-emerald-400" /></>
            ) : (
              <>Submit Document for Review <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default IdentityVerificationPage;
