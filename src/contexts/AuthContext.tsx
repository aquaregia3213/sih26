import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase/supabaseClient';
import { supabaseSync } from '../services/supabase/supabaseSync';
import { vanikaStorage } from '../utils/storage';
import { apiClient, setStoredToken, getStoredToken, clearStoredToken } from '../services/api/apiClient';

// ─── Types ───

export interface AuthUser {
  id: string;
  email: string | null;
  phone: string | null;
  role: string;
  isActive: boolean;
  profile?: {
    fullName: string;
    location?: string;
    dateOfBirth?: string;
    primaryLanguage?: string;
    bio?: string;
  };
  accessibilitySettings?: any;
  userPreferences?: any;
}

export interface RegisterData {
  fullName: string;
  phone?: string;
  email?: string;
  password: string;
  role?: string;
  location?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isCloudConnected: boolean;
  login: (login: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

// ─── Context ───

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ───

interface AuthProviderProps {
  children: ReactNode;
  onLogout?: () => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, onLogout }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isCloudConnected = isSupabaseConfigured();

  const isAuthenticated = !!user;

  const clearError = useCallback(() => setError(null), []);

  // Format Supabase session user into AuthUser
  const mapSupabaseUser = (sbUser: any, sessionToken?: string): AuthUser => {
    return {
      id: sbUser.id,
      email: sbUser.email || null,
      phone: sbUser.phone || sbUser.user_metadata?.phone || null,
      role: sbUser.user_metadata?.role || 'ELDER',
      isActive: true,
      profile: {
        fullName: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'Caregiver / Elder',
        location: sbUser.user_metadata?.location || 'Guwahati, Assam',
        primaryLanguage: sbUser.user_metadata?.primaryLanguage || 'Assamese'
      }
    };
  };

  // Logout handler
  const logout = useCallback(async () => {
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('[Auth] Signout error:', e);
    }
    clearStoredToken();
    vanikaStorage.setCloudUser(null);
    setUser(null);
    setToken(null);
    setError(null);
    onLogout?.();
  }, [onLogout]);

  // Listen for forced logout from apiClient (401 responses)
  useEffect(() => {
    const handleForcedLogout = () => logout();
    window.addEventListener('vanika:auth:logout', handleForcedLogout);
    return () => window.removeEventListener('vanika:auth:logout', handleForcedLogout);
  }, [logout]);

  // Initialize session on mount
  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const mappedUser = mapSupabaseUser(session.user);
            setUser(mappedUser);
            setToken(session.access_token);
            setStoredToken(session.access_token);
            vanikaStorage.setCloudUser(session.user.id);
          }
        } catch (err) {
          console.warn('[Auth] Supabase session check error:', err);
        } finally {
          setIsLoading(false);
        }

        // Listen for Supabase auth state transitions
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            const mappedUser = mapSupabaseUser(session.user);
            setUser(mappedUser);
            setToken(session.access_token);
            setStoredToken(session.access_token);
            vanikaStorage.setCloudUser(session.user.id);
          } else {
            setUser(null);
            setToken(null);
            vanikaStorage.setCloudUser(null);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } else {
        // Fallback to Express backend or local token
        const storedToken = getStoredToken();
        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        try {
          const userData = await apiClient.get<AuthUser>('/auth/me');
          setUser(userData);
          setToken(storedToken);
          if (userData?.id) {
            vanikaStorage.setCloudUser(userData.id);
          }
        } catch {
          clearStoredToken();
          setToken(null);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initAuth();
  }, []);

  // Login
  const login = useCallback(async (loginIdentifier: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      if (isSupabaseConfigured()) {
        // Normalize identifier: if user entered plain phone, generate email alias for Supabase email auth
        let emailToUse = loginIdentifier.trim();
        if (!emailToUse.includes('@')) {
          // If phone number without @, convert to phone format email alias
          const cleanPhone = emailToUse.replace(/[^0-9]/g, '');
          emailToUse = `${cleanPhone}@vanika.internal`;
        }

        const { data, error: sbError } = await supabase.auth.signInWithPassword({
          email: emailToUse,
          password
        });

        if (sbError) {
          throw new Error(sbError.message || 'Login failed. Please check your credentials.');
        }

        if (data.user) {
          const mappedUser = mapSupabaseUser(data.user);
          setUser(mappedUser);
          if (data.session) {
            setToken(data.session.access_token);
            setStoredToken(data.session.access_token);
          }
          vanikaStorage.setCloudUser(data.user.id);
        }
      } else {
        // Fallback to Express API
        const result = await apiClient.post<{ user: AuthUser; token: string }>(
          '/auth/login',
          { login: loginIdentifier, password },
          true
        );

        setStoredToken(result.token);
        setToken(result.token);
        setUser(result.user);
        if (result.user?.id) {
          vanikaStorage.setCloudUser(result.user.id);
        }
      }
    } catch (err: any) {
      let message = err?.message || 'Login failed. Please check your credentials.';
      if (message.toLowerCase().includes('email not confirmed')) {
        message = 'Email confirmation pending. Please check your inbox or disable "Confirm email" in Supabase (Authentication > Providers > Email) to sign in immediately.';
      }
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register
  const register = useCallback(async (data: RegisterData) => {
    setError(null);
    setIsLoading(true);

    try {
      if (isSupabaseConfigured()) {
        let emailToUse = data.email?.trim();
        if (!emailToUse) {
          if (data.phone) {
            const cleanPhone = data.phone.replace(/[^0-9]/g, '');
            emailToUse = `${cleanPhone}@vanika.internal`;
          } else {
            throw new Error('Please provide an email or phone number to sign up.');
          }
        }

        const { data: sbData, error: sbError } = await supabase.auth.signUp({
          email: emailToUse,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName.trim(),
              role: data.role || 'ELDER',
              phone: data.phone || null,
              location: data.location || 'Guwahati, Assam'
            }
          }
        });

        if (sbError) {
          throw new Error(sbError.message || 'Registration failed.');
        }

        if (sbData.user) {
          const mappedUser = mapSupabaseUser(sbData.user);
          setUser(mappedUser);
          if (sbData.session) {
            setToken(sbData.session.access_token);
            setStoredToken(sbData.session.access_token);
          }
          vanikaStorage.setCloudUser(sbData.user.id);

          // Initialize profile in Supabase profiles table
          await supabaseSync.syncUserProfile(sbData.user.id, {
            ...vanikaStorage.getProfile(),
            id: sbData.user.id,
            name: data.fullName.trim(),
            caregiverName: data.role === 'CAREGIVER' ? data.fullName.trim() : undefined,
            caregiverContact: data.role === 'CAREGIVER' ? data.phone : undefined
          });
        }
      } else {
        // Fallback to Express backend
        const result = await apiClient.post<{ user: AuthUser; token: string }>(
          '/auth/register',
          {
            fullName: data.fullName,
            phone: data.phone,
            email: data.email,
            password: data.password,
            role: data.role || 'ELDER',
          },
          true
        );

        setStoredToken(result.token);
        setToken(result.token);
        setUser(result.user);
        if (result.user?.id) {
          vanikaStorage.setCloudUser(result.user.id);
        }
      }
    } catch (err: any) {
      const message = err?.message || 'Registration failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (isSupabaseConfigured()) {
      const { data: { user: sbUser } } = await supabase.auth.getUser();
      if (sbUser) {
        setUser(mapSupabaseUser(sbUser));
      }
    } else if (token) {
      try {
        const userData = await apiClient.get<AuthUser>('/auth/me');
        setUser(userData);
      } catch {
        // Silent fail
      }
    }
  }, [token]);

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    isCloudConnected,
    login,
    register,
    logout,
    refreshUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ───

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
