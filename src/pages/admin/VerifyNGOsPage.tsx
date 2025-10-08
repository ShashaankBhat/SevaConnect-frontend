import { useAdminApp } from '@/contexts/AdminAppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Clock, Search, Eye, Ban } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function VerifyNGOsPage() {
  const { ngoRegistrations, verifyNGO, rejectNGO } = useAdminApp();
  const { toast } = useToast();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedNGO, setSelectedNGO] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const handleVerify = (id: string, name: string) => {
    verifyNGO(id);
    toast({
      title: "NGO Verified",
      description: `${name} has been successfully verified and can now access their dashboard.`,
      duration: 3000,
    });
  };

  const openRejectDialog = (ngo: any) => {
    setSelectedNGO(ngo);
    setRejectDialogOpen(true);
    setRejectionReason('');
  };

  const openDetailsDialog = (ngo: any) => {
    setSelectedNGO(ngo);
    setDetailsDialogOpen(true);
  };

  const handleReject = () => {
    if (!selectedNGO) return;
    
    rejectNGO(selectedNGO.id, rejectionReason);
    toast({
      title: "NGO Rejected",
      description: `${selectedNGO.name} verification has been rejected.`,
      variant: "destructive",
      duration: 3000,
    });
    setRejectDialogOpen(false);
    setDetailsDialogOpen(false);
    setSelectedNGO(null);
    setRejectionReason('');
  };

  const filteredNGOs = ngoRegistrations.filter(ngo => {
    const matchesSearch = ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ngo.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ngo.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || ngo.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-success text-success-foreground">Approved</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary" className="text-warning">Pending</Badge>;
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Verify NGOs</h1>
          <p className="text-muted-foreground">Review and approve NGO registrations</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ngoRegistrations.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {ngoRegistrations.filter(ngo => ngo.status === 'Pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {ngoRegistrations.filter(ngo => ngo.status === 'Approved').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>NGO Registrations</CardTitle>
            <CardDescription>Review NGO details and verification status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by NGO name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Environment">Environment</SelectItem>
                  <SelectItem value="Food Security">Food Security</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredNGOs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No NGO registrations yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NGO Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[280px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNGOs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No NGOs found matching your filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredNGOs.map((ngo) => (
                        <TableRow key={ngo.id}>
                          <TableCell className="font-medium">{ngo.name}</TableCell>
                          <TableCell>{ngo.email}</TableCell>
                          <TableCell>{ngo.category}</TableCell>
                          <TableCell>{ngo.contact}</TableCell>
                          <TableCell>
                            {new Date(ngo.submittedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{getStatusBadge(ngo.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openDetailsDialog(ngo)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              {ngo.status === 'Pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleVerify(ngo.id, ngo.name)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Verify
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => openRejectDialog(ngo)}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* NGO Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedNGO?.name} - Details</DialogTitle>
            <DialogDescription>
              Review complete NGO information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">NGO Name</Label>
                <p className="font-medium">{selectedNGO?.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Category</Label>
                <p className="font-medium">{selectedNGO?.category}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{selectedNGO?.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Contact</Label>
                <p className="font-medium">{selectedNGO?.contact}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Address</Label>
                <p className="font-medium">{selectedNGO?.address}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Description</Label>
                <p className="font-medium">{selectedNGO?.description}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <div className="mt-1">{selectedNGO && getStatusBadge(selectedNGO.status)}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Submitted On</Label>
                <p className="font-medium">
                  {selectedNGO && new Date(selectedNGO.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            {selectedNGO?.status === 'Pending' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleVerify(selectedNGO.id, selectedNGO.name);
                    setDetailsDialogOpen(false);
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    openRejectDialog(selectedNGO);
                  }}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject NGO Registration</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {selectedNGO?.name}'s registration. This will be shown to the NGO.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject NGO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
