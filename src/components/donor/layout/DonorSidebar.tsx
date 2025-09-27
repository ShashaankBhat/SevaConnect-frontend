import { NavLink } from 'react-router-dom';
import { MapPin, Heart, User, Calendar, LogOut } from 'lucide-react';
import { useDonorAuth } from '@/contexts/DonorAuthContext';

const navigation = [
  { name: 'Browse NGOs', href: '/donor/dashboard/browse', icon: MapPin },
  { name: 'My Donations', href: '/donor/dashboard/donations', icon: Heart },
  { name: 'Profile', href: '/donor/dashboard/profile', icon: User },
  { name: 'Book Volunteer', href: '/donor/dashboard/volunteer', icon: Calendar },
];

export function DonorSidebar() {
  const { donor, logout } = useDonorAuth();

  return (
    <div className="w-64 bg-primary text-primary-foreground flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-xl font-bold">SevaConnect</h1>
        <p className="text-sm opacity-90">Donor Portal</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-foreground text-primary font-medium'
                  : 'hover:bg-primary/80'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-primary-foreground/20">
        <div className="mb-4">
          <p className="font-medium">{donor?.name}</p>
          <p className="text-sm opacity-75">{donor?.email}</p>
        </div>
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