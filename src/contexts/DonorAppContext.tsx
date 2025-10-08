import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface NGO {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  needs: string[];
  contact: string;
  category: string;
  status?: string;
  memberCount?: string;
  establishedDate?: string;
  description?: string;
  paymentUpiId?: string;
  paymentQrCode?: string;
}

export interface Donation {
  id: string;
  ngoId: string;
  ngoName: string;
  item: string;
  quantity: number;
  notes: string;
  status: 'Pending' | 'Confirmed' | 'Delivered';
  date: string;
}

export interface VolunteerBooking {
  id: string;
  ngoId: string;
  ngoName: string;
  pickupAddress: string;
  dropAddress: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
}

interface DonorAppContextType {
  ngos: NGO[];
  donations: Donation[];
  volunteerBookings: VolunteerBooking[];
  addDonation: (donation: Omit<Donation, 'id' | 'date'>) => void;
  updateDonationStatus: (id: string, status: Donation['status']) => void;
  addVolunteerBooking: (booking: Omit<VolunteerBooking, 'id' | 'status'>) => void;
}

const DonorAppContext = createContext<DonorAppContextType | undefined>(undefined);

export function DonorAppProvider({ children }: { children: React.ReactNode }) {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [donations, setDonations] = useState<Donation[]>([
    {
      id: '1',
      ngoId: '1',
      ngoName: 'Food for All Foundation',
      item: 'Rice',
      quantity: 10,
      notes: 'High quality basmati rice',
      status: 'Pending',
      date: '2024-01-15'
    },
    {
      id: '2',
      ngoId: '2',
      ngoName: 'Cloth Care Society',
      item: 'Winter Jackets',
      quantity: 5,
      notes: 'Brand new winter jackets for children',
      status: 'Confirmed',
      date: '2024-01-10'
    }
  ]);
  
  const [volunteerBookings, setVolunteerBookings] = useState<VolunteerBooking[]>([
    {
      id: '1',
      ngoId: '1',
      ngoName: 'Food for All Foundation',
      pickupAddress: '123 My Address, Mumbai',
      dropAddress: '123 Charity Lane, Mumbai, Maharashtra',
      date: '2024-01-20',
      time: '10:00',
      status: 'Scheduled'
    }
  ]);

  // Fetch approved NGOs from Supabase
  useEffect(() => {
    const fetchNGOs = async () => {
      const { data, error } = await (supabase as any)
        .from('ngos')
        .select('*')
        .eq('status', 'Approved');

      if (error) {
        console.error('Error fetching NGOs:', error);
        return;
      }

      if (data) {
        // Map database NGOs to frontend format with default coordinates
        const mappedNGOs: NGO[] = data.map((ngo: any, index: number) => ({
          id: ngo.id,
          name: ngo.name,
          address: ngo.address,
          lat: 19.0760 + (index * 0.5), // Default coordinates spread across map
          lng: 72.8777 + (index * 0.5),
          needs: ngo.documents?.needs || [],
          contact: ngo.contact,
          category: ngo.category,
          status: ngo.status,
          memberCount: ngo.documents?.member_count,
          establishedDate: ngo.documents?.established_date,
          description: ngo.description,
          paymentUpiId: ngo.documents?.payment_upi_id,
          paymentQrCode: ngo.documents?.payment_qr_code_url,
        }));
        setNgos(mappedNGOs);
      }
    };

    fetchNGOs();

    // Subscribe to real-time changes
    const channel = (supabase as any)
      .channel('ngos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ngos',
          filter: 'status=eq.Approved'
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

  const addDonation = (donation: Omit<Donation, 'id' | 'date'>) => {
    const newDonation: Donation = {
      ...donation,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setDonations(prev => [...prev, newDonation]);
  };

  const updateDonationStatus = (id: string, status: Donation['status']) => {
    setDonations(prev => 
      prev.map(donation => 
        donation.id === id ? { ...donation, status } : donation
      )
    );
  };

  const addVolunteerBooking = (booking: Omit<VolunteerBooking, 'id' | 'status'>) => {
    const newBooking: VolunteerBooking = {
      ...booking,
      id: Date.now().toString(),
      status: 'Scheduled'
    };
    setVolunteerBookings(prev => [...prev, newBooking]);
  };

  return (
    <DonorAppContext.Provider value={{
      ngos,
      donations,
      volunteerBookings,
      addDonation,
      updateDonationStatus,
      addVolunteerBooking
    }}>
      {children}
    </DonorAppContext.Provider>
  );
}

export function useDonorApp() {
  const context = useContext(DonorAppContext);
  if (context === undefined) {
    throw new Error('useDonorApp must be used within a DonorAppProvider');
  }
  return context;
}