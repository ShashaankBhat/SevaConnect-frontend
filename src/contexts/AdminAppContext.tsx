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
  rejectNGO: (id: string) => void;
  getAllDonations: () => any[];
  getAllInventory: () => any[];
  getAllNeeds: () => any[];
  getStats: () => {
    totalNGOs: number;
    pendingVerifications: number;
    totalDonations: number;
    totalInventoryItems: number;
    lowStockItems: number;
    expiringItems: number;
  };
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

  const rejectNGO = (id: string) => {
    const ngos = JSON.parse(localStorage.getItem('sevaconnect_ngos') || '[]');
    const updatedNgos = ngos.map((ngo: any) => 
      ngo.id === id ? { ...ngo, status: 'Rejected' } : ngo
    );
    localStorage.setItem('sevaconnect_ngos', JSON.stringify(updatedNgos));
    
    setNgoRegistrations(prev => 
      prev.map(ngo => ngo.id === id ? { ...ngo, status: 'Rejected' } : ngo)
    );
  };

  const getAllDonations = () => {
    return JSON.parse(localStorage.getItem('sevaconnect_donations') || '[]');
  };

  const getAllInventory = () => {
    return JSON.parse(localStorage.getItem('sevaconnect_inventory') || '[]');
  };

  const getAllNeeds = () => {
    return JSON.parse(localStorage.getItem('sevaconnect_needs') || '[]');
  };

  const getStats = () => {
    const ngos = JSON.parse(localStorage.getItem('sevaconnect_ngos') || '[]');
    const donations = getAllDonations();
    const inventory = getAllInventory();
    
    const lowStockItems = inventory.filter((item: any) => item.quantity < 5).length;
    const expiringItems = inventory.filter((item: any) => {
      if (!item.expiryDate) return false;
      const daysUntilExpiry = Math.ceil(
        (new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
    }).length;

    return {
      totalNGOs: ngos.length,
      pendingVerifications: ngos.filter((ngo: any) => ngo.status === 'Pending').length,
      totalDonations: donations.length,
      totalInventoryItems: inventory.reduce((sum: number, item: any) => sum + item.quantity, 0),
      lowStockItems,
      expiringItems
    };
  };

  return (
    <AdminAppContext.Provider value={{
      ngoRegistrations,
      verifyNGO,
      rejectNGO,
      getAllDonations,
      getAllInventory,
      getAllNeeds,
      getStats
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
