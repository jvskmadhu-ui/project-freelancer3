import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Lock, Mail, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

const ClientLoginPage = () => {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('client@techcorp.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo('CLIENT');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary-600/20 border border-primary-500/40 flex items-center justify-center mx-auto shadow-glow">
            <Briefcase className="w-6 h-6 text-primary-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">Client Portal Login</h1>
          <p className="text-xs text-slate-400">Access your projects, proposals, contracts, and escrow payments.</p>
        </div>

        {/* 1-Click Demo Client Quick Login Box */}
        <div className="p-3.5 bg-primary-950/40 rounded-xl border border-primary-500/30 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-white">Instant Demo Account</p>
            <p className="text-[11px] text-slate-400">Pre-loaded with projects & contracts</p>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-xs font-bold shadow-glow transition"
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
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Business Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                placeholder="sarah@techcorp.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-primary-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition disabled:opacity-50 mt-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Sign In to Client Portal <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="text-center space-y-2 text-xs text-slate-400">
          <p>
            Don't have a client account?{' '}
            <Link to="/client/register" className="font-bold text-primary-400 hover:underline">
              Create Client Account
            </Link>
          </p>
          <p>
            Are you a freelancer?{' '}
            <Link to="/freelancer/login" className="text-accent-cyan font-semibold hover:underline">
              Freelancer Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientLoginPage;
