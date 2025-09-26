import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Heart, 
  Package, 
  Gift, 
  Warehouse, 
  AlertTriangle,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';

const navigation = [
  { name: 'Update Needs', href: '/dashboard/needs', icon: Package },
  { name: 'View Donations', href: '/dashboard/donations', icon: Gift },
  { name: 'Manage Inventory', href: '/dashboard/inventory', icon: Warehouse },
  { name: 'Alerts', href: '/dashboard/alerts', icon: AlertTriangle },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const { getUnreadAlerts } = useApp();
  const unreadAlerts = getUnreadAlerts();

  return (
    <div className="flex h-full w-64 flex-col bg-primary">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center">
          <Heart className="h-8 w-8 text-white" />
          <span className="ml-2 text-xl font-bold text-white">SevaConnect</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isAlerts = item.name === 'Alerts';
          const alertCount = isAlerts ? unreadAlerts.length : 0;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors relative',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
              {alertCount > 0 && (
                <span className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-white/20 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
              {user?.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-white/70 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-3 flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}