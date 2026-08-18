import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import VerificationBadge from './VerificationBadge';
import {
  Layers,
  Search,
  Briefcase,
  MessageSquare,
  Bell,
  User,
  Shield,
  LogOut,
  ChevronDown,
  Menu,
  X,
  CreditCard,
  CheckSquare,
  AlertCircle
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isClient, isFreelancer, isAdmin, logout, loginAsDemo } = useAuth();
  const { unreadCount, notifications, markAllAsRead } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/10 backdrop-blur-md">
      {/* Demo Persona Switcher Banner for Instant Testing */}
      <div className="bg-gradient-to-r from-indigo-950 via-dark-800 to-cyan-950 px-4 py-1.5 border-b border-primary-500/20 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">Interactive Demo Mode:</span>
          <span className="text-slate-400">Current persona: <strong className="text-white">{user ? user.fullName + ` (${user.role.replace('ROLE_', '')})` : 'Guest'}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px] mr-1">Switch:</span>
          <button
            onClick={() => loginAsDemo('CLIENT')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${isClient ? 'bg-primary-600 text-white shadow-sm' : 'bg-dark-700 text-slate-300 hover:bg-dark-600'}`}
          >
            Client (Sarah)
          </button>
          <button
            onClick={() => loginAsDemo('FREELANCER')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${isFreelancer ? 'bg-accent-cyan/80 text-black font-semibold shadow-sm' : 'bg-dark-700 text-slate-300 hover:bg-dark-600'}`}
          >
            Freelancer (Elena)
          </button>
          <button
            onClick={() => loginAsDemo('ADMIN')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${isAdmin ? 'bg-purple-600 text-white shadow-sm' : 'bg-dark-700 text-slate-300 hover:bg-dark-600'}`}
          >
            Admin Console
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-cyan p-0.5 shadow-glow group-hover:scale-105 transition transform">
              <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-primary-400 group-hover:text-accent-cyan transition" />
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-white flex items-center gap-1">
                Freelance<span className="text-primary-400">Hub</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-primary-500/20 text-accent-cyan rounded border border-primary-500/30">3D</span>
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/freelancers"
              className={`text-sm font-medium transition hover:text-white flex items-center gap-1.5 ${isActive('/freelancers') ? 'text-primary-400' : 'text-slate-300'}`}
            >
              <Search className="w-4 h-4" />
              Find Talent
            </Link>
            <Link
              to="/projects"
              className={`text-sm font-medium transition hover:text-white flex items-center gap-1.5 ${isActive('/projects') ? 'text-primary-400' : 'text-slate-300'}`}
            >
              <Briefcase className="w-4 h-4" />
              Find Projects
            </Link>
            <Link
              to="/how-it-works"
              className={`text-sm font-medium transition hover:text-white ${isActive('/how-it-works') ? 'text-primary-400' : 'text-slate-300'}`}
            >
              How It Works
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition hover:text-white ${isActive('/about') ? 'text-primary-400' : 'text-slate-300'}`}
            >
              About
            </Link>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Real-time Chat Link */}
                <Link
                  to="/chat"
                  className={`p-2 rounded-xl glass-panel text-slate-300 hover:text-white hover:border-primary-500/40 transition relative`}
                  title="Real-Time Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-cyan rounded-full animate-ping" />
                </Link>

                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setProfileDropdownOpen(false);
                    }}
                    className="p-2 rounded-xl glass-panel text-slate-300 hover:text-white hover:border-primary-500/40 transition relative"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-primary-600 text-white rounded-full text-[10px] font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-80 glass-panel bg-dark-800/95 border border-white/10 rounded-2xl shadow-2xl p-4 z-50">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <span className="font-semibold text-sm text-white">Notifications</span>
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-primary-400 hover:text-primary-300 font-medium"
                        >
                          Mark all as read
                        </button>
                      </div>
                      <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                        {notifications.slice(0, 4).map((n) => (
                          <div
                            key={n.id}
                            className={`p-2.5 rounded-xl transition ${n.isRead ? 'bg-dark-700/40 text-slate-400' : 'bg-primary-950/40 border border-primary-500/20 text-slate-200'}`}
                          >
                            <p className="text-xs font-semibold text-white">{n.title}</p>
                            <p className="text-[11px] mt-0.5 text-slate-300">{n.message}</p>
                          </div>
                        ))}
                      </div>
                      <div className="pt-3 border-t border-white/10 text-center mt-2">
                        <Link
                          to="/notifications"
                          onClick={() => setNotifDropdownOpen(false)}
                          className="text-xs text-accent-cyan hover:underline font-medium"
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dashboard Shortcut CTA */}
                {isClient && (
                  <Link
                    to="/dashboard"
                    className="px-3.5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-glow transition"
                  >
                    Client Dashboard
                  </Link>
                )}
                {isFreelancer && (
                  <Link
                    to="/freelancer/dashboard"
                    className="px-3.5 py-2 rounded-xl bg-accent-cyan hover:bg-cyan-400 text-dark-900 text-xs font-bold shadow-glow-cyan transition"
                  >
                    Freelancer Dashboard
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm transition"
                  >
                    Admin Console
                  </Link>
                )}

                {/* User Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(!profileDropdownOpen);
                      setNotifDropdownOpen(false);
                    }}
                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl glass-panel hover:border-primary-500/40 transition"
                  >
                    <img
                      src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={user?.fullName}
                      className="w-7 h-7 rounded-full object-cover border border-primary-500/30"
                    />
                    <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                      {user?.fullName}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 glass-panel bg-dark-800/95 border border-white/10 rounded-2xl shadow-2xl p-2 z-50">
                      <div className="p-3 border-b border-white/10">
                        <p className="text-xs font-bold text-white truncate">{user?.fullName}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <VerificationBadge verified={user?.identityVerified} size="sm" />
                        </div>
                      </div>

                      <div className="py-2 space-y-1">
                        {isClient && (
                          <>
                            <Link
                              to="/projects/create"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-dark-700 rounded-lg transition"
                            >
                              <Briefcase className="w-4 h-4 text-primary-400" /> Post New Project
                            </Link>
                            <Link
                              to="/proposals"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-dark-700 rounded-lg transition"
                            >
                              <CheckSquare className="w-4 h-4 text-primary-400" /> Manage Proposals
                            </Link>
                          </>
                        )}

                        {isFreelancer && (
                          <Link
                            to={`/freelancers/${user.profileId || 1}`}
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-dark-700 rounded-lg transition"
                          >
                            <User className="w-4 h-4 text-accent-cyan" /> My Public Profile
                          </Link>
                        )}

                        <Link
                          to="/verification"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-dark-700 rounded-lg transition"
                        >
                          <Shield className="w-4 h-4 text-emerald-400" /> Identity Verification
                        </Link>

                        <Link
                          to="/payments/history"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-dark-700 rounded-lg transition"
                        >
                          <CreditCard className="w-4 h-4 text-amber-400" /> Escrow & Payments
                        </Link>

                        <Link
                          to="/disputes"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-dark-700 rounded-lg transition"
                        >
                          <AlertCircle className="w-4 h-4 text-rose-400" /> Dispute Center
                        </Link>
                      </div>

                      <div className="pt-2 border-t border-white/10">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Non-authenticated login options */
              <div className="flex items-center gap-3">
                <Link
                  to="/client/login"
                  className="px-3 py-1.5 rounded-xl glass-panel text-xs font-semibold text-slate-200 hover:text-white hover:border-primary-500/40 transition"
                >
                  Client Login
                </Link>
                <Link
                  to="/freelancer/login"
                  className="px-3.5 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-glow transition"
                >
                  Freelancer Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl glass-panel text-slate-300 hover:text-white"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="md:hidden glass-panel bg-dark-900 border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/freelancers"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-200"
          >
            Find Talent
          </Link>
          <Link
            to="/projects"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-200"
          >
            Find Projects
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-200"
          >
            How It Works
          </Link>
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-200"
          >
            About
          </Link>

          {isAuthenticated ? (
            <div className="pt-4 border-t border-white/10 space-y-2">
              <Link
                to={isClient ? "/dashboard" : isFreelancer ? "/freelancer/dashboard" : "/admin"}
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-primary-400"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/chat"
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-300"
              >
                Messages
              </Link>
              <Link
                to="/verification"
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-300"
              >
                Identity Verification
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left py-2 text-sm font-semibold text-rose-400"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
              <Link
                to="/client/login"
                onClick={() => setMenuOpen(false)}
                className="text-center py-2 text-xs font-semibold glass-panel rounded-xl text-slate-200"
              >
                Client Login
              </Link>
              <Link
                to="/freelancer/login"
                onClick={() => setMenuOpen(false)}
                className="text-center py-2 text-xs font-semibold bg-primary-600 rounded-xl text-white"
              >
                Freelancer Login
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
