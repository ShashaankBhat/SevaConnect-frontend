import React, { createContext, useContext, useState } from 'react';

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

// Mock NGO data with coordinates
const mockNGOs: NGO[] = [
  {
    id: '1',
    name: 'Food for All Foundation',
    address: '123 Charity Lane, Mumbai, Maharashtra',
    lat: 19.0760,
    lng: 72.8777,
    needs: ['Rice', 'Dal', 'Cooking Oil', 'Vegetables'],
    contact: '+91 98765 43210',
    category: 'Food',
    status: 'Approved'
  },
  {
    id: '2',
    name: 'Cloth Care Society',
    address: '456 Help Street, Delhi, India',
    lat: 28.6139,
    lng: 77.2090,
    needs: ['Winter Clothes', 'Children Clothes', 'Blankets'],
    contact: '+91 87654 32109',
    category: 'Clothes',
    status: 'Approved'
  },
  {
    id: '3',
    name: 'Health First NGO',
    address: '789 Medical Road, Bangalore, Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    needs: ['Medicines', 'First Aid Supplies', 'Medical Equipment'],
    contact: '+91 76543 21098',
    category: 'Medicine',
    status: 'Approved'
  },
  {
    id: '4',
    name: 'Education for Tomorrow',
    address: '321 Learning Avenue, Pune, Maharashtra',
    lat: 18.5204,
    lng: 73.8567,
    needs: ['Books', 'Stationery', 'Computers', 'Notebooks'],
    contact: '+91 65432 10987',
    category: 'Education',
    status: 'Approved'
  },
  {
    id: '5',
    name: 'Animal Welfare Trust',
    address: '654 Pet Care Lane, Chennai, Tamil Nadu',
    lat: 13.0827,
    lng: 80.2707,
    needs: ['Pet Food', 'Veterinary Supplies', 'Shelter Materials'],
    contact: '+91 54321 09876',
    category: 'Animal Welfare',
    status: 'Approved'
  }
].filter(ngo => ngo.status === 'Approved');

export function DonorAppProvider({ children }: { children: React.ReactNode }) {
  const [ngos] = useState<NGO[]>(mockNGOs);
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