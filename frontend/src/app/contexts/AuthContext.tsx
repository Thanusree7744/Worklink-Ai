/**
 * Authentication Context
 * Manages user authentication state and credentials
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { apiClient } from '../services/api';
import { auth, googleProvider } from '../services/firebase';
import { syncUserToFirestore, seedFirestoreIfEmpty } from '../services/firestoreSync';

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
  login: (email: string, password: string, role?: UserRole) => Promise<User>;
  loginWithGoogle: (role?: UserRole) => Promise<User>;
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

  // Check if user is already logged in on mount and ensure Firestore has demo data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const response = await apiClient.get<{ user: User }>('/auth/me');
          setUser(response.user);
          // Sync profile to Firestore
          syncUserToFirestore(response.user);
        }
      } catch (err) {
        localStorage.removeItem('auth_token');
        apiClient.setToken(null);
      } finally {
        setIsLoading(false);
      }

      // Check and seed initial demo data into Firestore if empty
      seedFirestoreIfEmpty();
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
      // Persist in Firestore
      await syncUserToFirestore(response.user);
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

  const loginWithGoogle = async (role: UserRole = 'customer') => {
    setIsLoading(true);
    setError(null);

    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const fbUser = cred.user;

      let userObj: User;
      let token: string;

      try {
        // Exchange with backend
        const response = await apiClient.post<{
          token: string;
          user: User;
        }>('/auth/firebase-login', {
          email: fbUser.email,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Google User',
          role,
          avatar: fbUser.photoURL || undefined,
          firebase_uid: fbUser.uid,
        });
        token = response.token;
        userObj = response.user;
      } catch (backendErr) {
        // Fallback for standalone/mock mode
        token = await fbUser.getIdToken();
        userObj = {
          id: fbUser.uid,
          email: fbUser.email || '',
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          role,
          avatar: fbUser.photoURL || undefined,
          verified: true,
        };
      }

      apiClient.setToken(token);
      setUser(userObj);

      // Save directly to Firestore 'users' collection
      await syncUserToFirestore(userObj, {
        firebase_uid: fbUser.uid,
        authProvider: 'google',
      });

      return userObj;
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        console.log('[Google Auth] Sign-in popup cancelled by user');
        return null as any;
      }
      const errorMessage = err?.message || 'Google sign-in failed';
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
      // Sync into Firestore 'users' collection
      await syncUserToFirestore(response.user, data);
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
        await syncUserToFirestore(maybeUser);
        return maybeUser;
      }

      const resp = await apiClient.get<{ user: User }>('/auth/me');
      setUser(resp.user);
      await syncUserToFirestore(resp.user);
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

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
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
