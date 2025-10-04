import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import { DonorAuthProvider, useDonorAuth } from "@/contexts/DonorAuthContext";
import { DonorAppProvider } from "@/contexts/DonorAppContext";
import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext";
import { AdminAppProvider } from "@/contexts/AdminAppContext";
import LandingPage from "./pages/LandingPage";

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

// Admin Pages
import AdminAuthPage from "@/pages/admin/AdminAuthPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import VerifyNGOsPage from "@/pages/admin/VerifyNGOsPage";
import AdminDonorsPage from "@/pages/admin/AdminDonorsPage";

// Layouts
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DonorDashboardLayout } from "@/components/donor/layout/DonorDashboardLayout";
import AdminDashboardLayout from "@/components/admin/AdminDashboardLayout";

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

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, isLoading } = useAdminAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return admin ? <>{children}</> : <Navigate to="/admin/auth" replace />;
}

function AdminPublicRoute({ children }: { children: React.ReactNode }) {
  const { admin, isLoading } = useAdminAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return !admin ? <>{children}</> : <Navigate to="/admin/dashboard" replace />;
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
              <AdminAuthProvider>
                <AdminAppProvider>
                  <BrowserRouter>
                    <Routes>
                    
                    <Route path="/" element={<LandingPage />} />
                     
                      
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
                      
                      {/* Admin Routes */}
                      <Route 
                        path="/admin/auth" 
                        element={
                          <AdminPublicRoute>
                            <AdminAuthPage />
                          </AdminPublicRoute>
                        } 
                      />
                      <Route 
                        path="/admin" 
                        element={
                          <AdminProtectedRoute>
                            <AdminDashboardLayout />
                          </AdminProtectedRoute>
                        }
                      >
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboardPage />} />
                        <Route path="verify-ngos" element={<VerifyNGOsPage />} />
                        <Route path="donors" element={<AdminDonorsPage />} />
                      </Route>
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </AdminAppProvider>
              </AdminAuthProvider>
            </DonorAppProvider>
          </DonorAuthProvider>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
