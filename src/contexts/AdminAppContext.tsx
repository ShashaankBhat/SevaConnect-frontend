import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    // Fetch NGO registrations from Supabase
    const fetchNGOs = async () => {
      const { data, error } = await (supabase as any)
        .from('ngos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching NGO registrations:', error);
        return;
      }

      if (data) {
        const registrations: NGORegistration[] = data.map((ngo: any) => ({
          id: ngo.id,
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
      }
    };

    fetchNGOs();

    // Subscribe to real-time changes
    const channel = (supabase as any)
      .channel('ngos-admin-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ngos'
        },
        () => {
          fetchNGOs(); // Refetch when NGOs change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const verifyNGO = async (id: string) => {
    const { error } = await (supabase as any)
      .from('ngos')
      .update({ status: 'Approved' })
      .eq('id', id);

    if (error) {
      console.error('Error verifying NGO:', error);
      return;
    }
    
    setNgoRegistrations(prev => 
      prev.map(ngo => ngo.id === id ? { ...ngo, status: 'Approved' } : ngo)
    );
  };

  const rejectNGO = async (id: string, reason?: string) => {
    const { error } = await (supabase as any)
      .from('ngos')
      .update({ 
        status: 'Rejected',
        rejection_reason: reason 
      })
      .eq('id', id);

    if (error) {
      console.error('Error rejecting NGO:', error);
      return;
    }
    
    setNgoRegistrations(prev => 
      prev.map(ngo => ngo.id === id ? { ...ngo, status: 'Rejected', rejectionReason: reason } : ngo)
    );
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
