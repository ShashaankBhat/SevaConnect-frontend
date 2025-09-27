import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useDonorApp, type NGO } from '@/contexts/DonorAppContext';
import { toast } from '@/hooks/use-toast';

interface DonationFormProps {
  ngo: NGO;
  onBack: () => void;
}

export function DonationForm({ ngo, onBack }: DonationFormProps) {
  const { addDonation } = useDonorApp();
  const [formData, setFormData] = useState({
    item: '',
    quantity: '',
    notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.item || !formData.quantity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    addDonation({
      ngoId: ngo.id,
      ngoName: ngo.name,
      item: formData.item,
      quantity: parseInt(formData.quantity),
      notes: formData.notes,
      status: 'Pending'
    });

    setIsSubmitted(true);
    toast({
      title: "Donation Submitted!",
      description: "Your donation has been submitted successfully. The NGO will contact you soon.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-green-600">Donation Submitted Successfully!</h2>
              <p className="text-muted-foreground">
                Thank you for your generous donation to {ngo.name}. 
                They will contact you soon to arrange the collection.
              </p>
              <div className="space-y-2">
                <Button onClick={onBack} className="mr-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Browse
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Make a Donation</h1>
      </div>

      {/* NGO Information */}
      <Card>
        <CardHeader>
          <CardTitle>{ngo.name}</CardTitle>
          <CardDescription>{ngo.address}</CardDescription>
          <Badge variant="secondary" className="w-fit">{ngo.category}</Badge>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-sm font-medium mb-2">Current Needs:</p>
            <div className="flex flex-wrap gap-1">
              {ngo.needs.map((need, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {need}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Donation Details</CardTitle>
          <CardDescription>
            Please provide details about your donation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="item">Item Name *</Label>
              <Input
                id="item"
                name="item"
                type="text"
                placeholder="e.g., Rice, Winter Clothes, Medicine"
                value={formData.item}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any special instructions or details about the donation..."
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Submit Donation
              </Button>
              <Button type="button" variant="outline" onClick={onBack}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}