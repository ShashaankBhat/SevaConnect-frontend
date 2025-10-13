import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  LogOut,
  Shield,
  Bell,
  BarChart,
  Building2
} from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAdminAuth();
  const { unreadCount } = useNotifications();

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/verify-ngos', icon: Building2, label: 'Verify NGOs' },
    { path: '/admin/donors', icon: Users, label: 'Donors' },
    { path: '/admin/volunteers', icon: Users, label: 'Volunteer Requests' },
    { path: '/admin/notifications', icon: Bell, label: 'Notifications' },
    { path: '/admin/reports', icon: BarChart, label: 'Reports' },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-6">
        <Shield className="mr-2 h-6 w-6 text-primary" />
        <span className="text-lg font-semibold">Admin Panel</span>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const showBadge = item.path === '/admin/notifications' && unreadCount > 0;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm relative transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
              {showBadge && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
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
