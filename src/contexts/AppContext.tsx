import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Need {
  id: string;
  ngoId: string; // NGO that created this need
  itemName: string;
  category: string;
  quantity: number;
  urgency: 'High' | 'Medium' | 'Low';
  description?: string;
  expiryDate?: string;
  createdAt: string;
}

export interface Donation {
  id: string;
  donorName: string;
  item: string;
  quantity: number;
  status: 'Pending' | 'Confirmed' | 'Received';
  donatedAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  expiryDate?: string;
  addedAt: string;
}

export interface Alert {
  id: string;
  type: 'Low Stock' | 'Expiry' | 'New Donation';
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface AppContextType {
  needs: Need[];
  donations: Donation[];
  inventory: InventoryItem[];
  alerts: Alert[];
  addNeed: (ngoId: string, need: Omit<Need, 'id' | 'createdAt' | 'ngoId'>) => void;
  updateNeed: (id: string, need: Partial<Omit<Need, 'id' | 'ngoId' | 'createdAt'>>) => void;
  deleteNeed: (id: string) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'addedAt'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  confirmDonation: (donationId: string) => void;
  markAlertAsRead: (alertId: string) => void;
  getUnreadAlerts: () => Alert[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth(); // Logged-in NGO info

  const [needs, setNeeds] = useState<Need[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Load data from localStorage safely
  useEffect(() => {
    try {
      const savedNeeds = JSON.parse(localStorage.getItem('sevaconnect_needs') || '[]');
      const savedDonations = JSON.parse(localStorage.getItem('sevaconnect_donations') || '[]');
      const savedInventory = JSON.parse(localStorage.getItem('sevaconnect_inventory') || '[]');
      setNeeds(Array.isArray(savedNeeds) ? savedNeeds : []);
      setDonations(Array.isArray(savedDonations) ? savedDonations : []);
      setInventory(Array.isArray(savedInventory) ? savedInventory : []);
    } catch {
      setNeeds([]);
      setDonations([]);
      setInventory([]);
    }
  }, []);

  // Persist updates to localStorage
  useEffect(() => {
    localStorage.setItem('sevaconnect_needs', JSON.stringify(needs));
  }, [needs]);

  useEffect(() => {
    localStorage.setItem('sevaconnect_donations', JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem('sevaconnect_inventory', JSON.stringify(inventory));
  }, [inventory]);

  // Auto-generate alerts based on conditions
  useEffect(() => {
    const newAlerts: Alert[] = [];

    inventory.forEach(item => {
      if (item.quantity < 5) {
        newAlerts.push({
          id: `low-stock-${item.id}`,
          type: 'Low Stock',
          message: `${item.name} is running low (${item.quantity} remaining)`,
          createdAt: new Date().toISOString(),
          isRead: false,
        });
      }

      if (item.expiryDate) {
        const expiryDate = new Date(item.expiryDate);
        const soon = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        if (expiryDate <= soon) {
          newAlerts.push({
            id: `expiry-${item.id}`,
            type: 'Expiry',
            message: `${item.name} expires on ${expiryDate.toLocaleDateString()}`,
            createdAt: new Date().toISOString(),
            isRead: false,
          });
        }
      }
    });

    donations.forEach(donation => {
      if (donation.status === 'Pending') {
        newAlerts.push({
          id: `new-donation-${donation.id}`,
          type: 'New Donation',
          message: `New donation from ${donation.donorName}: ${donation.item}`,
          createdAt: donation.donatedAt,
          isRead: false,
        });
      }
    });

    setAlerts(newAlerts);
  }, [inventory, donations]);

  // --- CRUD operations for Needs ---
  const addNeed = (ngoId: string, need: Omit<Need, 'id' | 'createdAt' | 'ngoId'>) => {
    const newNeed: Need = {
      ...need,
      id: Date.now().toString(),
      ngoId,
      createdAt: new Date().toISOString(),
    };
    setNeeds(prev => [...prev, newNeed]);
  };

  const updateNeed = (id: string, updatedNeed: Partial<Omit<Need, 'id' | 'ngoId' | 'createdAt'>>) => {
    setNeeds(prev => prev.map(n => (n.id === id ? { ...n, ...updatedNeed } : n)));
  };

  const deleteNeed = (id: string) => {
    setNeeds(prev => prev.filter(n => n.id !== id));
  };

  // --- Inventory management ---
  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'addedAt'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      addedAt: new Date().toISOString(),
    };
    setInventory(prev => [...prev, newItem]);
  };

  const updateInventoryItem = (id: string, updatedItem: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item => (item.id === id ? { ...item, ...updatedItem } : item)));
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  // --- Donations and alerts ---
  const confirmDonation = (donationId: string) => {
    setDonations(prev =>
      prev.map(donation => {
        if (donation.id === donationId && donation.status === 'Pending') {
          const newItem: InventoryItem = {
            id: Date.now().toString(),
            name: donation.item,
            category: 'Donated Items',
            quantity: donation.quantity,
            addedAt: new Date().toISOString(),
          };
          setInventory(prevInv => [...prevInv, newItem]);
          return { ...donation, status: 'Received' };
        }
        return donation;
      })
    );
  };

  const markAlertAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(a => (a.id === alertId ? { ...a, isRead: true } : a)));
  };

  const getUnreadAlerts = () => alerts.filter(a => !a.isRead);

  return (
    <AppContext.Provider
      value={{
        needs,
        donations,
        inventory,
        alerts,
        addNeed,
        updateNeed,
        deleteNeed,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        confirmDonation,
        markAlertAsRead,
        getUnreadAlerts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
