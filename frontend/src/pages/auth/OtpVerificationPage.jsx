import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Mail, Phone, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react';

const OtpVerificationPage = () => {
  const { user, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [code, setCode] = useState('123456');
  const [verifyType, setVerifyType] = useState('EMAIL'); // EMAIL or PHONE
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await verifyOtp(code, verifyType);
      setSuccess(true);
      setTimeout(() => {
        navigate('/verification');
      }, 1200);
    } catch (err) {
      setError('Invalid OTP code. Use test code 123456.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-glow-emerald">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-display font-extrabold text-white">Verify Your Account</h1>
          <p className="text-xs text-slate-300">Enter the 6-digit security code sent to your email or phone.</p>
        </div>

        {/* Demo Tip */}
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
          <span>Universal Master OTP for Testing:</span>
          <code className="font-bold bg-dark-900 px-2 py-0.5 rounded text-white">123456</code>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/80 border border-rose-500/30 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-5">
          {/* Toggle Type */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setVerifyType('EMAIL')}
              className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${verifyType === 'EMAIL' ? 'border-primary-500 bg-primary-600/20 text-white' : 'border-white/10 bg-dark-700/40 text-slate-400'}`}
            >
              <Mail className="w-4 h-4" /> Email OTP
            </button>
            <button
              type="button"
              onClick={() => setVerifyType('PHONE')}
              className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${verifyType === 'PHONE' ? 'border-primary-500 bg-primary-600/20 text-white' : 'border-white/10 bg-dark-700/40 text-slate-400'}`}
            >
              <Phone className="w-4 h-4" /> SMS / Phone OTP
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2 text-center">
              6-Digit Confirmation Code
            </label>
            <input
              type="text"
              maxLength="6"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full text-center tracking-[0.5em] text-2xl font-mono bg-dark-900 border border-white/20 rounded-xl py-3 text-white focus:outline-none focus:border-emerald-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-glow-emerald flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : success ? (
              <>Verified! Proceeding <CheckCircle2 className="w-4 h-4" /></>
            ) : (
              <>Verify & Proceed to KYC <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
