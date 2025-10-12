import React, { createContext, useContext, useState, useEffect } from 'react';

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
  
  const [volunteerBookings, setVolunteerBookings] = useState<VolunteerBooking[]>([]);

  // Fetch approved NGOs from MongoDB
  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ngo-operations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ action: 'fetchApproved' }),
        });

        const data = await response.json();

        if (data.error) {
          console.error('Error fetching NGOs:', data.error);
          return;
        }

        // Map MongoDB NGOs to frontend format
        const mappedNGOs: NGO[] = data.map((ngo: any, index: number) => ({
          id: ngo._id,
          name: ngo.name,
          address: ngo.address,
          lat: 19.0760 + (index * 0.5),
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
      } catch (error) {
        console.error('Error fetching NGOs:', error);
      }
    };

    fetchNGOs();

    // Poll for updates every 30 seconds (replaces real-time)
    const interval = setInterval(fetchNGOs, 30000);

    return () => clearInterval(interval);
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

  const addVolunteerBooking = async (booking: Omit<VolunteerBooking, 'id' | 'status'>) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/volunteer-operations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          action: 'create',
          data: {
            ngo_name: booking.ngoName,
            donor_name: 'Donor', // This should come from donor context
            pickup_address: booking.pickupAddress,
            drop_address: booking.dropAddress,
            scheduled_date: `${booking.date} ${booking.time}`,
          }
        }),
      });

      const data = await response.json();
      
      if (data._id) {
        const newBooking: VolunteerBooking = {
          id: data._id,
          ...booking,
          status: 'Scheduled'
        };
        setVolunteerBookings(prev => [...prev, newBooking]);
      }
    } catch (error) {
      console.error('Error creating volunteer booking:', error);
    }
  };

  // Fetch volunteer bookings
  useEffect(() => {
    const fetchVolunteerBookings = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/volunteer-operations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ action: 'fetchAll' }),
        });

        const data = await response.json();
        
        if (!data.error && Array.isArray(data)) {
          const mappedBookings: VolunteerBooking[] = data.map((booking: any) => ({
            id: booking._id,
            ngoId: '', // Not stored in current schema
            ngoName: booking.ngo_name,
            pickupAddress: booking.pickup_address,
            dropAddress: booking.drop_address,
            date: booking.scheduled_date?.split(' ')[0] || '',
            time: booking.scheduled_date?.split(' ')[1] || '',
            status: booking.status as any
          }));
          setVolunteerBookings(mappedBookings);
        }
      } catch (error) {
        console.error('Error fetching volunteer bookings:', error);
      }
    };

    fetchVolunteerBookings();
  }, []);

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