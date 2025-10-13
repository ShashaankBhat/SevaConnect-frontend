import React, { createContext, useContext, useState, useEffect } from 'react';

export interface VolunteerRequest {
  id: string;
  donorId: string;
  donorName: string;
  donorEmail: string;
  ngoId: string;
  ngoName: string;
  requestDate: Date;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Scheduled';
  scheduledDate?: Date;
  notes?: string;
  skills?: string[];
  availability?: string[];
}

interface VolunteerContextType {
  volunteerRequests: VolunteerRequest[];
  addVolunteerRequest: (request: Omit<VolunteerRequest, 'id' | 'requestDate'>) => void;
  approveVolunteerRequest: (id: string) => void;
  rejectVolunteerRequest: (id: string) => void;
  scheduleVolunteerRequest: (id: string, scheduledDate: Date) => void;
  refreshData: () => void;
}

const VolunteerContext = createContext<VolunteerContextType | undefined>(undefined);

export function VolunteerProvider({ children }: { children: React.ReactNode }) {
  const [volunteerRequests, setVolunteerRequests] = useState<VolunteerRequest[]>([]);

  const loadVolunteerData = () => {
    try {
      const savedRequests = localStorage.getItem('sevaconnect_volunteer_requests');
      if (savedRequests) {
        const parsed = JSON.parse(savedRequests);
        // Convert timestamp strings back to Date objects
        const requestsWithDates = parsed.map((req: any) => ({
          ...req,
          requestDate: new Date(req.requestDate),
          scheduledDate: req.scheduledDate ? new Date(req.scheduledDate) : undefined,
        }));
        setVolunteerRequests(requestsWithDates);
      } else {
        // If no data, initialize with empty array
        setVolunteerRequests([]);
      }
    } catch (error) {
      console.error('Error loading volunteer requests:', error);
      setVolunteerRequests([]);
    }
  };

  useEffect(() => {
    loadVolunteerData();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadVolunteerData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Check for updates every 2 seconds
    const interval = setInterval(loadVolunteerData, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Save to localStorage whenever requests change
  useEffect(() => {
    localStorage.setItem('sevaconnect_volunteer_requests', JSON.stringify(volunteerRequests));
  }, [volunteerRequests]);

  const addVolunteerRequest = (requestData: Omit<VolunteerRequest, 'id' | 'requestDate'>) => {
    const newRequest: VolunteerRequest = {
      ...requestData,
      id: 'volunteer-' + Date.now().toString(),
      requestDate: new Date(),
    };
    
    setVolunteerRequests(prev => [newRequest, ...prev]);
    console.log('Volunteer request added:', newRequest);
  };

  const approveVolunteerRequest = (id: string) => {
    setVolunteerRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status: 'Approved' as const } : req)
    );
  };

  const rejectVolunteerRequest = (id: string) => {
    setVolunteerRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status: 'Rejected' as const } : req)
    );
  };

  const scheduleVolunteerRequest = (id: string, scheduledDate: Date) => {
    setVolunteerRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status: 'Scheduled' as const, scheduledDate } : req)
    );
  };

  const refreshData = () => {
    loadVolunteerData();
  };

  const contextValue: VolunteerContextType = {
    volunteerRequests,
    addVolunteerRequest,
    approveVolunteerRequest,
    rejectVolunteerRequest,
    scheduleVolunteerRequest,
    refreshData,
  };

  return (
    <VolunteerContext.Provider value={contextValue}>
      {children}
    </VolunteerContext.Provider>
  );
}

export function useVolunteer() {
  const context = useContext(VolunteerContext);
  if (context === undefined) {
    throw new Error('useVolunteer must be used within a VolunteerProvider');
  }
  return context;
}
