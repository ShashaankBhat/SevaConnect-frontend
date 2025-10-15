import React, { createContext, useContext, useState, useEffect } from 'react';

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
  submittedAt: string;
  rejectionReason?: string;
}

interface Donor {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  registeredAt: string;
}

interface Donation {
  id: string;
  amount: number;
  ngoId: string;
  donorId: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

interface AdminAppContextType {
  ngoRegistrations: NGOUser[];
  donors: Donor[];
  donations: Donation[];
  verifyNGO: (id: string) => void;
  rejectNGO: (id: string, reason?: string) => void;
  refreshData: () => void;
}

const AdminAppContext = createContext<AdminAppContextType | undefined>(undefined);

export function AdminAppProvider({ children }: { children: React.ReactNode }) {
  const [ngoRegistrations, setNgoRegistrations] = useState<NGOUser[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);

  const loadNGOData = () => {
    try {
      const ngoData = JSON.parse(localStorage.getItem('sevaconnect_ngos') || '[]');
      const registrations: NGOUser[] = ngoData.map((ngo: any) => {
        const { password, ...ngoUser } = ngo;
        return ngoUser;
      });
      setNgoRegistrations(registrations);
    } catch (error) {
      console.error('Error loading NGO data:', error);
      setNgoRegistrations([]);
    }
  };

  const loadDonorData = () => {
    try {
      const donorData = JSON.parse(localStorage.getItem('sevaconnect_donors') || '[]');
      setDonors(donorData);
    } catch (error) {
      console.error('Error loading donor data:', error);
      setDonors([]);
    }
  };

  const loadDonationData = () => {
    try {
      const donationData = JSON.parse(localStorage.getItem('sevaconnect_donations') || '[]');
      setDonations(donationData);
    } catch (error) {
      console.error('Error loading donation data:', error);
      setDonations([]);
    }
  };

  useEffect(() => {
    loadNGOData();
    loadDonorData();
    loadDonationData();

    const handleStorageChange = () => {
      loadNGOData();
      loadDonorData();
      loadDonationData();
    };

    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(() => {
      loadNGOData();
      loadDonorData();
      loadDonationData();
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const verifyNGO = (id: string) => {
    const updatedRegistrations = ngoRegistrations.map(ngo =>
      ngo.id === id ? { ...ngo, status: 'Verified' as const } : ngo
    );
    setNgoRegistrations(updatedRegistrations);

    const allNGOs = JSON.parse(localStorage.getItem('sevaconnect_ngos') || '[]');
    const updatedNGOs = allNGOs.map((ngo: any) =>
      ngo.id === id ? { ...ngo, status: 'Verified' } : ngo
    );
    localStorage.setItem('sevaconnect_ngos', JSON.stringify(updatedNGOs));

    const currentUser = JSON.parse(localStorage.getItem('sevaconnect_user') || 'null');
    if (currentUser && currentUser.id === id) {
      localStorage.setItem('sevaconnect_user', JSON.stringify({
        ...currentUser,
        status: 'Verified'
      }));
    }
  };

  const rejectNGO = (id: string, reason?: string) => {
    const updatedRegistrations = ngoRegistrations.map(ngo =>
      ngo.id === id ? { ...ngo, status: 'Rejected' as const, rejectionReason: reason } : ngo
    );
    setNgoRegistrations(updatedRegistrations);

    const allNGOs = JSON.parse(localStorage.getItem('sevaconnect_ngos') || '[]');
    const updatedNGOs = allNGOs.map((ngo: any) =>
      ngo.id === id ? { ...ngo, status: 'Rejected', rejectionReason: reason } : ngo
    );
    localStorage.setItem('sevaconnect_ngos', JSON.stringify(updatedNGOs));

    const currentUser = JSON.parse(localStorage.getItem('sevaconnect_user') || 'null');
    if (currentUser && currentUser.id === id) {
      localStorage.setItem('sevaconnect_user', JSON.stringify({
        ...currentUser,
        status: 'Rejected',
        rejectionReason: reason
      }));
    }
  };

  const refreshData = () => {
    loadNGOData();
    loadDonorData();
    loadDonationData();
  };

  return (
    <AdminAppContext.Provider value={{
      ngoRegistrations,
      donors,
      donations,
      verifyNGO,
      rejectNGO,
      refreshData
    }}>
      {children}
    </AdminAppContext.Provider>
  );
}

export function useAdminApp() {
  const context = useContext(AdminAppContext);
  if (!context) throw new Error('useAdminApp must be used within an AdminAppProvider');
  return context;
}
