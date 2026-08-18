import axios from 'axios';
import {
  mockFreelancers,
  mockProjects,
  mockContracts,
  mockMessages,
  mockNotifications,
  mockTransactions,
  mockSkills,
  mockUsers
} from './mockData';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fh_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with graceful mock fallback for standalone frontend preview
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If backend connection fails or returns network error, provide local mock response
    if (!error.response || error.code === 'ERR_NETWORK' || error.response.status === 404) {
      const url = error.config?.url || '';
      const method = error.config?.method?.toLowerCase() || 'get';

      // Fallback routes
      if (url.includes('/freelancers') && method === 'get') {
        return { data: { success: true, data: { content: mockFreelancers, totalElements: mockFreelancers.length } } };
      }
      if (url.includes('/projects') && method === 'get') {
        return { data: { success: true, data: { content: mockProjects, totalElements: mockProjects.length } } };
      }
      if (url.includes('/skills') && method === 'get') {
        return { data: { success: true, data: mockSkills.map((s, idx) => ({ id: idx + 1, name: s })) } };
      }
      if (url.includes('/notifications') && method === 'get') {
        return { data: { success: true, data: mockNotifications } };
      }
      if (url.includes('/chat/conversations') && method === 'get') {
        return { data: { success: true, data: [{ partnerId: 3, partnerName: 'Elena Vance', partnerRole: 'ROLE_FREELANCER', partnerVerified: true, lastMessage: 'Milestone 1 deliverables are ready for your review!', lastMessageTime: '2026-08-16T11:22:00', unreadCount: 1 }] } };
      }
      if (url.includes('/chat/conversation') && method === 'get') {
        return { data: { success: true, data: mockMessages } };
      }
      if (url.includes('/payments/history') && method === 'get') {
        return { data: { success: true, data: mockTransactions } };
      }
      if (url.includes('/contracts/client/my-contracts') || url.includes('/contracts/freelancer/my-contracts')) {
        return { data: { success: true, data: mockContracts } };
      }
      if (url.includes('/contracts/1')) {
        return { data: { success: true, data: mockContracts[0] } };
      }
      if (url.includes('/admin/stats')) {
        return { data: { success: true, data: { totalUsers: 124, totalClients: 42, totalFreelancers: 82, verifiedUsers: 68, pendingKYCCount: 4, totalProjects: 36, activeProjects: 12, completedProjects: 24, openDisputesCount: 1, totalVolume: 78500.00, escrowInHold: 14250.00 } } };
      }
    }
    return Promise.reject(error);
  }
);

export default api;
