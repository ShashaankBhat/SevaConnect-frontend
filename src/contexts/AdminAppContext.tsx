import React, { createContext, useContext, useState, useEffect } from 'react';

interface NGORegistration {
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
}

interface AdminAppContextType {
  ngoRegistrations: NGORegistration[];
  verifyNGO: (id: string) => void;
  rejectNGO: (id: string, reason?: string) => void;
}

const AdminAppContext = createContext<AdminAppContextType | undefined>(undefined);

export function AdminAppProvider({ children }: { children: React.ReactNode }) {
  const [ngoRegistrations, setNgoRegistrations] = useState<NGORegistration[]>([]);

  useEffect(() => {
    // Load NGO registrations
    const ngos = JSON.parse(localStorage.getItem('sevaconnect_ngos') || '[]');
    const registrations = ngos.map((ngo: any) => ({
      ...ngo,
      status: ngo.status || 'Pending',
      submittedAt: ngo.submittedAt || new Date().toISOString()
    }));
    setNgoRegistrations(registrations);
  }, []);

  const verifyNGO = (id: string) => {
    const ngos = JSON.parse(localStorage.getItem('sevaconnect_ngos') || '[]');
    const updatedNgos = ngos.map((ngo: any) => 
      ngo.id === id ? { ...ngo, status: 'Verified' } : ngo
    );
    localStorage.setItem('sevaconnect_ngos', JSON.stringify(updatedNgos));
    
    setNgoRegistrations(prev => 
      prev.map(ngo => ngo.id === id ? { ...ngo, status: 'Verified' } : ngo)
    );
  };

  const rejectNGO = (id: string, reason?: string) => {
    const ngos = JSON.parse(localStorage.getItem('sevaconnect_ngos') || '[]');
    const updatedNgos = ngos.map((ngo: any) => 
      ngo.id === id ? { ...ngo, status: 'Rejected', rejectionReason: reason } : ngo
    );
    localStorage.setItem('sevaconnect_ngos', JSON.stringify(updatedNgos));
    
    setNgoRegistrations(prev => 
      prev.map(ngo => ngo.id === id ? { ...ngo, status: 'Rejected', rejectionReason: reason } : ngo)
    );
    
    // Update logged in user if they're the one being rejected
    const currentUser = localStorage.getItem('sevaconnect_user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.id === id) {
        const updatedUser = { ...user, status: 'Rejected', rejectionReason: reason };
        localStorage.setItem('sevaconnect_user', JSON.stringify(updatedUser));
      }
    }
  };

  return (
    <AdminAppContext.Provider value={{
      ngoRegistrations,
      verifyNGO,
      rejectNGO
    }}>
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
