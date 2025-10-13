import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UniversalNavbarProps {
  className?: string;
}

const UniversalNavbar: React.FC<UniversalNavbarProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show back button on landing page
  const hideBackButton = location.pathname === '/';

  const handleBack = () => {
    navigate(-1);
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container flex h-14 items-center">
        {/* Back Button */}
        {!hideBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mr-2 h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        )}

        {/* Clean SevaConnect Logo - No donor content */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleHome}
          className="flex items-center space-x-2"
        >
          <Home className="h-5 w-5" />
          <span className="font-bold">SevaConnect</span>
        </Button>
      </div>
    </nav>
  );
};

export default UniversalNavbar;