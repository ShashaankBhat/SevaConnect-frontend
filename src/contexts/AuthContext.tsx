import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';

interface NGOUser {
  id: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  category: string;
  description: string;
  documents?: string[];
  status: 'Pending' | 'Verified' | 'Rejected';
  rejectionReason?: string;
  submittedAt: string;
}

interface NGORegistration extends NGOUser {
  password: string;
}

interface AuthContextType {
  user: NGOUser | null;
  setUser?: React.Dispatch<React.SetStateAction<NGOUser | null>>; // ✅ added setUser
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    ngoData: Omit<NGORegistration, 'id' | 'status' | 'rejectionReason' | 'submittedAt'>
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<NGOUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('sevaconnect_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error parsing saved user:', error);
      localStorage.removeItem('sevaconnect_user');
    }
    setIsLoading(false);
  }, []);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await delay(1000);

    try {
      const registeredNGOs: NGORegistration[] = JSON.parse(localStorage.getItem('sevaconnect_ngos') || '[]');
      const ngo = registeredNGOs.find(n => n.email === email && n.password === password);

      if (ngo) {
        const { password: _, ...userData } = ngo;
        setUser(userData);
        localStorage.setItem('sevaconnect_user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
    }

    setIsLoading(false);
    return false;
  };

  const register = async (
    ngoData: Omit<NGORegistration, 'id' | 'status' | 'rejectionReason' | 'submittedAt'>
  ): Promise<boolean> => {
    setIsLoading(true);
    await delay(1000);

    try {
      const registeredNGOs: NGORegistration[] = JSON.parse(localStorage.getItem('sevaconnect_ngos') || '[]');

      if (registeredNGOs.some(n => n.email === ngoData.email)) {
        setIsLoading(false);
        return false;
      }

      const newNGO: NGORegistration = {
        ...ngoData,
        id: 'ngo-' + Date.now().toString(),
        status: 'Pending',
        submittedAt: new Date().toISOString(),
      };

      registeredNGOs.push(newNGO);
      localStorage.setItem('sevaconnect_ngos', JSON.stringify(registeredNGOs));

      const { password: _, ...userToStore } = newNGO;
      setUser(userToStore);
      localStorage.setItem('sevaconnect_user', JSON.stringify(userToStore));

      addNotification({
        type: 'new_ngo',
        title: 'New NGO Registration',
        message: `${ngoData.name} has submitted their registration for verification.`,
        relatedId: newNGO.id,
      });

      console.log('NGO registered successfully:', newNGO);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sevaconnect_user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, isLoading }}> 
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
