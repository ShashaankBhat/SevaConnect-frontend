import { useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAdminAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await login(email, password);
    
    if (result.success) {
      toast({
        title: "Login Successful",
        description: "Welcome back, Administrator!",
        duration: 3000,
      });
      navigate('/admin/dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: result.error || "Invalid email or password.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@sevaconnect.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Login</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Access the SevaConnect administration panel
          </p>
        </div>

        {/* Demo Credentials Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-800">
                Demo Credentials
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <p><strong>Email:</strong> admin@sevaconnect.com</p>
                <p><strong>Password:</strong> admin123</p>
              </div>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
                >
                  Auto-fill Credentials
                </button>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@sevaconnect.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>

              <div className="text-center text-xs text-muted-foreground">
                Use the demo credentials above to login
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}