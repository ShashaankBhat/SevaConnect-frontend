import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Gift, 
  Package, 
  AlertTriangle,
  BarChart3,
  LogOut,
  Shield
} from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';

export default function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAdminAuth();

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/verify-ngos', icon: Shield, label: 'Verify NGOs' },
    { path: '/admin/donors', icon: Users, label: 'Donors' },
    { path: '/admin/donations', icon: Gift, label: 'Donations' },
    { path: '/admin/inventory', icon: Package, label: 'Inventory' },
    { path: '/admin/alerts', icon: AlertTriangle, label: 'Alerts' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Shield className="mr-2 h-6 w-6 text-primary" />
        <span className="text-lg font-semibold">Admin Panel</span>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
