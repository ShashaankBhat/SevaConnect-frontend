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

interface AdminAppContextType {
  ngoRegistrations: NGOUser[];
  verifyNGO: (id: string) => void;
  rejectNGO: (id: string, reason?: string) => void;
  refreshData: () => void;
}

const AdminAppContext = createContext<AdminAppContextType | undefined>(undefined);

export function AdminAppProvider({ children }: { children: React.ReactNode }) {
  const [ngoRegistrations, setNgoRegistrations] = useState<NGOUser[]>([]);

  const loadNGOData = () => {
    try {
      // Load from sevaconnect_ngos (where registrations are stored)
      const ngoData = JSON.parse(localStorage.getItem('sevaconnect_ngos') || '[]');
      console.log('Loaded NGO data:', ngoData);
      
      if (ngoData.length > 0) {
        // Convert to NGOUser format (remove password field)
        const registrations: NGOUser[] = ngoData.map((ngo: any) => {
          const { password, ...ngoUser } = ngo;
          return ngoUser;
        });
        setNgoRegistrations(registrations);
      } else {
        // If no NGO data, set empty array
        setNgoRegistrations([]);
      }
    } catch (error) {
      console.error('Error loading NGO data:', error);
      setNgoRegistrations([]);
    }
  };

  useEffect(() => {
    loadNGOData();
    
    // Listen for storage changes to update in real-time
    const handleStorageChange = () => {
      console.log('Storage changed, reloading data...');
      loadNGOData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check every 2 seconds for changes (for same-tab updates)
    const interval = setInterval(loadNGOData, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const verifyNGO = (id: string) => {
    console.log('Verifying NGO:', id);
    
    // Update in ngoRegistrations state
    const updatedRegistrations = ngoRegistrations.map(ngo =>
      ngo.id === id ? { ...ngo, status: 'Verified' as const } : ngo
    );
    setNgoRegistrations(updatedRegistrations);
    
    // Also update in the main NGOs storage
    const allNGOs = JSON.parse(localStorage.getItem('sevaconnect_ngos') || '[]');
    const updatedNGOs = allNGOs.map((ngo: any) =>
      ngo.id === id ? { ...ngo, status: 'Verified' } : ngo
    );
    localStorage.setItem('sevaconnect_ngos', JSON.stringify(updatedNGOs));
    
    // Update user data if the NGO is currently logged in
    const currentUser = JSON.parse(localStorage.getItem('sevaconnect_user') || 'null');
    if (currentUser && currentUser.id === id) {
      localStorage.setItem('sevaconnect_user', JSON.stringify({
        ...currentUser,
        status: 'Verified'
      }));
    }
    
    console.log('NGO verified successfully');
  };

  const rejectNGO = (id: string, reason?: string) => {
    console.log('Rejecting NGO:', id, reason);
    
    // Update in ngoRegistrations state
    const updatedRegistrations = ngoRegistrations.map(ngo =>
      ngo.id === id ? { ...ngo, status: 'Rejected' as const, rejectionReason: reason } : ngo
    );
    setNgoRegistrations(updatedRegistrations);
    
    // Also update in the main NGOs storage
    const allNGOs = JSON.parse(localStorage.getItem('sevaconnect_ngos') || '[]');
    const updatedNGOs = allNGOs.map((ngo: any) =>
      ngo.id === id ? { ...ngo, status: 'Rejected', rejectionReason: reason } : ngo
    );
    localStorage.setItem('sevaconnect_ngos', JSON.stringify(updatedNGOs));
    
    // Update user data if the NGO is currently logged in
    const currentUser = JSON.parse(localStorage.getItem('sevaconnect_user') || 'null');
    if (currentUser && currentUser.id === id) {
      localStorage.setItem('sevaconnect_user', JSON.stringify({
        ...currentUser,
        status: 'Rejected',
        rejectionReason: reason
      }));
    }
    
    console.log('NGO rejected successfully');
  };

  const refreshData = () => {
    console.log('Manual refresh triggered');
    loadNGOData();
  };

  const contextValue: AdminAppContextType = {
    ngoRegistrations,
    verifyNGO,
    rejectNGO,
    refreshData
  };

  return (
    <AdminAppContext.Provider value={contextValue}>
      {children}
    </AdminAppContext.Provider>
  );
}

export function useAdminApp() {
  const context = useContext(AdminAppContext);
  if (context === undefined) {
    throw new Error('useAdminApp must be used within an AdminAppProvider');
  }
  return context;
}
