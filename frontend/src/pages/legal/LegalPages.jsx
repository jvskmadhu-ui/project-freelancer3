import React from 'react';
import { ShieldCheck, Lock, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-display font-extrabold text-white">Privacy & KYC Data Protection Policy</h1>
        <p className="text-xs text-slate-400">Last updated: August 18, 2026</p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">1. Information We Collect</h2>
          <p>
            FreelanceHub 3D collects standard contact details (name, email, phone number), profile information, and encrypted identification documents (Passport, National ID, Driver's License) strictly to facilitate identity verification (KYC) and prevent marketplace fraud.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. Document Encryption & Zero Public Exposure</h2>
          <p>
            All submitted identity documents are stored in private cloud storage buckets protected by AES-256 encryption at rest and TLS 1.3 in transit. Government ID documents are never publicly exposed or shared with other platform participants.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">3. Payment & Financial Data</h2>
          <p>
            FreelanceHub does not store full credit card numbers, CVVs, or UPI PINs. All payment processing is securely delegated to certified Level 1 PCI-DSS payment gateways including Stripe and Razorpay.
          </p>
        </section>
      </div>
    </div>
  );
};

export const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-display font-extrabold text-white">Terms of Service & Escrow Agreement</h1>
        <p className="text-xs text-slate-400">Last updated: August 18, 2026</p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">1. Marketplace Role & Relationship</h2>
          <p>
            FreelanceHub 3D acts as a neutral platform facilitating contracts between independent client entities and freelance contractors. Contractors retain independent status and are not employees of the platform or the client.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. Mandatory Escrow Milestones</h2>
          <p>
            All contracts operate through milestone-based escrow. Work commences only once milestone funds are deposited. Funds are released exclusively upon client approval or arbitrated dispute resolution.
          </p>
        </section>
      </div>
    </div>
  );
};

export const RefundPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-display font-extrabold text-white">Escrow Dispute & Refund Policy</h1>
        <p className="text-xs text-slate-400">Last updated: August 18, 2026</p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">1. Pre-Release Escrow Refunds</h2>
          <p>
            Clients may request an escrow refund for any pending, unstarted milestone prior to work submission. If work has commenced or deliverables are submitted, the dispute arbitration process will be engaged.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. Neutral Dispute Arbitration</h2>
          <p>
            In the event of quality or scope disagreement, either party may open a dispute case. Our Compliance Arbitration Team reviews contract specs, deliverables, and communication logs to make a final binding resolution (full refund, partial split, or release).
          </p>
        </section>
      </div>
    </div>
  );
};
