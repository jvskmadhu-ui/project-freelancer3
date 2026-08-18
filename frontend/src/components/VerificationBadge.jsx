import React from 'react';
import { CheckCircle, ShieldCheck } from 'lucide-react';

const VerificationBadge = ({ verified = true, size = 'md', showLabel = true }) => {
  if (!verified) return null;

  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-5 h-5 text-sm',
    lg: 'w-6 h-6 text-base'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full shadow-sm`}
      title="Identity & Credentials Verified by FreelanceHub Compliance"
    >
      <ShieldCheck className={`${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[1]} text-emerald-400`} />
      {showLabel && <span className={`${sizeClasses[size].split(' ')[2]}`}>VERIFIED</span>}
    </span>
  );
};

export default VerificationBadge;
