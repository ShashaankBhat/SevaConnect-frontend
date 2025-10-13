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
    <div className="flex h-screen w-64 flex-col bg-primary text-primary-foreground">
      {/* Scrollable Section */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-primary-foreground/20 sticky top-0 bg-primary z-10">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span className="text-lg font-semibold">Admin Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-2 mt-2 pb-20">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const showBadge = item.path === '/admin/notifications' && unreadCount > 0;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg transition-colors relative",
                  isActive
                    ? "bg-primary-foreground text-primary font-medium"
                    : "hover:bg-primary/80"
                )}
              >
                <Icon className="h-5 w-5 mr-3" />
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
      </div>

      {/* Logout Section (Sticky Bottom) */}
      <div className="p-4 border-t border-primary-foreground/20 bg-primary sticky bottom-0">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-left rounded-lg hover:bg-primary/80 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign out
        </button>
      </div>
    </div>
  );
}
