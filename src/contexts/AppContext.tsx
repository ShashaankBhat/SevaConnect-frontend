import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Need {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  urgency: 'High' | 'Medium' | 'Low';
  expiryDate: string;
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
  addNeed: (need: Omit<Need, 'id' | 'createdAt'>) => void;
  updateNeed: (id: string, need: Partial<Need>) => void;
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
  const [needs, setNeeds] = useState<Need[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Initialize with mock data
  useEffect(() => {
    const mockDonations: Donation[] = [
      {
        id: '1',
        donorName: 'John Smith',
        item: 'Rice Bags',
        quantity: 50,
        status: 'Pending',
        donatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        donorName: 'Green Foundation',
        item: 'Medical Supplies',
        quantity: 100,
        status: 'Confirmed',
        donatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '3',
        donorName: 'Local Community',
        item: 'Blankets',
        quantity: 25,
        status: 'Received',
        donatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: '4',
        donorName: 'City Hospital',
        item: 'First Aid Kits',
        quantity: 15,
        status: 'Pending',
        donatedAt: new Date(Date.now() - 43200000).toISOString(),
      },
      {
        id: '5',
        donorName: 'School District',
        item: 'Books & Stationery',
        quantity: 200,
        status: 'Received',
        donatedAt: new Date(Date.now() - 259200000).toISOString(),
      },
    ];

    const mockInventory: InventoryItem[] = [
      {
        id: '1',
        name: 'Blankets',
        category: 'Clothing',
        quantity: 25,
        addedAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: '2',
        name: 'Canned Food',
        category: 'Food',
        quantity: 3,
        expiryDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        addedAt: new Date(Date.now() - 432000000).toISOString(),
      },
    ];

    setDonations(mockDonations);
    setInventory(mockInventory);
  }, []);

  // Check for alerts
  useEffect(() => {
    const newAlerts: Alert[] = [];
    
    // Check for low stock items
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
    });

    // Check for expiring items
    inventory.forEach(item => {
      if (item.expiryDate) {
        const expiryDate = new Date(item.expiryDate);
        const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        
        if (expiryDate <= sevenDaysFromNow) {
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

    // Check for new donations
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

  const addNeed = (need: Omit<Need, 'id' | 'createdAt'>) => {
    const newNeed: Need = {
      ...need,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setNeeds(prev => [...prev, newNeed]);
  };

  const updateNeed = (id: string, updatedNeed: Partial<Need>) => {
    setNeeds(prev => prev.map(need => 
      need.id === id ? { ...need, ...updatedNeed } : need
    ));
  };

  const deleteNeed = (id: string) => {
    setNeeds(prev => prev.filter(need => need.id !== id));
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'addedAt'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      addedAt: new Date().toISOString(),
    };
    setInventory(prev => [...prev, newItem]);
  };

  const updateInventoryItem = (id: string, updatedItem: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, ...updatedItem } : item
    ));
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const confirmDonation = (donationId: string) => {
    setDonations(prev => prev.map(donation => {
      if (donation.id === donationId && donation.status === 'Pending') {
        // Add to inventory
        const newInventoryItem: InventoryItem = {
          id: Date.now().toString(),
          name: donation.item,
          category: 'Donated Items',
          quantity: donation.quantity,
          addedAt: new Date().toISOString(),
        };
        setInventory(prevInventory => [...prevInventory, newInventoryItem]);
        
        return { ...donation, status: 'Received' as const };
      }
      return donation;
    }));
  };

  const markAlertAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const getUnreadAlerts = () => {
    return alerts.filter(alert => !alert.isRead);
  };

  return (
    <AppContext.Provider value={{
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
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}