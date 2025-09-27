import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDonorAuth } from '@/contexts/DonorAuthContext';

interface DonorRegisterFormProps {
  onToggleMode: () => void;
}

export function DonorRegisterForm({ onToggleMode }: DonorRegisterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'otp' | 'verified'>('form');
  const [otpInput, setOtpInput] = useState('');
  const { register, isLoading, generateOTP, verifyOTP, otpCode } = useDonorAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSendOTP = () => {
    if (!formData.email) {
      setError('Please enter your email first');
      return;
    }
    generateOTP(formData.email);
    setStep('otp');
    setError('');
  };

  const handleVerifyOTP = () => {
    if (verifyOTP(otpInput)) {
      setStep('verified');
      setError('');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step !== 'verified') {
      setError('Please verify your email with OTP first');
      return;
    }

    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }

    const success = await register(formData);
    if (!success) {
      setError('Email already exists');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Donor Registration</CardTitle>
        <CardDescription className="text-center">
          Create your donor account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={step !== 'form'}
              />
              {step === 'form' && (
                <Button type="button" onClick={handleSendOTP} variant="outline">
                  Send OTP
                </Button>
              )}
            </div>
          </div>

          {step === 'otp' && (
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <div className="flex gap-2">
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  maxLength={6}
                />
                <Button type="button" onClick={handleVerifyOTP} variant="outline">
                  Verify
                </Button>
              </div>
              {otpCode && (
                <Alert>
                  <AlertDescription>
                    OTP sent to your email: <strong>{otpCode}</strong>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {step === 'verified' && (
            <Alert>
              <AlertDescription className="text-green-600">
                ✓ Email verified successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              type="text"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || step !== 'verified'}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>

          <div className="text-center">
            <Button type="button" variant="link" onClick={onToggleMode}>
              Already have an account? Login here
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}