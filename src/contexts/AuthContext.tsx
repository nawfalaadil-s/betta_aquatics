import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Address, UserRole } from '../lib/types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  addresses: Address[];
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  addAddress: (address: Omit<Address, 'id' | 'user_id'>) => Address;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const DEMO_CUSTOMER: UserProfile = {
  id: 'usr-customer-demo',
  email: 'customer@bettaaquatics.in',
  full_name: 'Rahul Sharma',
  phone: '+91 98450 12345',
  role: 'customer',
  avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
};

const DEMO_ADMIN: UserProfile = {
  id: 'usr-admin-demo',
  email: 'admin@bettaaquatics.in',
  full_name: 'Aathil (Store Admin)',
  phone: '+91 98765 43210',
  role: 'admin',
  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
};

const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-01',
    user_id: 'usr-customer-demo',
    full_name: 'Rahul Sharma',
    phone: '+91 98450 12345',
    street_address: '402, Aqua Green Apartments, 12th Main Road, Indiranagar',
    landmark: 'Opposite BDA Complex',
    city: 'Bengaluru',
    state: 'Karnataka',
    postal_code: '560038',
    is_default: true,
  },
  {
    id: 'addr-02',
    user_id: 'usr-customer-demo',
    full_name: 'Rahul Sharma (Office)',
    phone: '+91 98450 12345',
    street_address: 'Level 5, Tech Park, Outer Ring Road, Bellandur',
    landmark: 'Near EcoSpace Gate 2',
    city: 'Bengaluru',
    state: 'Karnataka',
    postal_code: '560103',
    is_default: false,
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('ba_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_CUSTOMER;
      }
    }
    return DEMO_CUSTOMER; // Start logged in as customer for immediate seamless testing
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('ba_user_addresses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ADDRESSES;
      }
    }
    return INITIAL_ADDRESSES;
  });

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

  const login = async (email: string): Promise<boolean> => {
    // If Supabase is active
    if (isSupabaseConfigured && supabase) {
      try {
        // Real Supabase Auth would go here
      } catch (err) {
        console.warn('Supabase auth fallback:', err);
      }
    }

    if (email.toLowerCase().includes('admin')) {
      setUser(DEMO_ADMIN);
    } else {
      setUser({
        ...DEMO_CUSTOMER,
        email,
        full_name: email.split('@')[0],
      });
    }
    return true;
  };

  const register = async (name: string, email: string, _password?: string, phone?: string): Promise<boolean> => {
    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      email,
      full_name: name,
      phone: phone || '+91 99999 88888',
      role: 'customer',
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ba_current_user');
  };

  const switchRole = (role: UserRole) => {
    if (role === 'admin') {
      setUser(DEMO_ADMIN);
    } else {
      setUser(DEMO_CUSTOMER);
    }
  };

  const addAddress = (addrData: Omit<Address, 'id' | 'user_id'>): Address => {
    const newAddress: Address = {
      ...addrData,
      id: 'addr-' + Date.now(),
      user_id: user?.id || 'guest',
      is_default: addresses.length === 0 ? true : addrData.is_default,
    };

    setAddresses(prev => {
      let updated = prev;
      if (newAddress.is_default) {
        updated = updated.map(a => ({ ...a, is_default: false }));
      }
      return [newAddress, ...updated];
    });

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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        addresses,
        login,
        register,
        logout,
        switchRole,
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
