import React, { createContext, useContext, useState, useEffect } from 'react';

interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  isVerified: boolean;
}

interface DonorAuthContextType {
  donor: Donor | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (donorData: Omit<Donor, 'id' | 'isVerified'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  otpCode: string | null;
  generateOTP: (email: string) => void;
  verifyOTP: (code: string) => boolean;
  updateProfile: (updatedData: Partial<Donor>) => void;
}

const DonorAuthContext = createContext<DonorAuthContextType | undefined>(undefined);

export function DonorAuthProvider({ children }: { children: React.ReactNode }) {
  const [donor, setDonor] = useState<Donor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [otpCode, setOtpCode] = useState<string | null>(null);

  useEffect(() => {
    // Check if donor is logged in on app start
    const savedDonor = localStorage.getItem('sevaconnect_donor');
    if (savedDonor) {
      setDonor(JSON.parse(savedDonor));
    }
    setIsLoading(false);
  }, []);

  const generateOTP = (email: string) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(code);
    console.log(`OTP for ${email}: ${code}`); // In real app, this would be sent via SMS/email
  };

  const verifyOTP = (code: string): boolean => {
    if (code === otpCode) {
      setOtpCode(null);
      return true;
    }
    return false;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if donor exists in localStorage
    const registeredDonors = JSON.parse(localStorage.getItem('sevaconnect_donors') || '[]');
    const donorAccount = registeredDonors.find((d: any) => d.email === email && d.password === password);
    
    if (donorAccount) {
      const { password: _, ...donorData } = donorAccount;
      setDonor(donorData);
      localStorage.setItem('sevaconnect_donor', JSON.stringify(donorData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (donorData: Omit<Donor, 'id' | 'isVerified'> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const registeredDonors = JSON.parse(localStorage.getItem('sevaconnect_donors') || '[]');
    
    // Check if email already exists
    if (registeredDonors.some((d: any) => d.email === donorData.email)) {
      setIsLoading(false);
      return false;
    }
    
    const newDonor = {
      ...donorData,
      id: Date.now().toString(),
      isVerified: false,
    };
    
    registeredDonors.push(newDonor);
    localStorage.setItem('sevaconnect_donors', JSON.stringify(registeredDonors));
    
    const { password: _, ...donorToStore } = newDonor;
    setDonor(donorToStore);
    localStorage.setItem('sevaconnect_donor', JSON.stringify(donorToStore));
    
    setIsLoading(false);
    return true;
  };

  const updateProfile = (updatedData: Partial<Donor>) => {
    if (!donor) return;
    
    const updatedDonor = { ...donor, ...updatedData };
    setDonor(updatedDonor);
    localStorage.setItem('sevaconnect_donor', JSON.stringify(updatedDonor));
    
    // Update in donors list
    const registeredDonors = JSON.parse(localStorage.getItem('sevaconnect_donors') || '[]');
    const updatedDonors = registeredDonors.map((d: any) => 
      d.id === donor.id ? { ...d, ...updatedData } : d
    );
    localStorage.setItem('sevaconnect_donors', JSON.stringify(updatedDonors));
  };

  const logout = () => {
    setDonor(null);
    localStorage.removeItem('sevaconnect_donor');
  };

  return (
    <DonorAuthContext.Provider value={{ 
      donor, 
      login, 
      register, 
      logout, 
      isLoading, 
      otpCode, 
      generateOTP, 
      verifyOTP,
      updateProfile 
    }}>
      {children}
    </DonorAuthContext.Provider>
  );
}

export function useDonorAuth() {
  const context = useContext(DonorAuthContext);
  if (context === undefined) {
    throw new Error('useDonorAuth must be used within a DonorAuthProvider');
  }
  return context;
}