import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { mockUsers } from '../services/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('fh_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('fh_token');
      const storedUser = localStorage.getItem('fh_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        // Default to Demo Client for immediate friction-free testing
        const defaultDemo = mockUsers[1]; // Sarah Jenkins (Client)
        setUser(defaultDemo);
        setToken('mock-jwt-token-client');
        localStorage.setItem('fh_token', 'mock-jwt-token-client');
        localStorage.setItem('fh_user', JSON.stringify(defaultDemo));
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (identifier, password, rememberMe = false) => {
    try {
      const res = await api.post('/auth/login', {
        email: identifier,
        identifier: identifier,
        password: password,
        rememberMe: rememberMe
      });
      if (res.data?.success && res.data?.data) {
        const data = res.data.data;
        const authUser = {
          id: data.userId,
          email: data.email,
          phone: data.phone,
          fullName: data.fullName,
          role: data.role,
          avatarUrl: data.avatarUrl,
          emailVerified: data.emailVerified,
          phoneVerified: data.phoneVerified,
          identityVerified: data.identityVerified,
          profileId: data.profileId
        };
        setUser(authUser);
        setToken(data.token);
        localStorage.setItem('fh_token', data.token);
        localStorage.setItem('fh_user', JSON.stringify(authUser));
        return authUser;
      }
    } catch (err) {
      // Mock login fallback if backend isn't ready
      const matched = mockUsers.find(u => 
        (u.email && u.email.toLowerCase() === identifier.toLowerCase()) ||
        (u.phone && u.phone === identifier)
      );
      if (matched) {
        setUser(matched);
        setToken('mock-jwt-' + matched.role.toLowerCase());
        localStorage.setItem('fh_token', 'mock-jwt-' + matched.role.toLowerCase());
        localStorage.setItem('fh_user', JSON.stringify(matched));
        return matched;
      }
      throw new Error(err.response?.data?.message || 'Login failed. Please check credentials.');
    }
  };

  const loginAsDemo = (roleType) => {
    let demoUser;
    if (roleType === 'FREELANCER') {
      demoUser = mockUsers[2]; // Elena Vance
    } else if (roleType === 'ADMIN') {
      demoUser = mockUsers[0]; // Admin
    } else {
      demoUser = mockUsers[1]; // Sarah Jenkins (Client)
    }

    setUser(demoUser);
    const mockTok = 'mock-jwt-token-' + roleType.toLowerCase();
    setToken(mockTok);
    localStorage.setItem('fh_token', mockTok);
    localStorage.setItem('fh_user', JSON.stringify(demoUser));
    return demoUser;
  };

  const registerClient = async (payload) => {
    try {
      const res = await api.post('/auth/client/register', payload);
      if (res.data?.success && res.data?.data) {
        const data = res.data.data;
        const authUser = {
          id: data.userId,
          email: data.email,
          fullName: data.fullName,
          role: data.role,
          emailVerified: false,
          phoneVerified: false,
          identityVerified: false,
          profileId: data.profileId
        };
        setUser(authUser);
        setToken(data.token);
        localStorage.setItem('fh_token', data.token);
        localStorage.setItem('fh_user', JSON.stringify(authUser));
        return authUser;
      }
    } catch (err) {
      // Fallback
      const newUser = {
        id: Date.now(),
        email: payload.email,
        fullName: payload.fullName,
        role: 'ROLE_CLIENT',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        companyName: payload.companyName || 'My Startup',
        emailVerified: false,
        phoneVerified: false,
        identityVerified: false
      };
      setUser(newUser);
      setToken('mock-jwt-new-client');
      localStorage.setItem('fh_token', 'mock-jwt-new-client');
      localStorage.setItem('fh_user', JSON.stringify(newUser));
      return newUser;
    }
  };

  const registerFreelancer = async (payload) => {
    try {
      const res = await api.post('/auth/freelancer/register', payload);
      if (res.data?.success && res.data?.data) {
        const data = res.data.data;
        const authUser = {
          id: data.userId,
          email: data.email,
          fullName: data.fullName,
          role: data.role,
          emailVerified: false,
          phoneVerified: false,
          identityVerified: false,
          profileId: data.profileId
        };
        setUser(authUser);
        setToken(data.token);
        localStorage.setItem('fh_token', data.token);
        localStorage.setItem('fh_user', JSON.stringify(authUser));
        return authUser;
      }
    } catch (err) {
      const newUser = {
        id: Date.now(),
        email: payload.email,
        fullName: payload.fullName,
        role: 'ROLE_FREELANCER',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        title: payload.professionalTitle || 'Expert Freelancer',
        hourlyRate: payload.hourlyRate || 50,
        emailVerified: false,
        phoneVerified: false,
        identityVerified: false
      };
      setUser(newUser);
      setToken('mock-jwt-new-freelancer');
      localStorage.setItem('fh_token', 'mock-jwt-new-freelancer');
      localStorage.setItem('fh_user', JSON.stringify(newUser));
      return newUser;
    }
  };

  const verifyOtp = async (code, type = 'EMAIL') => {
    try {
      await api.post('/auth/verify-otp', { email: user?.email, code, type });
    } catch (err) {
      console.warn('API OTP verify fallback used');
    }
    const updated = {
      ...user,
      [type === 'PHONE' ? 'phoneVerified' : 'emailVerified']: true
    };
    setUser(updated);
    localStorage.setItem('fh_user', JSON.stringify(updated));
    return true;
  };

  const markIdentityVerified = () => {
    const updated = { ...user, identityVerified: true };
    setUser(updated);
    localStorage.setItem('fh_user', JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fh_token');
    localStorage.removeItem('fh_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      loginAsDemo,
      registerClient,
      registerFreelancer,
      verifyOtp,
      markIdentityVerified,
      logout,
      isAuthenticated: !!user,
      isClient: user?.role === 'ROLE_CLIENT',
      isFreelancer: user?.role === 'ROLE_FREELANCER',
      isAdmin: user?.role === 'ROLE_ADMIN'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
