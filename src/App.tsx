import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Contexts
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import { DonorAuthProvider, useDonorAuth } from "@/contexts/DonorAuthContext";
import { DonorAppProvider } from "@/contexts/DonorAppContext";
import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext";
import { AdminAppProvider } from "@/contexts/AdminAppContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { VolunteerProvider } from "@/contexts/VolunteerContext";

// Common Components
import UniversalNavbar from "@/components/layout/UniversalNavbar"; // ✅ Add your navbar here

// Pages - Common
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";

// NGO Pages
import AuthPage from "./pages/AuthPage";
import NeedsPage from "./pages/NeedsPage";
import DonationsPage from "./pages/DonationsPage";
import InventoryPage from "./pages/InventoryPage";
import AlertsPage from "./pages/AlertsPage";
import NGOAboutPage from "./pages/NGOAboutPage";

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
import VolunteerRequestsPage from "@/pages/admin/VolunteerRequestsPage";
import NotificationsPage from "@/pages/admin/NotificationsPage";
import ReportsPage from "@/pages/admin/ReportsPage";

// Layouts
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DonorDashboardLayout } from "@/components/donor/layout/DonorDashboardLayout";
import AdminDashboardLayout from "@/components/admin/AdminDashboardLayout";

const queryClient = new QueryClient();

// Protected / Public Routes
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
}

function DonorProtectedRoute({ children }: { children: React.ReactNode }) {
  const { donor, isLoading } = useDonorAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return donor ? <>{children}</> : <Navigate to="/donor/auth" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return !user ? <>{children}</> : <Navigate to="/dashboard/needs" replace />;
}

function DonorPublicRoute({ children }: { children: React.ReactNode }) {
  const { donor, isLoading } = useDonorAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return !donor ? <>{children}</> : <Navigate to="/donor/dashboard/browse" replace />;
}

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, isLoading } = useAdminAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return admin ? <>{children}</> : <Navigate to="/admin/auth" replace />;
}

function AdminPublicRoute({ children }: { children: React.ReactNode }) {
  const { admin, isLoading } = useAdminAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return !admin ? <>{children}</> : <Navigate to="/admin/dashboard" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <NotificationProvider>
        <AuthProvider>
          <AppProvider>
            <DonorAuthProvider>
              <DonorAppProvider>
                <AdminAuthProvider>
                  <AdminAppProvider>
                    <VolunteerProvider>
                      <BrowserRouter>
                        {/* ✅ Universal Navbar visible everywhere */}
                        <UniversalNavbar />

                        <Routes>
                          {/* Landing */}
                          <Route path="/" element={<LandingPage />} />

                          {/* NGO Routes */}
                          <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
                          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                            <Route index element={<Navigate to="/dashboard/needs" replace />} />
                            <Route path="needs" element={<NeedsPage />} />
                            <Route path="donations" element={<DonationsPage />} />
                            <Route path="inventory" element={<InventoryPage />} />
                            <Route path="alerts" element={<AlertsPage />} />
                            <Route path="about" element={<NGOAboutPage />} />
                          </Route>

                          {/* Donor Routes */}
                          <Route path="/donor/auth" element={<DonorPublicRoute><DonorAuthPage /></DonorPublicRoute>} />
                          <Route path="/donor/dashboard" element={<DonorProtectedRoute><DonorDashboardLayout /></DonorProtectedRoute>}>
                            <Route index element={<Navigate to="/donor/dashboard/browse" replace />} />
                            <Route path="browse" element={<BrowseNGOsPage />} />
                            <Route path="donations" element={<MyDonationsPage />} />
                            <Route path="profile" element={<DonorProfilePage />} />
                            <Route path="volunteer" element={<BookVolunteerPage />} />
                          </Route>

                          {/* Admin Routes */}
                          <Route path="/admin/auth" element={<AdminPublicRoute><AdminAuthPage /></AdminPublicRoute>} />
                          <Route path="/admin" element={<AdminProtectedRoute><AdminDashboardLayout /></AdminProtectedRoute>}>
                            <Route index element={<Navigate to="/admin/dashboard" replace />} />
                            <Route path="dashboard" element={<AdminDashboardPage />} />
                            <Route path="verify-ngos" element={<VerifyNGOsPage />} />
                            <Route path="donors" element={<AdminDonorsPage />} />
                            <Route path="volunteers" element={<VolunteerRequestsPage />} />
                            <Route path="notifications" element={<NotificationsPage />} />
                            <Route path="reports" element={<ReportsPage />} />
                          </Route>

                          {/* Fallback */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </BrowserRouter>
                    </VolunteerProvider>
                  </AdminAppProvider>
                </AdminAuthProvider>
              </DonorAppProvider>
            </DonorAuthProvider>
          </AppProvider>
        </AuthProvider>
      </NotificationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
