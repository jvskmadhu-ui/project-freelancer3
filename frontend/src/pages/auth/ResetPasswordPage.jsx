import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle2, ArrowRight, RefreshCw, KeyRound, Eye, EyeOff, ShieldAlert, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import PasswordStrengthMeter, { calculatePasswordStrength } from '../../components/PasswordStrengthMeter';
import { useNotification } from '../../context/NotificationContext';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [identifier, setIdentifier] = useState(searchParams.get('email') || searchParams.get('identifier') || '');
  const [resetToken, setResetToken] = useState(searchParams.get('token') || '');
  const [otp, setOtp] = useState(searchParams.get('otp') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [invalidateAllSessions, setInvalidateAllSessions] = useState(true);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);

    const strength = calculatePasswordStrength(newPassword);
    if (!strength.isValid) {
      setError('Password must satisfy all security standards (8+ chars, upper, lower, number, special character).');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        identifier: identifier.trim(),
        resetToken: resetToken.trim() || undefined,
        otp: otp.trim() || undefined,
        newPassword,
        confirmPassword,
        invalidateAllSessions,
      });

      setSuccess(true);
      showToast('Password Reset Complete', 'Your credentials have been updated securely.', 'success');
      setTimeout(() => {
        navigate('/client/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed. Please ensure your reset token or OTP code is valid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary-600/20 border border-primary-500/40 flex items-center justify-center mx-auto shadow-glow">
            <KeyRound className="w-6 h-6 text-primary-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">Create New Password</h1>
          <p className="text-xs text-slate-400">Set a high-security password for your FreelanceHub account.</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {success ? (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Password Updated Successfully</h3>
              <p className="text-xs text-slate-300 mt-1">Previous tokens invalidated. Redirecting to login...</p>
            </div>
            <Link
              to="/client/login"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-xs shadow-glow transition"
            >
              Sign In Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Registered Email or Phone</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-dark-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
                placeholder="name@example.com"
                required
              />
            </div>

            {!resetToken && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">6-Digit Reset OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-dark-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono tracking-widest text-white focus:outline-none focus:border-primary-500"
                  placeholder="123456"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-dark-900/80 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
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

              {/* Password Strength Meter */}
              <PasswordStrengthMeter password={newPassword} />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-dark-900/80 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-[11px] text-rose-400 mt-1">Passwords do not match.</p>
              )}
            </div>

            <div className="pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={invalidateAllSessions}
                  onChange={(e) => setInvalidateAllSessions(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-white/20 bg-dark-900 text-primary-600 focus:ring-0 accent-primary-500"
                />
                <span>Log out of all other active devices</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !calculatePasswordStrength(newPassword).isValid || newPassword !== confirmPassword}
              className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition disabled:opacity-50 mt-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Update Password <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        )}

        <div className="text-center text-xs text-slate-400">
          Remember your password?{' '}
          <Link to="/client/login" className="font-bold text-primary-400 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
