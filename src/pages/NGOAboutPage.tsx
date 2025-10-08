import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Building2, Calendar, Users, Edit2, Save, X } from 'lucide-react';

interface AboutData {
  memberCount: string;
  establishedDate: string;
  description: string;
  paymentUpiId: string;
  paymentQrCode: string;
}

export default function NGOAboutPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [aboutData, setAboutData] = useState<AboutData>({
    memberCount: '',
    establishedDate: '',
    description: '',
    paymentUpiId: '',
    paymentQrCode: ''
  });

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem(`ngo_about_${user?.id}`);
    if (savedData) {
      setAboutData(JSON.parse(savedData));
    }
  }, [user?.id]);

  const handleSave = () => {
    localStorage.setItem(`ngo_about_${user?.id}`, JSON.stringify(aboutData));
    setIsEditing(false);
    toast({
      title: "Changes Saved",
      description: "Your NGO information has been updated successfully.",
    });
  };

  const handleCancel = () => {
    const savedData = localStorage.getItem(`ngo_about_${user?.id}`);
    if (savedData) {
      setAboutData(JSON.parse(savedData));
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">About Us</h1>
          <p className="text-muted-foreground">Manage your NGO's public profile</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
            <Button onClick={handleCancel} variant="outline" className="gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Organization Details
            </CardTitle>
            <CardDescription>
              Basic information about your NGO
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="memberCount">
                <Users className="h-4 w-4 inline mr-2" />
                Member Count
              </Label>
              <Input
                id="memberCount"
                type="number"
                placeholder="e.g., 25"
                value={aboutData.memberCount}
                onChange={(e) => setAboutData({ ...aboutData, memberCount: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="establishedDate">
                <Calendar className="h-4 w-4 inline mr-2" />
                Established Date
              </Label>
              <Input
                id="establishedDate"
                type="date"
                value={aboutData.establishedDate}
                onChange={(e) => setAboutData({ ...aboutData, establishedDate: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell donors about your mission and work..."
                value={aboutData.description}
                onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
                disabled={!isEditing}
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Online Payment Details</CardTitle>
            <CardDescription>
              Add payment options for donors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentUpiId">UPI ID / Payment Number</Label>
              <Input
                id="paymentUpiId"
                placeholder="e.g., ngo@upi or 9876543210"
                value={aboutData.paymentUpiId}
                onChange={(e) => setAboutData({ ...aboutData, paymentUpiId: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentQrCode">Payment QR Code URL</Label>
              <Input
                id="paymentQrCode"
                placeholder="https://example.com/qr-code.png"
                value={aboutData.paymentQrCode}
                onChange={(e) => setAboutData({ ...aboutData, paymentQrCode: e.target.value })}
                disabled={!isEditing}
              />
              {aboutData.paymentQrCode && (
                <div className="mt-4 p-4 border rounded-lg">
                  <p className="text-sm font-medium mb-2">QR Code Preview:</p>
                  <img
                    src={aboutData.paymentQrCode}
                    alt="Payment QR Code"
                    className="max-w-[200px] mx-auto"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbnZhbGlkIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
              )}
            </div>

            {!isEditing && aboutData.paymentUpiId && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Donors can pay using:</p>
                <p className="text-lg font-mono">{aboutData.paymentUpiId}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preview Card */}
      {!isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Public Profile Preview</CardTitle>
            <CardDescription>
              This is how donors will see your NGO information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Members</p>
                <p className="text-2xl font-bold">{aboutData.memberCount || '—'}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Established</p>
                <p className="text-2xl font-bold">
                  {aboutData.establishedDate
                    ? new Date(aboutData.establishedDate).getFullYear()
                    : '—'}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <p className="text-2xl font-bold">
                  {aboutData.paymentUpiId ? '✓' : '—'}
                </p>
              </div>
            </div>
            {aboutData.description && (
              <div>
                <p className="text-sm font-medium mb-2">About:</p>
                <p className="text-muted-foreground">{aboutData.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
