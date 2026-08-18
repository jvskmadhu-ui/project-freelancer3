import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { mockProjects, mockSkills } from '../../services/mockData';
import VerificationBadge from '../../components/VerificationBadge';
import {
  Search,
  Briefcase,
  DollarSign,
  Clock,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Filter
} from 'lucide-react';

const ProjectSearchPage = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [projects, setProjects] = useState(mockProjects);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [experienceLevel, setExperienceLevel] = useState('');

  useEffect(() => {
    let result = mockProjects;

    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (category) {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (experienceLevel) {
      result = result.filter(p => p.experienceLevel === experienceLevel);
    }

    setProjects(result);
  }, [keyword, category, experienceLevel]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-primary-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Briefcase className="w-4 h-4" /> Available Project Contracts
        </div>
        <h1 className="text-3xl font-display font-extrabold text-white">Find High-Value Client Projects</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Explore guaranteed escrow jobs posted by verified companies worldwide.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by keywords or technology..."
              className="w-full bg-dark-900 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
            >
              <option value="">All Categories</option>
              <option value="3D & Graphics">3D & Graphics</option>
              <option value="Web Development">Web Development</option>
              <option value="AI & ML">AI & Machine Learning</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Mobile Apps">Mobile Apps</option>
            </select>
          </div>

          <div>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
            >
              <option value="">All Experience Levels</option>
              <option value="ENTRY">Entry Level</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>
        </div>
      </div>

      {/* Project Listings */}
      <div className="space-y-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-500/20 text-primary-300 border border-primary-500/30">
                    {p.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Posted 2 days ago
                  </span>
                </div>
                <Link to={`/projects/${p.id}`} className="block">
                  <h3 className="text-lg font-bold text-white hover:text-primary-400 transition font-display">
                    {p.title}
                  </h3>
                </Link>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-xs text-slate-400 block">{p.budgetType} Budget</span>
                <span className="text-xl font-display font-extrabold text-emerald-400">
                  ${p.budgetMin} - ${p.budgetMax}
                </span>
              </div>
            </div>

            {/* Skills & Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                {p.requiredSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-dark-900 text-slate-300 border border-white/10"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span>Proposals: <strong className="text-white">{p.proposalsCount}</strong></span>
                </div>
                <Link
                  to={`/projects/${p.id}`}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-xs shadow-glow flex items-center gap-1.5 transition"
                >
                  View Brief & Bid <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSearchPage;
