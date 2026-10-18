import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, Address, UserSession, UserRole } from '../lib/types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockDb } from '../lib/mockDatabase';
import { AdminPermission, hasPermission as checkPermission, isStaffRole } from '../lib/permissions';

export const STORAGE_KEY_SESSION = 'ba_current_session';
export const STORAGE_KEY_LEGACY_USER = 'ba_current_user';
export const STORAGE_KEY_ADDRESSES = 'ba_user_addresses';

// Default session validity: 30 days in milliseconds
export const DEFAULT_SESSION_DURATION = 30 * 24 * 60 * 60 * 1000;

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: UserProfile;
}

export interface AuthContextType {
  user: UserProfile | null;
  session: UserSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isSessionValid: boolean;
  sessionExpiresAt: Date | null;
  hasPermission: (permission: AdminPermission) => boolean;
  isMockMode: boolean;
  isLoading: boolean;
  addresses: Address[];
  login: (email: string, password?: string) => Promise<AuthResponse>;
  adminLogin: (email: string, password: string) => Promise<AuthResponse>;
  register: (name: string, email: string, password?: string, phone?: string) => Promise<AuthResponse>;
  requestPasswordReset: (email: string) => Promise<AuthResponse>;
  logout: () => void;
  touchSession: () => void;
  refreshSession: () => Promise<void>;
  addAddress: (address: Omit<Address, 'id' | 'user_id'>) => Address;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

export const createSession = (
  user: UserProfile,
  token?: string,
  durationMs: number = DEFAULT_SESSION_DURATION
): UserSession => {
  return {
    user,
    token: token || `sess_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`,
    created_at: Date.now(),
    expires_at: Date.now() + durationMs,
    role: user.role,
  };
};

export const loadInitialSession = (): UserSession | null => {
  if (typeof window === 'undefined') return null;

  try {
    // 1. Try modern session key
    const savedSessionRaw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (savedSessionRaw) {
      const parsed: UserSession = JSON.parse(savedSessionRaw);
      if (parsed && parsed.user && parsed.expires_at) {
        // If expired, clear and return null
        if (Date.now() > parsed.expires_at) {
          localStorage.removeItem(STORAGE_KEY_SESSION);
          localStorage.removeItem(STORAGE_KEY_LEGACY_USER);
          return null;
        }

        // If in mock database, sync latest authoritative profile fields
        const authoritativeUser = mockDb.getUserByEmail(parsed.user.email);
        if (authoritativeUser) {
          parsed.user = {
            ...parsed.user,
            id: authoritativeUser.id,
            email: authoritativeUser.email,
            full_name: authoritativeUser.full_name,
            phone: authoritativeUser.phone,
            role: authoritativeUser.role,
            created_at: authoritativeUser.created_at,
          };
          parsed.role = authoritativeUser.role;
        }
        // Always preserve session if unexpired!
        return parsed;
      }
    }

    // 2. Fallback to legacy user storage key
    const savedUserRaw = localStorage.getItem(STORAGE_KEY_LEGACY_USER);
    if (savedUserRaw) {
      const parsedUser: UserProfile = JSON.parse(savedUserRaw);
      if (parsedUser && parsedUser.email) {
        const authoritativeUser = mockDb.getUserByEmail(parsedUser.email);
        const role = authoritativeUser ? authoritativeUser.role : (parsedUser.role || 'customer');
        const userProfile: UserProfile = {
          id: authoritativeUser ? authoritativeUser.id : (parsedUser.id || 'usr-' + Date.now()),
          email: authoritativeUser ? authoritativeUser.email : parsedUser.email,
          full_name: authoritativeUser ? authoritativeUser.full_name : (parsedUser.full_name || parsedUser.email.split('@')[0]),
          phone: authoritativeUser ? authoritativeUser.phone : parsedUser.phone,
          role: role,
          avatar_url: parsedUser.avatar_url,
          created_at: authoritativeUser ? authoritativeUser.created_at : (parsedUser.created_at || new Date().toISOString()),
        };

        const migratedSession = createSession(userProfile);
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(migratedSession));
        return migratedSession;
      }
    }
  } catch (err) {
    console.warn('Session initialization warning:', err);
  }
  return null;
};

const INITIAL_ADDRESSES: Address[] = [];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMockMode = !isSupabaseConfigured;

  // Active persistent session (valid across browser refresh and restart)
  const [session, setSession] = useState<UserSession | null>(loadInitialSession);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = session?.user || null;

  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ADDRESSES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Strictly exclude demo/mock addresses: addresses must be customer-entered only
          return parsed.filter(
            (a: Address) => a.id !== 'addr-01' && a.id !== 'addr-02' && a.user_id !== 'usr-customer-demo'
          );
        }
      } catch {
        return [];
      }
    }
    return [];
  });

  // Sync session storage to disk whenever session updates
  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      localStorage.setItem(STORAGE_KEY_LEGACY_USER, JSON.stringify(session.user));
    } else {
      localStorage.removeItem(STORAGE_KEY_SESSION);
      localStorage.removeItem(STORAGE_KEY_LEGACY_USER);
    }
  }, [session]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ADDRESSES, JSON.stringify(addresses));
  }, [addresses]);

  // Periodic expiration watcher: automatically log out if expired (e.g. after 30 days)
  useEffect(() => {
    const timer = setInterval(() => {
      if (session && Date.now() > session.expires_at) {
        logout();
      }
    }, 60000);
    return () => clearInterval(timer);
  }, [session]);

  // Extend session on customer/admin activity if within renewal threshold (< 7 days left)
  const touchSession = useCallback(() => {
    setSession(prev => {
      if (!prev) return null;
      const remainingMs = prev.expires_at - Date.now();
      if (remainingMs < 7 * 24 * 60 * 60 * 1000) {
        return {
          ...prev,
          expires_at: Date.now() + DEFAULT_SESSION_DURATION,
        };
      }
      return prev;
    });
  }, []);

  // Synchronize session with Supabase Auth when enabled
  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured || !client) return;

    let isMounted = true;

    // Check active Supabase session
    client.auth.getSession().then(async ({ data: { session: supaSession }, error }) => {
      if (!isMounted || error || !supaSession?.user) return;

      try {
        const { data: profile } = await client
          .from('profiles')
          .select('*')
          .eq('id', supaSession.user.id)
          .single();

        if (!isMounted) return;

        const role: UserRole = profile?.role === 'admin' ? 'admin' : (profile?.role || 'customer');
        const userProfile: UserProfile = {
          id: supaSession.user.id,
          email: supaSession.user.email || '',
          full_name: profile?.full_name || supaSession.user.user_metadata?.full_name || supaSession.user.email?.split('@')[0] || 'User',
          phone: profile?.phone || supaSession.user.user_metadata?.phone,
          role,
          avatar_url: profile?.avatar_url,
        };

        const expiresAt = supaSession.expires_at 
          ? supaSession.expires_at * 1000 
          : Date.now() + DEFAULT_SESSION_DURATION;

        setSession({
          user: userProfile,
          token: supaSession.access_token || 'supa_token',
          created_at: Date.now(),
          expires_at: expiresAt,
          role,
        });
      } catch (profileErr) {
        console.warn('Supabase profile retrieval note:', profileErr);
      }
    });

    // Subscribe to auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = client.auth.onAuthStateChange(async (event, supaSession) => {
      if (!isMounted) return;

      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && supaSession?.user) {
        try {
          const { data: profile } = await client
            .from('profiles')
            .select('*')
            .eq('id', supaSession.user.id)
            .maybeSingle();

          if (!isMounted) return;

          const role: UserRole = profile?.role === 'admin' ? 'admin' : (profile?.role || 'customer');
          const userProfile: UserProfile = {
            id: supaSession.user.id,
            email: supaSession.user.email || '',
            full_name: profile?.full_name || supaSession.user.user_metadata?.full_name || supaSession.user.email?.split('@')[0] || 'User',
            phone: profile?.phone || supaSession.user.user_metadata?.phone,
            role,
            avatar_url: profile?.avatar_url,
          };

          const expiresAt = supaSession.expires_at 
            ? supaSession.expires_at * 1000 
            : Date.now() + DEFAULT_SESSION_DURATION;

          setSession({
            user: userProfile,
            token: supaSession.access_token || 'supa_token',
            created_at: Date.now(),
            expires_at: expiresAt,
            role,
          });
        } catch (authErr) {
          console.warn('Supabase auth state profile note:', authErr);
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Force-refresh session tokens
  const refreshSession = useCallback(async (): Promise<void> => {
    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        const { data, error } = await client.auth.refreshSession();
        if (!error && data.session?.user) {
          const supaUser = data.session.user;
          const { data: profile } = await client
            .from('profiles')
            .select('*')
            .eq('id', supaUser.id)
            .maybeSingle();

          const role: UserRole = profile?.role === 'admin' ? 'admin' : (profile?.role || 'customer');
          const userProfile: UserProfile = {
            id: supaUser.id,
            email: supaUser.email || '',
            full_name: profile?.full_name || supaUser.user_metadata?.full_name || supaUser.email?.split('@')[0] || 'User',
            phone: profile?.phone || supaUser.user_metadata?.phone,
            role,
            avatar_url: profile?.avatar_url,
          };

          const expiresAt = data.session.expires_at 
            ? data.session.expires_at * 1000 
            : Date.now() + DEFAULT_SESSION_DURATION;

          setSession({
            user: userProfile,
            token: data.session.access_token,
            created_at: Date.now(),
            expires_at: expiresAt,
            role,
          });
        }
      } catch (err) {
        console.warn('Failed to refresh Supabase session:', err);
      }
    } else {
      touchSession();
    }
  }, [touchSession]);

  // Customer Login (Strictly verifies and sets valid customer session)
  const login = async (email: string, password?: string): Promise<AuthResponse> => {
    if (!email.trim()) {
      return { success: false, message: 'Please enter your email address.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password || '';

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });
        if (error) {
          // If Supabase authentication fails, attempt mock fallback for local accounts
          const mockResult = mockDb.authenticateCustomer(cleanEmail, cleanPassword);
          if (mockResult.success && mockResult.user) {
            const newSession = createSession(mockResult.user);
            setSession(newSession);
            return { success: true, user: mockResult.user };
          }
          return { success: false, message: error.message };
        }
        if (data.user) {
          // Fetch authoritative profile without throwing PGRST116
          let userProfile: UserProfile;
          try {
            const { data: profile } = await client
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .maybeSingle();

            const role: UserRole = profile?.role === 'admin' ? 'admin' : (profile?.role || 'customer');
            userProfile = {
              id: data.user.id,
              email: data.user.email || cleanEmail,
              full_name: profile?.full_name || data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
              phone: profile?.phone || data.user.user_metadata?.phone,
              role,
              avatar_url: profile?.avatar_url,
            };

            // If profile row didn't exist yet, upsert it now
            if (!profile) {
              await client.from('profiles').upsert({
                id: data.user.id,
                email: userProfile.email,
                full_name: userProfile.full_name,
                phone: userProfile.phone || null,
                role: userProfile.role,
                updated_at: new Date().toISOString(),
              });
            }
          } catch (pErr) {
            userProfile = {
              id: data.user.id,
              email: data.user.email || cleanEmail,
              full_name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
              phone: data.user.user_metadata?.phone,
              role: 'customer',
            };
          }

          // Sync into mockDb for instant offline/fallback access
          mockDb.registerCustomer(userProfile.full_name, cleanEmail, cleanPassword, userProfile.phone, userProfile.id);

          const newSession = createSession(userProfile, data.session?.access_token);
          setSession(newSession);
          return { success: true, user: userProfile };
        }
      } catch (err: any) {
        const mockResult = mockDb.authenticateCustomer(cleanEmail, cleanPassword);
        if (mockResult.success && mockResult.user) {
          const newSession = createSession(mockResult.user);
          setSession(newSession);
          return { success: true, user: mockResult.user };
        }
        return { success: false, message: err.message || 'Authentication failed.' };
      }
    }

    // Mock Mode Execution
    const result = mockDb.authenticateCustomer(cleanEmail, cleanPassword);
    if (result.success && result.user) {
      const newSession = createSession(result.user);
      setSession(newSession);
      return { success: true, user: result.user };
    }
    return { success: false, message: result.message || 'Authentication failed.' };
  };

  // Dedicated Admin Login (Strictly verifies administrative credentials & sets valid admin session)
  const adminLogin = async (email: string, password: string): Promise<AuthResponse> => {
    if (!email.trim() || !password) {
      return { success: false, message: 'Please enter both administrator email and password.' };
    }

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) {
          // If Supabase authentication fails, check mockDb fallback for configured admins
          const mockResult = mockDb.authenticateAdmin(email, password);
          if (mockResult.success && mockResult.user) {
            const newSession = createSession(mockResult.user);
            setSession(newSession);
            return { success: true, user: mockResult.user };
          }
          return { success: false, message: 'Invalid administrative credentials.' };
        }
        if (data.user) {
          // Strictly verify admin role from trusted server table
          const { data: profile, error: profileErr } = await client
            .from('profiles')
            .select('role, full_name, phone')
            .eq('id', data.user.id)
            .single();

          if (profileErr || !profile || !isStaffRole(profile.role)) {
            await client.auth.signOut();
            return { 
              success: false, 
              message: 'Access Denied: This account does not have administrative privileges.' 
            };
          }

          const adminProfile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: profile.full_name,
            phone: profile.phone,
            role: profile.role,
          };
          const newSession = createSession(adminProfile, data.session?.access_token);
          setSession(newSession);
          return { success: true, user: adminProfile };
        }
      } catch (err: any) {
        const mockResult = mockDb.authenticateAdmin(email, password);
        if (mockResult.success && mockResult.user) {
          const newSession = createSession(mockResult.user);
          setSession(newSession);
          return { success: true, user: mockResult.user };
        }
        return { success: false, message: err.message || 'Administrative verification failed.' };
      }
    }

    // Mock Mode Execution
    const result = mockDb.authenticateAdmin(email, password);
    if (result.success && result.user) {
      const newSession = createSession(result.user);
      setSession(newSession);
      return { success: true, user: result.user };
    }
    return { success: false, message: result.message || 'Invalid administrative credentials.' };
  };

  // Customer Registration (Always creates role = 'customer' with valid session)
  const register = async (
    name: string, 
    email: string, 
    password?: string, 
    phone?: string
  ): Promise<AuthResponse> => {
    if (!name.trim() || !email.trim()) {
      return { success: false, message: 'Please provide full name and email address.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password || 'Customer@123';
    const cleanName = name.trim();
    const cleanPhone = phone?.trim();

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        const { data, error } = await client.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              full_name: cleanName,
              phone: cleanPhone,
              role: 'customer', // Default
            }
          }
        });
        if (error) {
          const mockResult = mockDb.registerCustomer(cleanName, cleanEmail, cleanPassword, cleanPhone);
          if (mockResult.success && mockResult.user) {
            const newSession = createSession(mockResult.user);
            setSession(newSession);
            return { success: true, user: mockResult.user };
          }
          return { success: false, message: error.message };
        }
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            full_name: cleanName,
            phone: cleanPhone,
            role: 'customer',
          };

          // Guarantee immediate existence in public.profiles table
          try {
            await client.from('profiles').upsert({
              id: data.user.id,
              email: profile.email,
              full_name: profile.full_name,
              phone: profile.phone || null,
              role: 'customer',
              updated_at: new Date().toISOString(),
            });
          } catch (profileUpsertErr) {
            console.warn('Profile sync notice:', profileUpsertErr);
          }

          // Sync into mockDb with Supabase ID so offline/fallback login always finds the account
          mockDb.registerCustomer(cleanName, cleanEmail, cleanPassword, cleanPhone, data.user.id);

          const newSession = createSession(profile, data.session?.access_token);
          setSession(newSession);
          return { success: true, user: profile };
        }
      } catch (err: any) {
        const mockResult = mockDb.registerCustomer(cleanName, cleanEmail, cleanPassword, cleanPhone);
        if (mockResult.success && mockResult.user) {
          const newSession = createSession(mockResult.user);
          setSession(newSession);
          return { success: true, user: mockResult.user };
        }
        return { success: false, message: err.message || 'Registration failed.' };
      }
    }

    // Mock Mode Execution
    const result = mockDb.registerCustomer(cleanName, cleanEmail, cleanPassword, cleanPhone);
    if (result.success && result.user) {
      const newSession = createSession(result.user);
      setSession(newSession);
      return { success: true, user: result.user };
    }
    return { success: false, message: result.message || 'Registration failed.' };
  };

  // Password Reset Request
  const requestPasswordReset = async (email: string): Promise<AuthResponse> => {
    if (!email.trim()) {
      return { success: false, message: 'Please enter your account email address.' };
    }

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth?reset=true`,
        });
        if (error) {
          console.warn('Password reset notice:', error.message);
        }
      } catch (err) {
        console.warn('Supabase reset password fallback:', err);
      }
    }

    const result = mockDb.requestPasswordReset(email);
    return { success: true, message: result.message };
  };

  // Invalidate Session completely
  const logout = () => {
    const client = supabase;
    if (isSupabaseConfigured && client) {
      client.auth.signOut().catch(console.error);
    }
    setSession(null);
    localStorage.removeItem(STORAGE_KEY_SESSION);
    localStorage.removeItem(STORAGE_KEY_LEGACY_USER);
  };

  // Address Management: Customer enters their address directly; never set default address automatically
  const addAddress = (addrData: Omit<Address, 'id' | 'user_id'>): Address => {
    const newAddress: Address = {
      ...addrData,
      id: 'addr-' + Date.now(),
      user_id: user?.id || 'guest',
      is_default: false,
    };

    setAddresses(prev => [newAddress, ...prev]);
    return newAddress;
  };

  const updateAddress = (updated: Address) => {
    setAddresses(prev => 
      prev.map(a => {
        if (a.id === updated.id) {
          return updated;
        }
        if (updated.is_default) {
          return { ...a, is_default: false };
        }
        return a;
      })
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => 
      prev.map(a => ({
        ...a,
        is_default: a.id === id,
      }))
    );
  };

  const isSessionValid = Boolean(session && session.expires_at > Date.now());
  const sessionExpiresAt = session ? new Date(session.expires_at) : null;
  const isStaff = isStaffRole(user?.role);
  const isAdmin = user?.role === 'admin';
  const hasPermission = (permission: AdminPermission): boolean => checkPermission(user?.role, permission);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user && isSessionValid,
        isAdmin,
        isStaff,
        isSessionValid,
        sessionExpiresAt,
        hasPermission,
        isMockMode,
        isLoading,
        addresses,
        login,
        adminLogin,
        register,
        requestPasswordReset,
        logout,
        touchSession,
        refreshSession,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
