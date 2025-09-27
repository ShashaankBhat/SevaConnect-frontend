import { useState } from 'react';
import { DonorLoginForm } from '@/components/donor/auth/DonorLoginForm';
import { DonorRegisterForm } from '@/components/donor/auth/DonorRegisterForm';

export function DonorAuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <DonorLoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <DonorRegisterForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}