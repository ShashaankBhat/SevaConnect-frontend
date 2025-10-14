import React, { createContext, useContext, useState, useEffect } from "react";

export interface NGO {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  needs: string[];
  contact: string;
  category: string;
  status: string;
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
  donorName: string;
  item: string;
  quantity: number;
  notes: string;
  status: "Pending" | "Confirmed" | "Received";
  date: string;
}

interface DonorAppContextType {
  ngos: NGO[];
  donations: Donation[];
  addDonation: (donation: Omit<Donation, "id" | "status" | "date">) => void;
  updateDonationStatus: (id: string, status: Donation["status"]) => void;
}

const DonorAppContext = createContext<DonorAppContextType | undefined>(undefined);

export function DonorAppProvider({ children }: { children: React.ReactNode }) {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);

  const fetchNGOs = () => {
    try {
      const allNGOs: any[] = JSON.parse(localStorage.getItem("sevaconnect_ngos") || "[]");
      const verifiedNGOs: NGO[] = allNGOs
        .filter((ngo) => ngo.status === "Verified")
        .map((ngo, index) => ({
          id: ngo.id,
          name: ngo.name,
          address: ngo.address,
          lat: 19.076 + 0.001 * index,
          lng: 72.8777 + 0.001 * index,
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
      setNgos(verifiedNGOs);
    } catch (error) {
      console.error(error);
      setNgos([]);
    }
  };

  const fetchDonations = () => {
    try {
      const saved: Donation[] = JSON.parse(localStorage.getItem("sevaconnect_donations") || "[]");
      setDonations(saved);
    } catch (error) {
      console.error(error);
      setDonations([]);
    }
  };

  useEffect(() => {
    fetchNGOs();
    fetchDonations();
    const interval = setInterval(() => {
      fetchNGOs();
      fetchDonations();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const saveDonations = (donations: Donation[]) => {
    localStorage.setItem("sevaconnect_donations", JSON.stringify(donations));
  };

  const addDonation = (donation: Omit<Donation, "id" | "status" | "date">) => {
    if (!donation.donorName) throw new Error("donorName is required");

    const newDonation: Donation = {
      ...donation,
      id: Date.now().toString(),
      status: "Pending",
      date: new Date().toISOString(),
    };
    const updated = [...donations, newDonation];
    setDonations(updated);
    saveDonations(updated);
  };

  const updateDonationStatus = (id: string, status: Donation["status"]) => {
    const updated = donations.map((d) => (d.id === id ? { ...d, status } : d));
    setDonations(updated);
    saveDonations(updated);
  };

  return (
    <DonorAppContext.Provider value={{ ngos, donations, addDonation, updateDonationStatus }}>
      {children}
    </DonorAppContext.Provider>
  );
}

export function useDonorApp() {
  const context = useContext(DonorAppContext);
  if (!context) throw new Error("useDonorApp must be used within DonorAppProvider");
  return context;
}
