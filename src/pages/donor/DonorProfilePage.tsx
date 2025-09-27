import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Edit3, Save, X } from 'lucide-react';
import { useDonorAuth } from '@/contexts/DonorAuthContext';
import { toast } from '@/hooks/use-toast';

export function DonorProfilePage() {
  const { donor, updateProfile } = useDonorAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: donor?.name || '',
    email: donor?.email || '',
    phone: donor?.phone || '',
    address: donor?.address || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleCancel = () => {
    setFormData({
      name: donor?.name || '',
      email: donor?.email || '',
      phone: donor?.phone || '',
      address: donor?.address || ''
    });
    setIsEditing(false);
  };

  if (!donor) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your personal details and contact information
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            {isEditing ? (
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <User className="h-4 w-4 text-muted-foreground" />
                {donor.name}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            {isEditing ? (
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {donor.email}
                {donor.isVerified && (
                  <Badge variant="outline" className="ml-auto">
                    Verified
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            {isEditing ? (
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {donor.phone}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            {isEditing ? (
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your full address"
              />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {donor.address || 'No address provided'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>Your account verification and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Verification</p>
              <p className="text-sm text-muted-foreground">
                Your email address has been verified
              </p>
            </div>
            <Badge variant={donor.isVerified ? "default" : "secondary"}>
              {donor.isVerified ? "Verified" : "Pending"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}