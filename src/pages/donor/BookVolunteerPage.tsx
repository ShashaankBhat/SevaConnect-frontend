import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Calendar, Clock, MapPin } from 'lucide-react';
import { useDonorApp } from '@/contexts/DonorAppContext';
import { useDonorAuth } from '@/contexts/DonorAuthContext';
import { toast } from '@/hooks/use-toast';

export function BookVolunteerPage() {
  const { ngos, addVolunteerBooking, volunteerBookings } = useDonorApp();
  const { donor } = useDonorAuth();
  const [selectedNGO, setSelectedNGO] = useState('');
  const [formData, setFormData] = useState({
    pickupAddress: donor?.address || '',
    date: '',
    time: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedNGO || !formData.pickupAddress || !formData.date || !formData.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedNGOData = ngos.find(ngo => ngo.id === selectedNGO);
    if (!selectedNGOData) return;

    addVolunteerBooking({
      ngoId: selectedNGO,
      ngoName: selectedNGOData.name,
      pickupAddress: formData.pickupAddress,
      dropAddress: selectedNGOData.address,
      date: formData.date,
      time: formData.time
    });

    setIsSubmitted(true);
    toast({
      title: "Volunteer Booking Confirmed!",
      description: "Your volunteer pickup has been scheduled successfully.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-green-600">Volunteer Pickup Scheduled!</h2>
              <p className="text-muted-foreground">
                Thank you for volunteering! We'll send you pickup details soon.
              </p>
              <Button onClick={() => {
                setIsSubmitted(false);
                setSelectedNGO('');
                setFormData({ pickupAddress: donor?.address || '', date: '', time: '' });
              }}>
                Schedule Another Pickup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Book Volunteer Pickup</h1>
        <p className="text-muted-foreground">
          Schedule a volunteer to pick up your donations
        </p>
      </div>

      {/* Current Bookings */}
      {volunteerBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Pickups</CardTitle>
            <CardDescription>Your scheduled volunteer pickups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {volunteerBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{booking.ngoName}</p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {booking.date} at {booking.time}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {booking.pickupAddress}
                    </p>
                  </div>
                  <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule New Pickup</CardTitle>
          <CardDescription>
            Fill in the details to schedule a volunteer pickup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ngo">Select NGO *</Label>
              <Select value={selectedNGO} onValueChange={setSelectedNGO}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an NGO" />
                </SelectTrigger>
                <SelectContent>
                  {ngos.map((ngo) => (
                    <SelectItem key={ngo.id} value={ngo.id}>
                      {ngo.name} - {ngo.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupAddress">Pickup Address *</Label>
              <Input
                id="pickupAddress"
                name="pickupAddress"
                type="text"
                placeholder="Enter pickup address"
                value={formData.pickupAddress}
                onChange={handleInputChange}
                required
              />
            </div>

            {selectedNGO && (
              <div className="space-y-2">
                <Label>Drop Address</Label>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {ngos.find(ngo => ngo.id === selectedNGO)?.address}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Preferred Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Preferred Time *</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Pickup Information</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Our volunteers will contact you 1 hour before pickup</li>
                <li>• Please ensure someone is available at the pickup address</li>
                <li>• Have your donation items ready and properly packaged</li>
                <li>• You can reschedule up to 2 hours before the pickup time</li>
              </ul>
            </div>

            <Button type="submit" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Pickup
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}