import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDonorApp } from '@/contexts/DonorAppContext';
import { toast } from '@/hooks/use-toast';

export function MyDonationsPage() {
  const { donations, updateDonationStatus } = useDonorApp();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'secondary';
      case 'Confirmed':
        return 'default';
      case 'Delivered':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const handleStatusUpdate = (donationId: string, newStatus: 'Confirmed' | 'Delivered') => {
    updateDonationStatus(donationId, newStatus);
    toast({
      title: "Status Updated",
      description: `Donation status updated to ${newStatus}`,
    });
  };

  if (donations.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Donations</h1>
          <p className="text-muted-foreground">Track your donation history and status</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-6xl opacity-20">💝</div>
              <h2 className="text-xl font-semibold">No donations yet</h2>
              <p className="text-muted-foreground">
                Start making a difference by browsing NGOs and making your first donation!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Donations</h1>
        <p className="text-muted-foreground">Track your donation history and status</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Donations</CardDescription>
            <CardTitle className="text-2xl">{donations.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-2xl">
              {donations.filter(d => d.status === 'Pending').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Delivered</CardDescription>
            <CardTitle className="text-2xl">
              {donations.filter(d => d.status === 'Delivered').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Donations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
          <CardDescription>View and track all your donations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>NGO</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>{donation.date}</TableCell>
                  <TableCell className="font-medium">{donation.ngoName}</TableCell>
                  <TableCell>{donation.item}</TableCell>
                  <TableCell>{donation.quantity}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(donation.status)}>
                      {donation.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {donation.notes || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {donation.status === 'Pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(donation.id, 'Confirmed')}
                        >
                          Mark Confirmed
                        </Button>
                      )}
                      {donation.status === 'Confirmed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(donation.id, 'Delivered')}
                        >
                          Mark Delivered
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}