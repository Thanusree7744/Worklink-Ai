/**
 * Authentication Context
 * Manages user authentication state and credentials
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../services/api';

export type UserRole = 'worker' | 'customer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  verified?: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, role: UserRole) => Promise<User>;
  register: (data: Record<string, unknown>) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  finishLogin: (token: string, user?: User) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Try to fetch user profile
          const response = await apiClient.get<{ user: User }>('/auth/me');
          setUser(response.user);
        }
      } catch (err) {
        // Token is invalid or user is not authenticated
        localStorage.removeItem('auth_token');
        apiClient.setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, role?: UserRole) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<{
        token: string;
        user: User;
      }>('/auth/login', {
        email: email.trim().toLowerCase(),
        password: password.trim(),
        role,
      });

      apiClient.setToken(response.token);
      setUser(response.user);
      return response.user;
    } catch (err) {
      const error = err as { message?: string };
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: Record<string, unknown>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<{
        token: string;
        user: User;
      }>('/auth/register', data);

      apiClient.setToken(response.token);
      setUser(response.user);
    } catch (err) {
      const error = err as { message?: string };
      const errorMessage = error.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const finishLogin = async (token: string, maybeUser?: User) => {
    setIsLoading(true);
    setError(null);

    try {
      apiClient.setToken(token);
      if (maybeUser) {
        setUser(maybeUser);
        return maybeUser;
      }

      const resp = await apiClient.get<{ user: User }>('/auth/me');
      setUser(resp.user);
      return resp.user;
    } catch (err) {
      const error = err as { message?: string };
      const errorMessage = error.message || 'Failed to finish login';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    apiClient.setToken(null);
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
