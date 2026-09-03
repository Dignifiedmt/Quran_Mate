// Auth Context
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, getAuthToken, setAuthToken } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [activePartnershipId, setActivePartnershipId] = useState(null);
  const [partnerId, setPartnerId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await api.getMe();
      setUser(data.user);
      setAvailability(data.availability || []);
      setActivePartnershipId(data.activePartnershipId || null);
      setPartnerId(data.partnerId || null);
      setError(null);
    } catch (err) {
      console.warn('Session check failed:', err.message);
      setAuthToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();

    const handleExpired = () => {
      setUser(null);
      setAvailability([]);
      setActivePartnershipId(null);
    };

    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, [fetchProfile]);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await api.login({ email, password });
      setAuthToken(data.token);
      await fetchProfile();
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    setError(null);
    try {
      const data = await api.register({ name, email, password, confirmPassword });
      setAuthToken(data.token);
      await fetchProfile();
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const demoLogin = async (email) => {
    return login(email, 'password123');
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setAvailability([]);
    setActivePartnershipId(null);
    setPartnerId(null);
  };

  const updateProfile = async (profileData) => {
    const data = await api.updateProfile(profileData);
    setUser(data.user);
    return data.user;
  };

  const updateAvailabilitySlots = async (slots) => {
    const data = await api.updateAvailability(slots);
    setAvailability(data.availability || []);
    return data.availability;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        availability,
        activePartnershipId,
        partnerId,
        isLoading,
        error,
        login,
        register,
        demoLogin,
        logout,
        updateProfile,
        updateAvailabilitySlots,
        refreshProfile: fetchProfile,
        isAuthenticated: !!user,
        hasCompletedProfile: !!(user && user.memorization_stage && user.goal),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
