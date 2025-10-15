import React, { createContext, useContext, useState, useEffect } from 'react';

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

const DEMO_ADMIN = {
  email: 'admin@sevaconnect.com',
  password: 'admin123',
  admin: {
    id: 'demo-admin-001',
    name: 'Seva Connect Admin',
    email: 'admin@sevaconnect.com',
    role: 'admin' as const
  }
};

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedAdmin = localStorage.getItem('sevaconnect_admin');
    if (savedAdmin) setAdmin(JSON.parse(savedAdmin));
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      const adminData = DEMO_ADMIN.admin;
      setAdmin(adminData);
      localStorage.setItem('sevaconnect_admin', JSON.stringify(adminData));
      localStorage.setItem('sevaconnect_admin_token', 'demo-admin-token');
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: 'Invalid email or password. Use admin@sevaconnect.com / admin123' };
  };

  const logout = async () => {
    setAdmin(null);
    localStorage.removeItem('sevaconnect_admin');
    localStorage.removeItem('sevaconnect_admin_token');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return context;
}
