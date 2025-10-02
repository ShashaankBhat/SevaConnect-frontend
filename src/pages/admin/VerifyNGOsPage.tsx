import { useAdminApp } from '@/contexts/AdminAppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function VerifyNGOsPage() {
  const { ngoRegistrations, verifyNGO, rejectNGO } = useAdminApp();
  const { toast } = useToast();

  const handleVerify = (id: string, name: string) => {
    verifyNGO(id);
    toast({
      title: "NGO Verified",
      description: `${name} has been successfully verified.`,
      duration: 3000,
    });
  };

  const handleReject = (id: string, name: string) => {
    rejectNGO(id);
    toast({
      title: "NGO Rejected",
      description: `${name} verification has been rejected.`,
      variant: "destructive",
      duration: 3000,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Verified':
        return <Badge className="bg-success text-success-foreground">Verified</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary" className="text-warning">Pending</Badge>;
    }
  };

  return (
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
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {ngoRegistrations.filter(ngo => ngo.status === 'Verified').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>NGO Registrations</CardTitle>
          <CardDescription>Review NGO details and verification status</CardDescription>
        </CardHeader>
        <CardContent>
          {ngoRegistrations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No NGO registrations yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NGO Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ngoRegistrations.map((ngo) => (
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
                      {ngo.status === 'Pending' && (
                        <div className="flex gap-2">
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
                            onClick={() => handleReject(ngo.id, ngo.name)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                      {ngo.status === 'Verified' && (
                        <span className="text-sm text-success">✓ Approved</span>
                      )}
                      {ngo.status === 'Rejected' && (
                        <span className="text-sm text-destructive">✗ Rejected</span>
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
