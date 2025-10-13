import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  isVerified: boolean;
  registeredAt: string;
}

export default function AdminDonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [removeReason, setRemoveReason] = useState('');

  useEffect(() => {
    const loadDonors = () => {
      try {
        const registeredDonors = JSON.parse(localStorage.getItem('sevaconnect_donors') || '[]');
        setDonors(registeredDonors);
      } catch (error) {
        console.error('Error loading donors:', error);
        setDonors([]);
      }
    };

    loadDonors();

    const handleStorageChange = () => loadDonors();
    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(loadDonors, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const stats = {
    total: donors.length,
    verified: donors.filter((d) => d.isVerified).length,
    unverified: donors.filter((d) => !d.isVerified).length,
  };

  const handleRemoveClick = (donor: Donor) => {
    setSelectedDonor(donor);
    setRemoveReason('');
    setOpenDialog(true);
  };

  const confirmRemoveDonor = () => {
    if (!selectedDonor) return;

    const updatedDonors = donors.filter((d) => d.id !== selectedDonor.id);
    localStorage.setItem('sevaconnect_donors', JSON.stringify(updatedDonors));

    // Optionally, you could log the reason somewhere or send to backend
    console.log(`Removed donor: ${selectedDonor.name}, Reason: ${removeReason}`);

    setDonors(updatedDonors);
    setSelectedDonor(null);
    setRemoveReason('');
    setOpenDialog(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Registered Donors</h1>
        <p className="text-muted-foreground">
          All donors are automatically verified upon registration
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All registered donors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Donors</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
            <p className="text-xs text-muted-foreground">Auto-verified on registration</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verification Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Of all donors</p>
          </CardContent>
        </Card>
      </div>

      {/* Donors Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Donors</CardTitle>
          <CardDescription>
            {donors.length === 0
              ? 'No donors registered yet'
              : 'Showing all automatically verified donors'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {donors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No donors registered yet.</p>
              <p className="text-sm">
                When donors register, they will appear here as automatically verified.
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donors.map((donor) => (
                    <TableRow key={donor.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{donor.name}</TableCell>
                      <TableCell>{donor.email}</TableCell>
                      <TableCell>{donor.phone}</TableCell>
                      <TableCell>{donor.address || 'Not provided'}</TableCell>
                      <TableCell>{new Date(donor.registeredAt).toLocaleDateString()}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveClick(donor)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remove Donor Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Donor</DialogTitle>
            <DialogDescription>
              Please provide a reason for removing {selectedDonor?.name}.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for removal"
            value={removeReason}
            onChange={(e) => setRemoveReason(e.target.value)}
            className="mb-4"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={confirmRemoveDonor}
              disabled={!removeReason.trim()}
            >
              Remove Donor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Auto-Verification System
          </CardTitle>
          <CardDescription className="text-blue-700">
            All donors are automatically verified upon registration to provide instant access to
            donation features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>No manual verification required for donors</li>
            <li>Instant access to donation features</li>
            <li>Simplified registration process</li>
            <li>All donors appear as verified in the system</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
