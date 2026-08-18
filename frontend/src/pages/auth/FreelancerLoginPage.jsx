import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Lock, Mail, ArrowRight, RefreshCw, Zap } from 'lucide-react';

const FreelancerLoginPage = () => {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('elena@freelancehub.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/freelancer/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo('FREELANCER');
    navigate('/freelancer/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-accent-cyan/40 flex items-center justify-center mx-auto shadow-glow-cyan">
            <Zap className="w-6 h-6 text-accent-cyan" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">Freelancer Portal Login</h1>
          <p className="text-xs text-slate-400">Manage your proposals, active contracts, portfolio, and escrow earnings.</p>
        </div>

        {/* 1-Click Demo Freelancer Box */}
        <div className="p-3.5 bg-cyan-950/40 rounded-xl border border-accent-cyan/30 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-white">Verified Freelancer Demo</p>
            <p className="text-[11px] text-slate-400">Elena Vance (3D WebGL Artist)</p>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="px-3 py-1.5 bg-accent-cyan hover:bg-cyan-400 text-dark-900 rounded-lg text-xs font-bold shadow-glow-cyan transition"
          >
            1-Click Demo Login
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/80 border border-rose-500/30 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Freelancer Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
                placeholder="elena@freelancehub.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-accent-cyan hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent-cyan hover:bg-cyan-400 text-dark-900 rounded-xl font-bold text-xs shadow-glow-cyan flex items-center justify-center gap-2 transition disabled:opacity-50 mt-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Sign In to Freelancer Portal <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="text-center space-y-2 text-xs text-slate-400">
          <p>
            New to FreelanceHub?{' '}
            <Link to="/freelancer/register" className="font-bold text-accent-cyan hover:underline">
              Apply as Freelancer
            </Link>
          </p>
          <p>
            Are you a client?{' '}
            <Link to="/client/login" className="text-primary-400 font-semibold hover:underline">
              Client Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FreelancerLoginPage;
