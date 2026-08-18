import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Lock, Heart, Globe, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-900 border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-cyan p-0.5 shadow-glow">
                <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
                  <Layers className="w-4 h-4 text-primary-400" />
                </div>
              </div>
              <span className="font-display font-bold text-lg text-white">
                Freelance<span className="text-primary-400">Hub</span> 3D
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The premier Web3 & 3D freelance marketplace connecting rigorously verified talent with ambitious global clients under bank-grade escrow protection.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% KYC Verified Talent
              </span>
              <span className="flex items-center gap-1.5 text-xs text-primary-400 bg-primary-950/40 border border-primary-500/20 px-2.5 py-1 rounded-full">
                <Lock className="w-3.5 h-3.5" /> Milestone Escrow
              </span>
            </div>
          </div>

          {/* Col 2: For Clients */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">For Clients</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/freelancers" className="hover:text-white transition">Find Top Talent</Link></li>
              <li><Link to="/projects/create" className="hover:text-white transition">Post a Project</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition">Escrow Security</Link></li>
              <li><Link to="/client/register" className="hover:text-white transition">Enterprise Hiring</Link></li>
            </ul>
          </div>

          {/* Col 3: For Freelancers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">For Freelancers</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/projects" className="hover:text-white transition">Browse Projects</Link></li>
              <li><Link to="/verification" className="hover:text-white transition">Get Verified Badge</Link></li>
              <li><Link to="/freelancer/register" className="hover:text-white transition">Create Profile</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition">Payment Guarantees</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Legal & Support</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-white transition">About Platform</Link></li>
              <li><Link to="/disputes" className="hover:text-white transition">Dispute Resolution</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 FreelanceHub 3D Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" /> English (US)
            </span>
            <span>Zero-Tolerance Fraud Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
