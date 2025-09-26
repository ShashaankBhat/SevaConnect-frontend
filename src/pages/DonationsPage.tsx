import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Gift, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DonationsPage() {
  const { donations, confirmDonation } = useApp();
  const { toast } = useToast();

  const handleConfirmReceived = (donationId: string, donorName: string, item: string) => {
    confirmDonation(donationId);
    toast({
      title: "Donation Confirmed",
      description: `Donation from ${donorName} (${item}) has been added to inventory.`,
      duration: 3000,
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pending': return 'default';
      case 'Confirmed': return 'secondary';
      case 'Received': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-warning';
      case 'Confirmed': return 'text-primary';
      case 'Received': return 'text-success';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">View Donations</h1>
        <p className="text-muted-foreground">Track and manage incoming donations</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Donations</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {donations.filter(d => d.status === 'Pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Donations</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {donations.filter(d => d.status === 'Confirmed').length}
            </div>
            <p className="text-xs text-muted-foreground">Ready to receive</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {donations.filter(d => d.status === 'Received').length}
            </div>
            <p className="text-xs text-muted-foreground">Successfully received</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
          <CardDescription>
            All donations received by your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {donations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Gift className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No donations received yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor Name</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Donated Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">{donation.donorName}</TableCell>
                    <TableCell>{donation.item}</TableCell>
                    <TableCell>{donation.quantity}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusVariant(donation.status)}
                        className={getStatusColor(donation.status)}
                      >
                        {donation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(donation.donatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {donation.status === 'Pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleConfirmReceived(donation.id, donation.donorName, donation.item)}
                        >
                          Confirm Received
                        </Button>
                      )}
                      {donation.status === 'Confirmed' && (
                        <span className="text-sm text-muted-foreground">Ready to receive</span>
                      )}
                      {donation.status === 'Received' && (
                        <span className="text-sm text-success">✓ Received</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}