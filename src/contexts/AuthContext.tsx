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

        // Only sync from mockDb if Supabase is NOT configured (pure mock mode)
        if (!isSupabaseConfigured) {
          const authoritativeUser = mockDb.getUserByEmail(parsed.user.email);
          if (authoritativeUser) {
            if (authoritativeUser.status === 'paused' || authoritativeUser.status === 'suspended') {
              localStorage.removeItem(STORAGE_KEY_SESSION);
              localStorage.removeItem(STORAGE_KEY_LEGACY_USER);
              return null;
            }
            parsed.user = {
              ...parsed.user,
              id: authoritativeUser.id,
              email: authoritativeUser.email,
              full_name: authoritativeUser.full_name,
              phone: authoritativeUser.phone,
              role: authoritativeUser.role,
              status: authoritativeUser.status || 'active',
              created_at: authoritativeUser.created_at,
            };
            parsed.role = authoritativeUser.role;
          }
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
        let role = parsedUser.role || 'customer';
        let id = parsedUser.id || 'usr-' + Date.now();
        let full_name = parsedUser.full_name || parsedUser.email.split('@')[0];
        let phone = parsedUser.phone;
        let created_at = parsedUser.created_at || new Date().toISOString();

        if (!isSupabaseConfigured) {
          const authoritativeUser = mockDb.getUserByEmail(parsedUser.email);
          if (authoritativeUser) {
            role = authoritativeUser.role;
            id = authoritativeUser.id;
            full_name = authoritativeUser.full_name;
            phone = authoritativeUser.phone;
            created_at = authoritativeUser.created_at;
          }
        }

        const userProfile: UserProfile = {
          id,
          email: parsedUser.email,
          full_name,
          phone,
          role,
          avatar_url: parsedUser.avatar_url,
          created_at,
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
  const [isLoading, setIsLoading] = useState<boolean>(isSupabaseConfigured);
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
    if (!isSupabaseConfigured || !client) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    // Check active Supabase session
    client.auth.getSession().then(async ({ data: { session: supaSession }, error }) => {
      if (!isMounted) return;

      try {
        if (error || !supaSession?.user) {
          // If Supabase has no active session, clear local Supabase session if expired/revoked
          if (!supaSession) {
            setSession(prev => {
              if (prev && prev.token && prev.token !== 'mock_token' && !prev.token.startsWith('sess_')) {
                return null;
              }
              return prev;
            });
          }
          return;
        }

        const { data: profile } = await client
          .from('profiles')
          .select('*')
          .eq('id', supaSession.user.id)
          .maybeSingle();

        if (!isMounted) return;

        if (profile && (profile.status === 'paused' || profile.status === 'suspended')) {
          await client.auth.signOut();
          setSession(null);
          setIsLoading(false);
          return;
        }

        const role: UserRole = profile?.role === 'admin' ? 'admin' : (profile?.role || 'customer');
        const userProfile: UserProfile = {
          id: supaSession.user.id,
          email: (supaSession.user.email || '').trim().toLowerCase(),
          full_name: profile?.full_name || supaSession.user.user_metadata?.full_name || supaSession.user.email?.split('@')[0] || 'User',
          phone: profile?.phone || supaSession.user.user_metadata?.phone,
          role,
          status: profile?.status || 'active',
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
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    });

    // Subscribe to auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = client.auth.onAuthStateChange(async (event, supaSession) => {
      if (!isMounted) return;

      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') && supaSession?.user) {
        try {
          const { data: profile } = await client
            .from('profiles')
            .select('*')
            .eq('id', supaSession.user.id)
            .maybeSingle();

          if (!isMounted) return;

          if (profile && (profile.status === 'paused' || profile.status === 'suspended')) {
            await client.auth.signOut();
            setSession(null);
            setIsLoading(false);
            return;
          }

          const role: UserRole = profile?.role === 'admin' ? 'admin' : (profile?.role || 'customer');
          const userProfile: UserProfile = {
            id: supaSession.user.id,
            email: (supaSession.user.email || '').trim().toLowerCase(),
            full_name: profile?.full_name || supaSession.user.user_metadata?.full_name || supaSession.user.email?.split('@')[0] || 'User',
            phone: profile?.phone || supaSession.user.user_metadata?.phone,
            role,
            status: profile?.status || 'active',
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
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setIsLoading(false);
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

          if (profile && (profile.status === 'paused' || profile.status === 'suspended')) {
            await client.auth.signOut();
            setSession(null);
            return;
          }

          const role: UserRole = profile?.role === 'admin' ? 'admin' : (profile?.role || 'customer');
          const userProfile: UserProfile = {
            id: supaUser.id,
            email: (supaUser.email || '').trim().toLowerCase(),
            full_name: profile?.full_name || supaUser.user_metadata?.full_name || supaUser.email?.split('@')[0] || 'User',
            phone: profile?.phone || supaUser.user_metadata?.phone,
            role,
            status: profile?.status || 'active',
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
    if (!password) {
      return { success: false, message: 'Please enter your password.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) {
          const errMsg = error.message.toLowerCase();
          if (errMsg.includes('invalid login credentials')) {
            return { 
              success: false, 
              message: 'Invalid email address or password. Please verify your credentials and try again.' 
            };
          }
          if (errMsg.includes('email not confirmed')) {
            return { 
              success: false, 
              message: 'Your email address has not been confirmed yet. Please check your inbox.' 
            };
          }
          return { success: false, message: error.message };
        }

        if (data.user && data.session) {
          // Fetch authoritative profile without throwing PGRST116
          let userProfile: UserProfile;
          try {
            const { data: profile } = await client
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .maybeSingle();

            if (profile && (profile.status === 'paused' || profile.status === 'suspended')) {
              await client.auth.signOut();
              return {
                success: false,
                message: 'Access Denied: Your account has been temporarily paused by store administration. Please contact support.',
              };
            }

            const role: UserRole = profile?.role === 'admin' ? 'admin' : (profile?.role || 'customer');
            userProfile = {
              id: data.user.id,
              email: data.user.email ? data.user.email.toLowerCase() : cleanEmail,
              full_name: profile?.full_name || data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
              phone: profile?.phone || data.user.user_metadata?.phone,
              role,
              status: profile?.status || 'active',
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
                status: 'active',
                updated_at: new Date().toISOString(),
              });
            }
          } catch (pErr) {
            userProfile = {
              id: data.user.id,
              email: data.user.email ? data.user.email.toLowerCase() : cleanEmail,
              full_name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
              phone: data.user.user_metadata?.phone,
              role: 'customer',
            };
          }

          // Sync into mockDb without plaintext password for offline fallback
          mockDb.registerCustomer(userProfile.full_name, cleanEmail, undefined, userProfile.phone, userProfile.id);

          const expiresAt = data.session.expires_at 
            ? data.session.expires_at * 1000 
            : Date.now() + DEFAULT_SESSION_DURATION;

          const newSession: UserSession = {
            user: userProfile,
            token: data.session.access_token,
            created_at: Date.now(),
            expires_at: expiresAt,
            role: userProfile.role,
          };

          setSession(newSession);
          return { success: true, user: userProfile };
        }

        return { success: false, message: 'Unable to authenticate. Please try again.' };
      } catch (err: any) {
        return { success: false, message: err.message || 'Authentication failed.' };
      }
    }

    // Mock Mode Execution (when Supabase is not configured)
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

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    const client = supabase;
    if (isSupabaseConfigured && client) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) {
          // If Supabase authentication fails, check mockDb fallback for configured admins
          const mockResult = mockDb.authenticateAdmin(cleanEmail, cleanPassword);
          if (mockResult.success && mockResult.user) {
            const newSession = createSession(mockResult.user);
            setSession(newSession);
            return { success: true, user: mockResult.user };
          }
          return { success: false, message: 'Invalid administrative credentials.' };
        }

        if (data.user && data.session) {
          // Strictly verify admin role from trusted server table
          let profileRow = null;
          try {
            const { data: pById } = await client
              .from('profiles')
              .select('role, full_name, phone, status')
              .eq('id', data.user.id)
              .maybeSingle();
            profileRow = pById;
            if (!profileRow) {
              const { data: pByEmail } = await client
                .from('profiles')
                .select('role, full_name, phone, status')
                .eq('email', cleanEmail)
                .maybeSingle();
              profileRow = pByEmail;
            }
          } catch (pQueryErr) {
            console.warn('Profile retrieval notice:', pQueryErr);
          }

          const isOwnerAccount = cleanEmail === 'bettaaquticsno1@gmail.com' || cleanEmail === 'bettaaquaticsno1@gmail.com';
          const resolvedRole: UserRole = isOwnerAccount ? 'admin' : (profileRow?.role || 'customer');

          if (!isStaffRole(resolvedRole)) {
            await client.auth.signOut();
            return { 
              success: false, 
              message: 'Access Denied: This account does not have administrative privileges.' 
            };
          }

          if (profileRow && (profileRow.status === 'paused' || profileRow.status === 'suspended')) {
            await client.auth.signOut();
            return {
              success: false,
              message: 'Access Denied: This administrative account has been paused by store administration.',
            };
          }

          const adminProfile: UserProfile = {
            id: data.user.id,
            email: data.user.email ? data.user.email.toLowerCase() : cleanEmail,
            full_name: profileRow?.full_name || (isOwnerAccount ? 'Betta Aquatics (Owner & Administrator)' : 'Store Admin'),
            phone: profileRow?.phone || (isOwnerAccount ? '+91 95975 17238' : undefined),
            role: resolvedRole,
            status: profileRow?.status || 'active',
          };

          const expiresAt = data.session.expires_at 
            ? data.session.expires_at * 1000 
            : Date.now() + DEFAULT_SESSION_DURATION;

          const newSession: UserSession = {
            user: adminProfile,
            token: data.session.access_token,
            created_at: Date.now(),
            expires_at: expiresAt,
            role: adminProfile.role,
          };

          setSession(newSession);
          return { success: true, user: adminProfile };
        }
      } catch (err: any) {
        return { success: false, message: err.message || 'Administrative verification failed.' };
      }
    }

    // Mock Mode Execution
    const result = mockDb.authenticateAdmin(cleanEmail, cleanPassword);
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
    const cleanPassword = password?.trim() || '';
    if (!cleanPassword || cleanPassword.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

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
          if (error.message.includes('already registered') || error.message.includes('unique constraint') || (error as any).status === 422) {
            return { 
              success: false, 
              message: 'An account with this email address already exists. Please log in or use password reset.' 
            };
          }
          return { success: false, message: error.message };
        }

        // CRITICAL SUPABASE CHECK:
        // When email confirmation is enabled or user exists, Supabase returns user with empty identities: []
        if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
          return {
            success: false,
            message: 'An account with this email address already exists. Please log in or use password reset.',
          };
        }

        if (data?.user) {
          let activeSession = data.session;
          // If signUp didn't return an active session, sign in directly to obtain authoritative tokens
          if (!activeSession) {
            const signInRes = await client.auth.signInWithPassword({
              email: cleanEmail,
              password: cleanPassword,
            });
            if (signInRes.data?.session) {
              activeSession = signInRes.data.session;
            }
          }

          const profile: UserProfile = {
            id: data.user.id,
            email: cleanEmail,
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

          // Sync into mockDb with Supabase ID without plaintext password
          mockDb.registerCustomer(cleanName, cleanEmail, undefined, cleanPhone, data.user.id);

          const expiresAt = activeSession?.expires_at
            ? activeSession.expires_at * 1000
            : Date.now() + DEFAULT_SESSION_DURATION;

          const newSession: UserSession = {
            user: profile,
            token: activeSession?.access_token || 'supa_token',
            created_at: Date.now(),
            expires_at: expiresAt,
            role: 'customer',
          };

          setSession(newSession);
          return { success: true, user: profile };
        }

        return { success: false, message: 'Could not create account. Please try again.' };
      } catch (err: any) {
        return { success: false, message: err.message || 'Registration failed.' };
      }
    }

    // Mock Mode Execution (when Supabase is not configured)
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
