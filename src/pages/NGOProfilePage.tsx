import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export function NGOProfilePage() {
  const { user, setUser } = useAuth(); // ✅ added setUser
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    category: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        contact: user.contact,
        address: user.address,
        category: user.category,
        description: user.description || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = () => {
    if (!user || !setUser) return;

    const updatedUser = { ...user, ...formData };

    // Save to localStorage
    localStorage.setItem('sevaconnect_user', JSON.stringify(updatedUser));

    // Update NGOs list
    const allNGOs = JSON.parse(localStorage.getItem('sevaconnect_ngos') || '[]');
    const updatedNGOs = allNGOs.map((ngo: any) => ngo.id === user.id ? { ...ngo, ...formData } : ngo);
    localStorage.setItem('sevaconnect_ngos', JSON.stringify(updatedNGOs));

    // ✅ Update context so UI reflects changes
    setUser(updatedUser);

    toast({
      title: 'Profile Updated',
      description: 'Your NGO profile has been updated successfully',
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        contact: user.contact,
        address: user.address,
        category: user.category,
        description: user.description || ''
      });
    }
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">My NGO Profile</h1>
        <p className="text-muted-foreground">Manage your NGO's account information</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                NGO Information
              </CardTitle>
              <CardDescription>
                Your NGO details and contact information
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" /> Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" /> Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" /> Edit
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">NGO Name</Label>
            {isEditing ? (
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <User className="h-4 w-4 text-muted-foreground" /> {user.name}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <Mail className="h-4 w-4 text-muted-foreground" /> {user.email}
              <Badge variant="outline" className="ml-auto">
                {user.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact Number</Label>
            {isEditing ? (
              <Input id="contact" name="contact" value={formData.contact} onChange={handleInputChange} />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <Phone className="h-4 w-4 text-muted-foreground" /> {user.contact}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            {isEditing ? (
              <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <MapPin className="h-4 w-4 text-muted-foreground" /> {user.address}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            {isEditing ? (
              <Input id="category" name="category" value={formData.category} onChange={handleInputChange} />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-muted rounded">{user.category}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            {isEditing ? (
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
            ) : (
              <div className="flex items-start gap-2 p-2 bg-muted rounded">
                {user.description || 'No description provided'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
