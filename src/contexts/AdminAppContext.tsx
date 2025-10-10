import React, { createContext, useContext, useState, useEffect } from 'react';

interface NGORegistration {
  id: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  category: string;
  description: string;
  documents?: any;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  rejectionReason?: string;
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
    // Fetch NGO registrations from MongoDB
    const fetchNGOs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ngo-operations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ action: 'fetchAll' }),
        });

        const data = await response.json();

        if (data.error) {
          console.error('Error fetching NGO registrations:', data.error);
          return;
        }

        const registrations: NGORegistration[] = data.map((ngo: any) => ({
          id: ngo._id,
          name: ngo.name,
          email: ngo.email,
          contact: ngo.contact,
          address: ngo.address,
          category: ngo.category,
          description: ngo.description,
          documents: ngo.documents,
          status: ngo.status,
          submittedAt: ngo.created_at,
          rejectionReason: ngo.rejection_reason
        }));
        setNgoRegistrations(registrations);
      } catch (error) {
        console.error('Error fetching NGO registrations:', error);
      }
    };

    fetchNGOs();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchNGOs, 30000);

    return () => clearInterval(interval);
  }, []);

  const verifyNGO = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ngo-operations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          action: 'updateStatus',
          data: { id, status: 'Approved' }
        }),
      });

      const result = await response.json();

      if (result.error) {
        console.error('Error verifying NGO:', result.error);
        return;
      }
      
      setNgoRegistrations(prev => 
        prev.map(ngo => ngo.id === id ? { ...ngo, status: 'Approved' } : ngo)
      );
    } catch (error) {
      console.error('Error verifying NGO:', error);
    }
  };

  const rejectNGO = async (id: string, reason?: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ngo-operations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          action: 'updateStatus',
          data: { id, status: 'Rejected', rejection_reason: reason }
        }),
      });

      const result = await response.json();

      if (result.error) {
        console.error('Error rejecting NGO:', result.error);
        return;
      }
      
      setNgoRegistrations(prev => 
        prev.map(ngo => ngo.id === id ? { ...ngo, status: 'Rejected', rejectionReason: reason } : ngo)
      );
    } catch (error) {
      console.error('Error rejecting NGO:', error);
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
