import React, { createContext, useContext, useState, useEffect } from "react";

export interface NGO {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  needs: {
    title: string;
    description: string;
    quantity: number;
  }[]; // ✅ changed from string[] to object[]
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

export interface VolunteerBooking {
  id: string;
  ngoId: string;
  ngoName: string;
  pickupAddress: string;
  dropAddress: string;
  date: string;
  time: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}

interface DonorAppContextType {
  ngos: NGO[];
  donations: Donation[];
  volunteerBookings: VolunteerBooking[];
  addDonation: (donation: Omit<Donation, "id" | "status" | "date">) => void;
  updateDonationStatus: (id: string, status: Donation["status"]) => void;
  addVolunteerBooking: (booking: Omit<VolunteerBooking, "id" | "status">) => void;
  updateVolunteerStatus: (id: string, status: VolunteerBooking["status"]) => void;
}

const DonorAppContext = createContext<DonorAppContextType | undefined>(undefined);

export function DonorAppProvider({ children }: { children: React.ReactNode }) {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [volunteerBookings, setVolunteerBookings] = useState<VolunteerBooking[]>([]);

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
          // ✅ Normalize needs: convert string[] or undefined → object[]
          needs: (ngo.documents?.needs || []).map((n: any) =>
            typeof n === "string"
              ? { title: n, description: n, quantity: 1 }
              : {
                  title: n.title || "Need",
                  description: n.description || "",
                  quantity: n.quantity || 1,
                }
          ),
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

  const fetchVolunteerBookings = () => {
    try {
      const saved: VolunteerBooking[] = JSON.parse(
        localStorage.getItem("sevaconnect_volunteer_bookings") || "[]"
      );
      setVolunteerBookings(saved);
    } catch (error) {
      console.error(error);
      setVolunteerBookings([]);
    }
  };

  useEffect(() => {
    fetchNGOs();
    fetchDonations();
    fetchVolunteerBookings();

    const interval = setInterval(() => {
      fetchNGOs();
      fetchDonations();
      fetchVolunteerBookings();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const saveDonations = (data: Donation[]) =>
    localStorage.setItem("sevaconnect_donations", JSON.stringify(data));

  const saveVolunteerBookings = (data: VolunteerBooking[]) =>
    localStorage.setItem("sevaconnect_volunteer_bookings", JSON.stringify(data));

  const addDonation = (donation: Omit<Donation, "id" | "status" | "date">) => {
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

  const addVolunteerBooking = (booking: Omit<VolunteerBooking, "id" | "status">) => {
    const newBooking: VolunteerBooking = {
      ...booking,
      id: Date.now().toString(),
      status: "Scheduled",
    };
    const updated = [...volunteerBookings, newBooking];
    setVolunteerBookings(updated);
    saveVolunteerBookings(updated);
  };

  const updateVolunteerStatus = (id: string, status: VolunteerBooking["status"]) => {
    const updated = volunteerBookings.map((b) => (b.id === id ? { ...b, status } : b));
    setVolunteerBookings(updated);
    saveVolunteerBookings(updated);
  };

  return (
    <DonorAppContext.Provider
      value={{
        ngos,
        donations,
        volunteerBookings,
        addDonation,
        updateDonationStatus,
        addVolunteerBooking,
        updateVolunteerStatus,
      }}
    >
      {children}
    </DonorAppContext.Provider>
  );
}

export function useDonorApp() {
  const context = useContext(DonorAppContext);
  if (!context) throw new Error("useDonorApp must be used within DonorAppProvider");
  return context;
}
