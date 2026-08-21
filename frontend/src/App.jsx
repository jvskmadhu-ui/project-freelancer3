import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ClientLoginPage from './pages/auth/ClientLoginPage';
import ClientRegisterPage from './pages/auth/ClientRegisterPage';
import FreelancerLoginPage from './pages/auth/FreelancerLoginPage';
import FreelancerRegisterPage from './pages/auth/FreelancerRegisterPage';
import OtpVerificationPage from './pages/auth/OtpVerificationPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import AccountRecoveryPage from './pages/auth/AccountRecoveryPage';
import IdentityVerificationPage from './pages/verification/IdentityVerificationPage';
import ClientDashboard from './pages/dashboard/ClientDashboard';
import FreelancerDashboard from './pages/dashboard/FreelancerDashboard';
import FreelancerDirectoryPage from './pages/freelancers/FreelancerDirectoryPage';
import FreelancerProfilePage from './pages/freelancers/FreelancerProfilePage';
import ProjectSearchPage from './pages/projects/ProjectSearchPage';
import ProjectDetailPage from './pages/projects/ProjectDetailPage';
import CreateProjectPage from './pages/projects/CreateProjectPage';
import ProposalManagementPage from './pages/proposals/ProposalManagementPage';
import ChatPage from './pages/chat/ChatPage';
import ContractWorkspacePage from './pages/contracts/ContractWorkspacePage';
import PaymentHistoryPage from './pages/payments/PaymentHistoryPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import ReviewsPage from './pages/reviews/ReviewsPage';
import DisputeCenterPage from './pages/disputes/DisputeCenterPage';
import SettingsPage from './pages/settings/SettingsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import { PrivacyPolicyPage, TermsPage, RefundPolicyPage } from './pages/legal/LegalPages';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-900 text-slate-100 selection:bg-primary-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Core Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />

          {/* Separate Client & Freelancer Auth Flows */}
          <Route path="/client/login" element={<ClientLoginPage />} />
          <Route path="/client/register" element={<ClientRegisterPage />} />
          <Route path="/freelancer/login" element={<FreelancerLoginPage />} />
          <Route path="/freelancer/register" element={<FreelancerRegisterPage />} />
          <Route path="/verification/otp" element={<OtpVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/account-recovery" element={<AccountRecoveryPage />} />

          {/* Identity Verification (8-Step KYC) */}
          <Route path="/verification" element={<IdentityVerificationPage />} />

          {/* Dashboards */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CLIENT', 'ROLE_ADMIN']}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_FREELANCER', 'ROLE_ADMIN']}>
                <FreelancerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Freelancers & Public Profiles */}
          <Route path="/freelancers" element={<FreelancerDirectoryPage />} />
          <Route path="/freelancers/:id" element={<FreelancerProfilePage />} />

          {/* Projects & Proposals */}
          <Route path="/projects" element={<ProjectSearchPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route
            path="/projects/create"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CLIENT', 'ROLE_ADMIN']}>
                <CreateProjectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proposals"
            element={
              <ProtectedRoute>
                <ProposalManagementPage />
              </ProtectedRoute>
            }
          />

          {/* Real-Time Chat */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          {/* Contracts & Milestone Escrow Workspace */}
          <Route
            path="/contracts/:id"
            element={
              <ProtectedRoute>
                <ContractWorkspacePage />
              </ProtectedRoute>
            }
          />

          {/* Escrow Ledger & Payments */}
          <Route
            path="/payments/history"
            element={
              <ProtectedRoute>
                <PaymentHistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Notifications & Ratings & Disputes */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reviews"
            element={
              <ProtectedRoute>
                <ReviewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/disputes"
            element={
              <ProtectedRoute>
                <DisputeCenterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Governance */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Legal Pages */}
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
    </div>
  );
}

export default App;
