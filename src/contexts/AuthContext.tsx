import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Address } from '../lib/types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockDb } from '../lib/mockDatabase';
import { AdminPermission, hasPermission as checkPermission, isStaffRole } from '../lib/permissions';

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: UserProfile;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  hasPermission: (permission: AdminPermission) => boolean;
  isMockMode: boolean;
  addresses: Address[];
  login: (email: string, password?: string) => Promise<AuthResponse>;
  adminLogin: (email: string, password: string) => Promise<AuthResponse>;
  register: (name: string, email: string, password?: string, phone?: string) => Promise<AuthResponse>;
  requestPasswordReset: (email: string) => Promise<AuthResponse>;
  logout: () => void;
  addAddress: (address: Omit<Address, 'id' | 'user_id'>) => Address;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const INITIAL_ADDRESSES: Address[] = [];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMockMode = !isSupabaseConfigured;

  // Initialize and validate user session against authoritative store
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('ba_current_user');
    if (!saved) return null;

    try {
      const parsed: UserProfile = JSON.parse(saved);
      // Security Check: Validate user identity and role against trusted mockDb in mock mode
      const authoritativeUser = mockDb.getUserByEmail(parsed.email);
      if (!authoritativeUser) {
        localStorage.removeItem('ba_current_user');
        return null;
      }

      // Never trust local storage role over authoritative store
      return {
        id: authoritativeUser.id,
        email: authoritativeUser.email,
        full_name: authoritativeUser.full_name,
        phone: authoritativeUser.phone,
        role: authoritativeUser.role,
        avatar_url: parsed.avatar_url,
        created_at: authoritativeUser.created_at,
      };
    } catch {
      localStorage.removeItem('ba_current_user');
      return null;
    }
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('ba_user_addresses');
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

  // Sync session storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('ba_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ba_current_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ba_user_addresses', JSON.stringify(addresses));
  }, [addresses]);

  // Customer Login (Strictly verifies and sets customer role)
  const login = async (email: string, password?: string): Promise<AuthResponse> => {
    if (!email.trim()) {
      return { success: false, message: 'Please enter your email address.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password || '',
        });
        if (error) {
          return { success: false, message: error.message };
        }
        if (data.user) {
          // Fetch authoritative profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const userProfile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: profile?.full_name || email.split('@')[0],
            phone: profile?.phone,
            role: profile?.role === 'admin' ? 'admin' : 'customer',
            avatar_url: profile?.avatar_url,
          };
          setUser(userProfile);
          return { success: true, user: userProfile };
        }
      } catch (err: any) {
        return { success: false, message: err.message || 'Supabase authentication failed.' };
      }
    }

    // Mock Mode Execution
    const result = mockDb.authenticateCustomer(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      return { success: true, user: result.user };
    }
    return { success: false, message: result.message || 'Authentication failed.' };
  };

  // Dedicated Admin Login (Strictly verifies administrative credentials & authorization)
  const adminLogin = async (email: string, password: string): Promise<AuthResponse> => {
    if (!email.trim() || !password) {
      return { success: false, message: 'Please enter both administrator email and password.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) {
          return { success: false, message: 'Invalid administrative credentials.' };
        }
        if (data.user) {
          // Strictly verify admin role from trusted server table
          const { data: profile, error: profileErr } = await supabase
            .from('profiles')
            .select('role, full_name, phone')
            .eq('id', data.user.id)
            .single();

          if (profileErr || !profile || !isStaffRole(profile.role)) {
            await supabase.auth.signOut();
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
          setUser(adminProfile);
          return { success: true, user: adminProfile };
        }
      } catch (err: any) {
        return { success: false, message: err.message || 'Administrative verification failed.' };
      }
    }

    // Mock Mode Execution
    const result = mockDb.authenticateAdmin(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      return { success: true, user: result.user };
    }
    return { success: false, message: result.message || 'Invalid administrative credentials.' };
  };

  // Customer Registration (Always creates role = 'customer')
  const register = async (
    name: string, 
    email: string, 
    password?: string, 
    phone?: string
  ): Promise<AuthResponse> => {
    if (!name.trim() || !email.trim()) {
      return { success: false, message: 'Please provide full name and email address.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password || 'Customer@123',
          options: {
            data: {
              full_name: name.trim(),
              phone: phone?.trim(),
              role: 'customer', // Default
            }
          }
        });
        if (error) {
          return { success: false, message: error.message };
        }
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: name.trim(),
            phone: phone?.trim(),
            role: 'customer',
          };
          setUser(profile);
          return { success: true, user: profile };
        }
      } catch (err: any) {
        return { success: false, message: err.message || 'Registration failed.' };
      }
    }

    // Mock Mode Execution
    const result = mockDb.registerCustomer(name, email, password, phone);
    if (result.success && result.user) {
      setUser(result.user);
      return { success: true, user: result.user };
    }
    return { success: false, message: result.message || 'Registration failed.' };
  };

  // Password Reset Request
  const requestPasswordReset = async (email: string): Promise<AuthResponse> => {
    if (!email.trim()) {
      return { success: false, message: 'Please enter your account email address.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth?reset=true`,
        });
        if (error) {
          // Do not leak whether user exists
          console.warn('Password reset notice:', error.message);
        }
      } catch (err) {
        console.warn('Supabase reset password fallback:', err);
      }
    }

    const result = mockDb.requestPasswordReset(email);
    return { success: true, message: result.message };
  };

  // Invalidate Session
  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(console.error);
    }
    setUser(null);
    localStorage.removeItem('ba_current_user');
  };

  // Address Management: Customer enters their address directly; never set default address automatically
  const addAddress = (addrData: Omit<Address, 'id' | 'user_id'>): Address => {
    const newAddress: Address = {
      ...addrData,
      id: 'addr-' + Date.now(),
      user_id: user?.id || 'guest',
      is_default: false, // Don't set default address
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

  const isStaff = isStaffRole(user?.role);
  const isAdmin = user?.role === 'admin';
  const hasPermission = (permission: AdminPermission): boolean => checkPermission(user?.role, permission);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isStaff,
        hasPermission,
        isMockMode,
        addresses,
        login,
        adminLogin,
        register,
        requestPasswordReset,
        logout,
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
