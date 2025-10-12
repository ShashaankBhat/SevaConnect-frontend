import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

interface AdminAuthContextType {
  admin: Admin | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await checkAdminRole(session.user);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await checkAdminRole(session.user);
      } else {
        setAdmin(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (user: User): Promise<boolean> => {
    try {
      const { data, error } = await (supabase as any)
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (data && !error) {
        const { data: profile } = await (supabase as any)
          .from('profiles')
          .select('name, email')
          .eq('id', user.id)
          .single();

        setAdmin({
          id: user.id,
          name: (profile && profile.name) || 'Administrator',
          email: (profile && profile.email) || user.email || '',
          role: 'admin'
        });
        return true;
      } else {
        setAdmin(null);
        return false;
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
      setAdmin(null);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const isAdmin = await checkAdminRole(data.user);
        setIsLoading(false);
        
        if (isAdmin) {
          return { success: true };
        } else {
          await supabase.auth.signOut();
          return { success: false, error: 'You do not have admin privileges' };
        }
      }
      
      setIsLoading(false);
      return { success: false, error: 'Login failed' };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
