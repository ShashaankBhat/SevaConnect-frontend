import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return isLogin ? (
    <LoginForm onToggleMode={toggleMode} />
  ) : (
    <RegisterForm onToggleMode={toggleMode} />
  );
}