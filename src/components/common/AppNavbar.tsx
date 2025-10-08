import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Building2, Users, Shield } from 'lucide-react';

export function AppNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SevaConnect</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate('/donor/auth')}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Donor Portal
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/auth')}
              className="gap-2"
            >
              <Building2 className="h-4 w-4" />
              NGO Portal
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/auth')}
              className="gap-2"
            >
              <Shield className="h-4 w-4" />
              Admin Portal
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
