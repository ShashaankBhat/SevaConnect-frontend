import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import { DonorAuthProvider, useDonorAuth } from "@/contexts/DonorAuthContext";
import { DonorAppProvider } from "@/contexts/DonorAppContext";

// NGO Pages
import AuthPage from "./pages/AuthPage";
import NeedsPage from "./pages/NeedsPage";
import DonationsPage from "./pages/DonationsPage";
import InventoryPage from "./pages/InventoryPage";
import AlertsPage from "./pages/AlertsPage";

// Donor Pages
import { DonorAuthPage } from "@/pages/donor/DonorAuthPage";
import { BrowseNGOsPage } from "@/pages/donor/BrowseNGOsPage";
import { MyDonationsPage } from "@/pages/donor/MyDonationsPage";
import { DonorProfilePage } from "@/pages/donor/DonorProfilePage";
import { BookVolunteerPage } from "@/pages/donor/BookVolunteerPage";

// Layouts
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DonorDashboardLayout } from "@/components/donor/layout/DonorDashboardLayout";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/auth" replace />;
}

function DonorProtectedRoute({ children }: { children: React.ReactNode }) {
  const { donor, isLoading } = useDonorAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return donor ? <>{children}</> : <Navigate to="/donor/auth" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return !user ? <>{children}</> : <Navigate to="/dashboard/needs" replace />;
}

function DonorPublicRoute({ children }: { children: React.ReactNode }) {
  const { donor, isLoading } = useDonorAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return !donor ? <>{children}</> : <Navigate to="/donor/dashboard/browse" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppProvider>
          <DonorAuthProvider>
            <DonorAppProvider>
              <BrowserRouter>
                <Routes>
                  {/* Root redirect - show selection page */}
                  <Route path="/" element={
                    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
                      <div className="text-center space-y-6">
                        <h1 className="text-4xl font-bold">Welcome to SevaConnect</h1>
                        <p className="text-xl text-muted-foreground">Choose your portal</p>
                        <div className="flex gap-4 justify-center">
                          <a href="/auth" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                            NGO Portal
                          </a>
                          <a href="/donor/auth" className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors">
                            Donor Portal
                          </a>
                        </div>
                      </div>
                    </div>
                  } />
                  
                  {/* NGO Routes */}
                  <Route 
                    path="/auth" 
                    element={
                      <PublicRoute>
                        <AuthPage />
                      </PublicRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Navigate to="/dashboard/needs" replace />} />
                    <Route path="needs" element={<NeedsPage />} />
                    <Route path="donations" element={<DonationsPage />} />
                    <Route path="inventory" element={<InventoryPage />} />
                    <Route path="alerts" element={<AlertsPage />} />
                  </Route>
                  
                  {/* Donor Routes */}
                  <Route 
                    path="/donor/auth" 
                    element={
                      <DonorPublicRoute>
                        <DonorAuthPage />
                      </DonorPublicRoute>
                    } 
                  />
                  <Route 
                    path="/donor/dashboard" 
                    element={
                      <DonorProtectedRoute>
                        <DonorDashboardLayout />
                      </DonorProtectedRoute>
                    }
                  >
                    <Route index element={<Navigate to="/donor/dashboard/browse" replace />} />
                    <Route path="browse" element={<BrowseNGOsPage />} />
                    <Route path="donations" element={<MyDonationsPage />} />
                    <Route path="profile" element={<DonorProfilePage />} />
                    <Route path="volunteer" element={<BookVolunteerPage />} />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </DonorAppProvider>
          </DonorAuthProvider>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
