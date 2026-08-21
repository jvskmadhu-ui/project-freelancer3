import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Lock, Mail, ArrowRight, RefreshCw, Zap, Eye, EyeOff, HelpCircle, ShieldAlert } from 'lucide-react';

const FreelancerLoginPage = () => {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('elena@freelancehub.com');
  const [password, setPassword] = useState('Password123!');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(identifier, password, rememberMe);
      navigate('/freelancer/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your email/phone and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo('FREELANCER');
    navigate('/freelancer/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-accent-cyan/40 flex items-center justify-center mx-auto shadow-glow-cyan">
            <Zap className="w-6 h-6 text-accent-cyan" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">Login as Freelancer</h1>
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
          <div className="p-3.5 bg-rose-950/80 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p>{error}</p>
              {error.toLowerCase().includes('lock') && (
                <Link to="/account-recovery" className="text-[11px] font-bold text-cyan-300 underline block">
                  Click here to unlock or recover your account →
                </Link>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email / Phone</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-dark-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
                placeholder="elena@freelancehub.com or +15559876543"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-accent-cyan hover:underline font-medium">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-900/80 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
                placeholder="••••••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Account Recovery Link */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-white/20 bg-dark-900 text-cyan-600 focus:ring-0 accent-accent-cyan"
              />
              <span>Remember me</span>
            </label>
            <Link to="/account-recovery" className="text-[11px] text-slate-400 hover:text-accent-cyan flex items-center gap-1">
              <HelpCircle className="w-3 h-3" /> Account Recovery
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent-cyan hover:bg-cyan-400 text-dark-900 rounded-xl font-bold text-xs shadow-glow-cyan flex items-center justify-center gap-2 transition disabled:opacity-50 mt-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Login <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="text-center space-y-2 text-xs text-slate-400">
          <p>
            New to FreelanceHub?{' '}
            <Link to="/freelancer/register" className="font-bold text-accent-cyan hover:underline">
              Apply as Freelancer
            </Link>
          </p>
          <p className="pt-2 border-t border-white/5">
            Are you a client?{' '}
            <Link to="/client/login" className="text-primary-400 font-semibold hover:underline">
              Login as Client
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FreelancerLoginPage;
