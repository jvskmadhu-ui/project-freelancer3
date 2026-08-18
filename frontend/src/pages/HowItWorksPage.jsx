import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileCheck, CheckCircle2, CreditCard, MessageSquare, Star, ArrowRight, UserCheck } from 'lucide-react';

const HowItWorksPage = () => {
  const [activeTab, setActiveTab] = useState('CLIENT'); // CLIENT or FREELANCER

  const clientSteps = [
    {
      step: 1,
      title: "Create Account & Verify Identity",
      desc: "Sign up in 30 seconds, complete email/phone verification, and obtain your verified client status."
    },
    {
      step: 2,
      title: "Post Your Project with Milestones",
      desc: "Specify your project requirements, scope, required skills, budget range, and milestone deliverable deadlines."
    },
    {
      step: 3,
      title: "Review Proposals & Chat in Real-Time",
      desc: "Receive competitive proposals from verified talent, compare portfolios, and message candidates directly."
    },
    {
      step: 4,
      title: "Fund Milestones into Secure Escrow",
      desc: "Deposit milestone amounts safely via Stripe or Razorpay. Money is securely protected until you approve the work."
    },
    {
      step: 5,
      title: "Approve Work & Rate Your Talent",
      desc: "Inspect submitted work deliverables. Upon satisfaction, release payment with one click and leave a verified review."
    }
  ];

  const freelancerSteps = [
    {
      step: 1,
      title: "Register & Submit KYC Documents",
      desc: "Create your freelancer account and upload your government ID/passport to receive the prestigious Verified badge."
    },
    {
      step: 2,
      title: "Build a High-Impact 3D Portfolio",
      desc: "Showcase your top skills, past experience, education, certifications, and live portfolio URLs."
    },
    {
      step: 3,
      title: "Submit Tailored Proposals",
      desc: "Browse relevant client projects and send custom cover letters, bid rates, and milestone timelines."
    },
    {
      step: 4,
      title: "Work with Guaranteed Escrow Payment",
      desc: "Never worry about non-payment. Work begins only after the client deposits funds into protected escrow."
    },
    {
      step: 5,
      title: "Submit Deliverables & Get Paid",
      desc: "Upload completed work, receive client approval, collect funds directly into your balance, and earn 5-star ratings."
    }
  ];

  const steps = activeTab === 'CLIENT' ? clientSteps : freelancerSteps;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
          How <span className="gradient-text">FreelanceHub 3D</span> Works
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          A seamless, transparent, and completely secure end-to-end workflow designed for modern clients and top-tier talent.
        </p>

        {/* Tab Toggle */}
        <div className="inline-flex p-1 rounded-xl bg-dark-800 border border-white/10 mt-4">
          <button
            onClick={() => setActiveTab('CLIENT')}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'CLIENT' ? 'bg-primary-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'}`}
          >
            For Clients (Hiring)
          </button>
          <button
            onClick={() => setActiveTab('FREELANCER')}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'FREELANCER' ? 'bg-accent-cyan text-dark-900 shadow-glow-cyan' : 'text-slate-400 hover:text-white'}`}
          >
            For Freelancers (Earning)
          </button>
        </div>
      </div>

      {/* Step by Step Timeline */}
      <div className="space-y-6 max-w-3xl mx-auto">
        {steps.map((s) => (
          <div key={s.step} className="glass-panel p-6 rounded-2xl border border-white/10 flex items-start gap-5">
            <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/40 flex items-center justify-center shrink-0 font-display font-extrabold text-primary-300 text-base shadow-glow">
              {s.step}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">{s.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="text-center pt-4">
        <Link
          to={activeTab === 'CLIENT' ? "/client/register" : "/freelancer/register"}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-sm shadow-glow transition"
        >
          {activeTab === 'CLIENT' ? "Get Started as a Client" : "Join as a Verified Freelancer"}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default HowItWorksPage;
