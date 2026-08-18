import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { User, Lock, Bell, Shield, CheckCircle2, Save, Smartphone } from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState('PROFILE');
  const [fullName, setFullName] = useState(user?.fullName || 'Sarah Jenkins');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [location, setLocation] = useState(user?.location || 'New York, NY');
  const [timezone, setTimezone] = useState(user?.timezone || 'EST (UTC-5)');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast('Settings Saved', 'Your account settings have been updated.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-display font-extrabold text-white">Account Settings & Security</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Manage your personal details, login security, 2FA, and notification preferences.
        </p>
      </div>

      <div className="flex border-b border-white/10 space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`pb-3 transition border-b-2 ${activeTab === 'PROFILE' ? 'border-primary-500 text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          Profile Information
        </button>
        <button
          onClick={() => setActiveTab('SECURITY')}
          className={`pb-3 transition border-b-2 ${activeTab === 'SECURITY' ? 'border-primary-500 text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          Password & 2FA
        </button>
        <button
          onClick={() => setActiveTab('NOTIFICATIONS')}
          className={`pb-3 transition border-b-2 ${activeTab === 'NOTIFICATIONS' ? 'border-primary-500 text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          Notifications
        </button>
      </div>

      {activeTab === 'PROFILE' && (
        <form onSubmit={handleSaveProfile} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Timezone</label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold shadow-glow flex items-center gap-1.5 transition mt-2"
          >
            <Save className="w-4 h-4" /> Save Profile Details
          </button>
        </form>
      )}

      {activeTab === 'SECURITY' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Change Account Password</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            <button
              onClick={() => showToast('Password Updated', 'Password was successfully changed.', 'success')}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-semibold transition"
            >
              Update Password
            </button>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-white">Two-Factor Authentication (2FA)</h4>
              <p className="text-[11px] text-slate-400">Add an extra layer of security using SMS OTP or Authenticator app.</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold">
              ENABLED ✓
            </span>
          </div>
        </div>
      )}

      {activeTab === 'NOTIFICATIONS' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4 text-xs text-slate-300">
          <label className="flex items-center justify-between p-3 bg-dark-900/60 rounded-xl border border-white/5 cursor-pointer">
            <span>Email alerts on proposal submissions and messages</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary-500" />
          </label>
          <label className="flex items-center justify-between p-3 bg-dark-900/60 rounded-xl border border-white/5 cursor-pointer">
            <span>Instant SMS alerts on payment releases and milestone approvals</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary-500" />
          </label>
          <label className="flex items-center justify-between p-3 bg-dark-900/60 rounded-xl border border-white/5 cursor-pointer">
            <span>Browser real-time push notifications</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary-500" />
          </label>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
