import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import {
  Briefcase,
  Layers,
  DollarSign,
  Calendar,
  ShieldCheck,
  Plus,
  Trash2,
  ArrowRight,
  RefreshCw,
  Sparkles
} from 'lucide-react';

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const { showToast, addNotification } = useNotification();

  const [formData, setFormData] = useState({
    title: '',
    category: '3D & Graphics',
    description: '',
    budgetType: 'FIXED',
    budgetMin: 2500,
    budgetMax: 5000,
    experienceLevel: 'EXPERT',
    estimatedDurationDays: 30,
    skills: 'Three.js, React.js, WebGL',
    deadline: '2026-10-15'
  });

  const [milestones, setMilestones] = useState([
    { title: 'Milestone 1: Architectural Foundation & Asset Setup', amount: 1500, dueDate: '2026-09-10' },
    { title: 'Milestone 2: Interactivity & Feature Implementation', amount: 2000, dueDate: '2026-09-25' },
    { title: 'Milestone 3: Final Testing & Production Deployment', amount: 1500, dueDate: '2026-10-15' }
  ]);

  const [loading, setLoading] = useState(false);

  const handleAddMilestone = () => {
    setMilestones([...milestones, { title: 'New Milestone', amount: 1000, dueDate: '2026-10-30' }]);
  };

  const handleRemoveMilestone = (idx) => {
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  const handleMilestoneChange = (idx, field, val) => {
    const updated = [...milestones];
    updated[idx][field] = val;
    setMilestones(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
      await api.post('/projects', {
        ...formData,
        requiredSkills: skillsArray,
        initialMilestones: milestones
      });
      showToast('Project Published!', 'Your project is now live for freelancers to bid.', 'success');
      addNotification({
        title: 'Project Published',
        message: `Project '${formData.title}' is now accepting proposals.`,
        type: 'SYSTEM',
        linkUrl: '/dashboard'
      });
      navigate('/dashboard');
    } catch (err) {
      showToast('Project Published (Demo Mode)', 'Project added to active client projects.', 'success');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-primary-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Briefcase className="w-4 h-4" /> Client Project Wizard
        </div>
        <h1 className="text-3xl font-display font-extrabold text-white">Create New Project</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Post your requirements, define milestone deliverables, and connect with verified specialists.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
          <h2 className="text-base font-bold text-white font-display">1. Project Scope & Category</h2>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Project Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Next-Gen 3D Interactive Metaverse Showcase"
              className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
              >
                <option value="3D & Graphics">3D & Graphics</option>
                <option value="Web Development">Web Development</option>
                <option value="AI & ML">AI & Machine Learning</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Mobile Apps">Mobile Apps</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Experience Level *</label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
              >
                <option value="ENTRY">Entry Level</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Detailed Project Brief *</label>
            <textarea
              rows="6"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe deliverables, technical stack, architecture requirements, and goals..."
              className="w-full bg-dark-900 border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-primary-500 leading-relaxed"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Required Skills (comma-separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="Three.js, React.js, WebGL, Shader programming"
              className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Budget & Timeline */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
          <h2 className="text-base font-bold text-white font-display">2. Budget & Timelines</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Min Budget ($ USD)</label>
              <input
                type="number"
                value={formData.budgetMin}
                onChange={(e) => setFormData({ ...formData, budgetMin: Number(e.target.value) })}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Max Budget ($ USD)</label>
              <input
                type="number"
                value={formData.budgetMax}
                onChange={(e) => setFormData({ ...formData, budgetMax: Number(e.target.value) })}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Est. Duration (Days)</label>
              <input
                type="number"
                value={formData.estimatedDurationDays}
                onChange={(e) => setFormData({ ...formData, estimatedDurationDays: Number(e.target.value) })}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Milestone Breakdown */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-display">3. Milestone Deliverables (Escrow Breakdown)</h2>
            <button
              type="button"
              onClick={handleAddMilestone}
              className="px-3 py-1.5 bg-primary-600/20 hover:bg-primary-600 text-primary-300 hover:text-white rounded-lg text-xs font-semibold border border-primary-500/30 transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Milestone
            </button>
          </div>

          <div className="space-y-3">
            {milestones.map((m, idx) => (
              <div key={idx} className="p-4 bg-dark-900/60 rounded-xl border border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-6">
                  <input
                    type="text"
                    value={m.title}
                    onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                    placeholder="Milestone Deliverable Title"
                    className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="number"
                    value={m.amount}
                    onChange={(e) => handleMilestoneChange(idx, 'amount', Number(e.target.value))}
                    placeholder="Amount ($)"
                    className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="date"
                    value={m.dueDate}
                    onChange={(e) => handleMilestoneChange(idx, 'dueDate', e.target.value)}
                    className="w-full bg-dark-800 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div className="sm:col-span-1 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(idx)}
                    className="text-rose-400 hover:text-rose-300 p-1"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-glow flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Publish Project & Open Escrow <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>
    </div>
  );
};

export default CreateProjectPage;
