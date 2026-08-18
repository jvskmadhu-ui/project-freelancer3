import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VerificationBadge from '../../components/VerificationBadge';
import RatingStars from '../../components/RatingStars';
import { mockFreelancers, mockSkills } from '../../services/mockData';
import api from '../../services/api';
import {
  Search,
  Filter,
  SlidersHorizontal,
  DollarSign,
  Star,
  ShieldCheck,
  Award,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

const FreelancerDirectoryPage = () => {
  const [freelancers, setFreelancers] = useState(mockFreelancers);
  const [keyword, setKeyword] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxRate, setMaxRate] = useState(150);

  useEffect(() => {
    // Filter logic
    let result = mockFreelancers;

    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      result = result.filter(f =>
        f.fullName.toLowerCase().includes(q) ||
        f.title.toLowerCase().includes(q) ||
        f.overview.toLowerCase().includes(q)
      );
    }

    if (selectedSkill) {
      result = result.filter(f => f.skills.includes(selectedSkill));
    }

    if (verifiedOnly) {
      result = result.filter(f => f.identityVerified);
    }

    if (maxRate) {
      result = result.filter(f => f.hourlyRate <= maxRate);
    }

    setFreelancers(result);
  }, [keyword, selectedSkill, verifiedOnly, maxRate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-accent-cyan text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Vetted Freelancer Talent Directory
        </div>
        <h1 className="text-3xl font-display font-extrabold text-white">Find Verified Top Freelancers</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Hire elite developers, 3D spatial artists, AI engineers, and UI/UX designers with verified credentials.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by name, skill, or title..."
              className="w-full bg-dark-900 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Skill Filter */}
          <div>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
            >
              <option value="">All Technologies & Skills</option>
              {mockSkills.map((s, idx) => (
                <option key={idx} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Hourly Rate Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Max Hourly Rate:</span>
              <span className="font-bold text-white">${maxRate}/hr</span>
            </div>
            <input
              type="range"
              min="20"
              max="200"
              step="5"
              value={maxRate}
              onChange={(e) => setMaxRate(Number(e.target.value))}
              className="w-full accent-primary-500"
            />
          </div>

          {/* Verified Only Toggle */}
          <div className="flex items-center">
            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-primary-600 focus:ring-0 bg-dark-900 border-white/20"
              />
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Verified KYC Only
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Freelancer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {freelancers.map((f) => (
          <div
            key={f.id}
            className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-3.5">
                <img
                  src={f.avatarUrl}
                  alt={f.fullName}
                  className="w-14 h-14 rounded-2xl object-cover border border-primary-500/30 shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-white truncate">{f.fullName}</h3>
                    <VerificationBadge verified={f.identityVerified} size="sm" />
                  </div>
                  <p className="text-xs text-primary-300 font-medium truncate mt-0.5">{f.title}</p>
                  <div className="mt-1.5 flex items-center gap-3">
                    <RatingStars rating={f.rating} reviewsCount={f.totalReviewsCount} />
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-3 mt-4 leading-relaxed">
                {f.overview}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {f.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-dark-700 text-slate-300 border border-white/5"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Hourly Rate</span>
                <span className="text-base font-bold text-white">${f.hourlyRate}<span className="text-xs text-slate-400">/hr</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/chat?partner=${f.userId || 3}`}
                  className="p-2 glass-panel rounded-xl text-slate-300 hover:text-white"
                  title="Direct Message"
                >
                  <MessageSquare className="w-4 h-4" />
                </Link>
                <Link
                  to={`/freelancers/${f.id}`}
                  className="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-semibold shadow-glow transition"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {freelancers.length === 0 && (
        <div className="text-center py-16 glass-panel rounded-2xl border border-white/10 space-y-3">
          <Award className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Freelancers Match Your Filter Criteria</h3>
          <p className="text-xs text-slate-400">Try adjusting your hourly rate filter or selecting different skills.</p>
        </div>
      )}
    </div>
  );
};

export default FreelancerDirectoryPage;
