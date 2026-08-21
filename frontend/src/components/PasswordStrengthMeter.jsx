import React from 'react';
import { Check, X, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const calculatePasswordStrength = (password) => {
  if (!password) {
    return {
      score: 0,
      label: 'Enter password',
      color: 'bg-slate-700',
      textColor: 'text-slate-400',
      checks: {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      },
      isValid: false,
    };
  }

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const passedCount = Object.values(checks).filter(Boolean).length;

  let score = 0;
  let label = 'Weak';
  let color = 'bg-rose-500';
  let textColor = 'text-rose-400';

  if (passedCount <= 2) {
    score = 1;
    label = 'Weak';
    color = 'bg-rose-500';
    textColor = 'text-rose-400';
  } else if (passedCount === 3 || passedCount === 4) {
    score = 2;
    label = 'Medium';
    color = 'bg-amber-500';
    textColor = 'text-amber-400';
  } else if (passedCount === 5) {
    score = 3;
    label = 'Strong';
    color = 'bg-emerald-500';
    textColor = 'text-emerald-400';
  }

  return {
    score,
    label,
    color,
    textColor,
    checks,
    isValid: passedCount === 5,
  };
};

const PasswordStrengthMeter = ({ password, showRequirements = true }) => {
  const strength = calculatePasswordStrength(password);

  const getBarColor = (index) => {
    if (strength.score >= index) {
      if (strength.score === 1) return 'bg-rose-500';
      if (strength.score === 2) return 'bg-amber-500';
      return 'bg-emerald-500';
    }
    return 'bg-dark-700/80';
  };

  return (
    <div className="space-y-2 mt-2">
      {/* Strength Bar & Label */}
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400">Password Strength:</span>
        <span className={`font-bold uppercase tracking-wider ${strength.textColor}`}>
          {password ? strength.label : 'None'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
        <div className={`h-full rounded-full transition-all duration-300 ${getBarColor(1)}`} />
        <div className={`h-full rounded-full transition-all duration-300 ${getBarColor(2)}`} />
        <div className={`h-full rounded-full transition-all duration-300 ${getBarColor(3)}`} />
      </div>

      {/* Checklist */}
      {showRequirements && (
        <div className="p-3 bg-dark-900/60 rounded-xl border border-white/5 space-y-1.5 text-[11px]">
          <p className="text-slate-400 font-semibold mb-1">Required Security Standards:</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <div className={`flex items-center gap-1.5 ${strength.checks.length ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
              {strength.checks.length ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
              <span>At least 8 characters</span>
            </div>

            <div className={`flex items-center gap-1.5 ${strength.checks.uppercase ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
              {strength.checks.uppercase ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
              <span>1 uppercase letter (A-Z)</span>
            </div>

            <div className={`flex items-center gap-1.5 ${strength.checks.lowercase ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
              {strength.checks.lowercase ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
              <span>1 lowercase letter (a-z)</span>
            </div>

            <div className={`flex items-center gap-1.5 ${strength.checks.number ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
              {strength.checks.number ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
              <span>At least 1 number (0-9)</span>
            </div>

            <div className={`flex items-center gap-1.5 sm:col-span-2 ${strength.checks.special ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
              {strength.checks.special ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
              <span>1 special symbol (!@#$%^&*)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
