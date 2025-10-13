import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';

interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  isVerified: boolean;
  registeredAt: string;
}

interface DonorAuthContextType {
  donor: Donor | null;
  registerDonor: (donorData: Omit<Donor, 'id' | 'isVerified' | 'registeredAt'>) => Promise<boolean>;
  loginDonor: (email: string, password: string) => Promise<boolean>;
  logoutDonor: () => void;
  isLoading: boolean;
}

const DonorAuthContext = createContext<DonorAuthContextType | undefined>(undefined);

export function DonorAuthProvider({ children }: { children: React.ReactNode }) {
  const [donor, setDonor] = useState<Donor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    try {
      const savedDonor = localStorage.getItem('sevaconnect_donor');
      if (savedDonor) {
        setDonor(JSON.parse(savedDonor));
      }
    } catch (error) {
      console.error('Error parsing saved donor:', error);
      localStorage.removeItem('sevaconnect_donor');
    }
    setIsLoading(false);
  }, []);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const registerDonor = async (donorData: Omit<Donor, 'id' | 'isVerified' | 'registeredAt'>): Promise<boolean> => {
    setIsLoading(true);
    await delay(1000);

    try {
      const registeredDonors: Donor[] = JSON.parse(localStorage.getItem('sevaconnect_donors') || '[]');

      if (registeredDonors.some(d => d.email === donorData.email)) {
        setIsLoading(false);
        return false;
      }

      const newDonor: Donor = {
        ...donorData,
        id: 'donor-' + Date.now().toString(),
        isVerified: true,
        registeredAt: new Date().toISOString(),
      };

      registeredDonors.push(newDonor);
      localStorage.setItem('sevaconnect_donors', JSON.stringify(registeredDonors));

      setDonor(newDonor);
      localStorage.setItem('sevaconnect_donor', JSON.stringify(newDonor));

      // Notification for admin
      addNotification({
        type: 'new_donor',
        title: 'New Donor Registered',
        message: `${donorData.name} has registered as a new donor.`,
        relatedId: newDonor.id,
      });

      console.log('Donor registered and auto-verified:', newDonor);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Donor registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const loginDonor = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    await delay(1000);

    try {
      const registeredDonors: Donor[] = JSON.parse(localStorage.getItem('sevaconnect_donors') || '[]');
      const foundDonor = registeredDonors.find(d => d.email === email);

      if (foundDonor) {
        setDonor(foundDonor);
        localStorage.setItem('sevaconnect_donor', JSON.stringify(foundDonor));
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Donor login error:', error);
    }

    setIsLoading(false);
    return false;
  };

  const logoutDonor = () => {
    setDonor(null);
    localStorage.removeItem('sevaconnect_donor');
  };

  return (
    <DonorAuthContext.Provider value={{ donor, registerDonor, loginDonor, logoutDonor, isLoading }}>
      {children}
    </DonorAuthContext.Provider>
  );
}

export function useDonorAuth() {
  const context = useContext(DonorAuthContext);
  if (!context) throw new Error('useDonorAuth must be used within a DonorAuthProvider');
  return context;
}
