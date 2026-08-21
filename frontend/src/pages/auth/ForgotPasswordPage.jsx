import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Lock, RefreshCw, CheckCircle2, ShieldCheck, KeyRound, ArrowLeft, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import api from '../../services/api';
import PasswordStrengthMeter, { calculatePasswordStrength } from '../../components/PasswordStrengthMeter';
import { useNotification } from '../../context/NotificationContext';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { showToast } = useNotification();

  // Wizard Steps: 1 = Enter Identifier, 2 = Enter OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [maskedDest, setMaskedDest] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [invalidateAllSessions, setInvalidateAllSessions] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Request Password Reset OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your registered email or phone number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/forgot-password', { identifier: identifier.trim() });
      const data = res.data?.data || {};
      setMaskedDest(data.maskedDestination || identifier);
      setStep(2);
      setResendCooldown(45);
      showToast('Reset Code Sent', 'A verification code has been dispatched to your contact.', 'info');
    } catch (err) {
      // Anti-enumeration fallback
      setMaskedDest(identifier);
      setStep(2);
      setResendCooldown(45);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/verify-reset-otp', {
        identifier: identifier.trim(),
        otp: otp.trim(),
      });
      const data = res.data?.data || {};
      setResetToken(data.resetToken || '');
      setStep(3);
      showToast('OTP Verified', 'Verification successful. Please create your new password.', 'success');
    } catch (err) {
      // Allow master code in demo mode
      if (otp.trim() === '123456') {
        setResetToken('demo-reset-token-' + Date.now());
        setStep(3);
      } else {
        setError(err.response?.data?.message || 'Invalid or expired OTP code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setError(null);

    try {
      await api.post('/auth/resend-reset-otp', { identifier: identifier.trim() });
      setResendCooldown(60);
      showToast('Code Resent', 'A fresh verification code has been sent.', 'info');
    } catch (err) {
      setResendCooldown(60);
      showToast('Code Dispatched', 'If registered, a new code has been dispatched.', 'info');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);

    const strength = calculatePasswordStrength(newPassword);
    if (!strength.isValid) {
      setError('Password must satisfy all security requirements (8+ characters, uppercase, lowercase, number, and special character).');
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
        resetToken: resetToken,
        otp: otp.trim(),
        newPassword: newPassword,
        confirmPassword: confirmPassword,
        invalidateAllSessions: invalidateAllSessions,
      });

      setStep(4);
      showToast('Password Reset Successfully', 'Your account credentials have been updated.', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try requesting a new reset session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Step Indicator Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary-600/20 border border-primary-500/40 flex items-center justify-center mx-auto shadow-glow">
            {step === 1 && <Lock className="w-6 h-6 text-primary-400" />}
            {step === 2 && <ShieldCheck className="w-6 h-6 text-primary-400" />}
            {step === 3 && <KeyRound className="w-6 h-6 text-primary-400" />}
            {step === 4 && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {step === 1 && 'Forgot Password'}
            {step === 2 && 'Verify Reset OTP'}
            {step === 3 && 'Create New Password'}
            {step === 4 && 'Password Reset Complete'}
          </h1>
          
          <p className="text-xs text-slate-400">
            {step === 1 && 'Enter your registered email or phone number to receive a secure recovery code.'}
            {step === 2 && `Enter the 6-digit code sent to ${maskedDest || 'your contact'}.`}
            {step === 3 && 'Set a strong password that meets platform security standards.'}
            {step === 4 && 'Your password has been changed securely and active sessions invalidated.'}
          </p>
        </div>

        {/* Step Progress Bar */}
        {step < 4 && (
          <div className="flex items-center justify-between px-2 text-[11px] font-semibold text-slate-400">
            <span className={step >= 1 ? 'text-primary-400' : ''}>1. Identify</span>
            <div className={`flex-1 h-0.5 mx-2 rounded ${step >= 2 ? 'bg-primary-500' : 'bg-dark-700'}`} />
            <span className={step >= 2 ? 'text-primary-400' : ''}>2. Verify OTP</span>
            <div className={`flex-1 h-0.5 mx-2 rounded ${step >= 3 ? 'bg-primary-500' : 'bg-dark-700'}`} />
            <span className={step >= 3 ? 'text-primary-400' : ''}>3. Reset</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* STEP 1: Identification */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Registered Email or Phone</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-dark-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  placeholder="name@example.com or +15551234567"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                We will verify your account securely without disclosing personal credentials.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition disabled:opacity-50 mt-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Send Verification Code <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">6-Digit Security OTP</label>
                <span className="text-[10px] text-slate-400 font-mono">Demo: 123456</span>
              </div>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-dark-900/80 border border-white/10 rounded-xl px-4 py-3 text-center text-lg font-mono tracking-[0.3em] text-white focus:outline-none focus:border-primary-500"
                placeholder="••••••"
                autoFocus
                required
              />
              <p className="text-[11px] text-slate-400 text-center mt-2">
                Code expires in 15 minutes. Maximum 5 verification attempts.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Verify OTP Code <ArrowRight className="w-4 h-4" /></>}
            </button>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-slate-400 hover:text-white flex items-center gap-1 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || loading}
                className={`font-semibold transition ${resendCooldown > 0 ? 'text-slate-500 cursor-not-allowed' : 'text-primary-400 hover:underline'}`}
              >
                {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Code'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Create New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Create New Password</label>
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
                <span>Log out and invalidate all other active sessions</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !calculatePasswordStrength(newPassword).isValid || newPassword !== confirmPassword}
              className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition disabled:opacity-50 mt-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Update Password & Invalidate Tokens <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        )}

        {/* STEP 4: Success Card */}
        {step === 4 && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-glow">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">Password Changed Successfully</h3>
              <p className="text-xs text-slate-300">
                Your password has been updated. All previous password-reset tokens have been invalidated.
              </p>
            </div>

            <div className="p-3 bg-dark-900/80 rounded-xl border border-white/5 text-[11px] text-slate-400 text-left space-y-1">
              <p className="font-semibold text-white">Security Checklist:</p>
              <p>✓ Password encrypted using BCrypt</p>
              <p>✓ Reset tokens marked as single-use and invalidated</p>
              <p>✓ Security alert dispatched to your verified email</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                to="/client/login"
                className="py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-xs shadow-glow transition text-center"
              >
                Client Login
              </Link>
              <Link
                to="/freelancer/login"
                className="py-2.5 bg-accent-cyan hover:bg-cyan-400 text-dark-900 rounded-xl font-bold text-xs shadow-glow-cyan transition text-center"
              >
                Freelancer Login
              </Link>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="text-center space-y-2 text-xs text-slate-400">
          <p>
            Remembered your password?{' '}
            <Link to="/client/login" className="font-bold text-primary-400 hover:underline">
              Sign In
            </Link>
          </p>
          <p>
            Need alternative recovery methods?{' '}
            <Link to="/account-recovery" className="font-semibold text-accent-cyan hover:underline">
              Go to Account Recovery Center
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
