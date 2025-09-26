import React, { createContext, useContext, useState, useEffect } from 'react';

interface NGO {
  id: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  category: string;
  description: string;
  documents?: string[];
}

interface AuthContextType {
  user: NGO | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (ngoData: Omit<NGO, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<NGO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('sevaconnect_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if NGO exists in localStorage
    const registeredNGOs = JSON.parse(localStorage.getItem('sevaconnect_ngos') || '[]');
    const ngo = registeredNGOs.find((n: any) => n.email === email && n.password === password);
    
    if (ngo) {
      const { password: _, ...ngoData } = ngo;
      setUser(ngoData);
      localStorage.setItem('sevaconnect_user', JSON.stringify(ngoData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (ngoData: Omit<NGO, 'id'> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const registeredNGOs = JSON.parse(localStorage.getItem('sevaconnect_ngos') || '[]');
    
    // Check if email already exists
    if (registeredNGOs.some((n: any) => n.email === ngoData.email)) {
      setIsLoading(false);
      return false;
    }
    
    const newNGO = {
      ...ngoData,
      id: Date.now().toString(),
    };
    
    registeredNGOs.push(newNGO);
    localStorage.setItem('sevaconnect_ngos', JSON.stringify(registeredNGOs));
    
    const { password: _, ...userToStore } = newNGO;
    setUser(userToStore);
    localStorage.setItem('sevaconnect_user', JSON.stringify(userToStore));
    
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sevaconnect_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}