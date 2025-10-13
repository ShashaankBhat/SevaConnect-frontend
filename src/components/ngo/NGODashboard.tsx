import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function NGODashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p>Please login to view your dashboard</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'Your NGO has been verified and approved. You can now access all features.';
      case 'Rejected':
        return user.rejectionReason
          ? `Your NGO registration was rejected. Reason: ${user.rejectionReason}`
          : 'Your NGO registration was rejected. Please contact support for more information.';
      default:
        return 'Your NGO registration is under review. Please wait for admin verification.';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">NGO Dashboard</h1>
        <Badge className={getStatusColor(user.status)}>
          <div className="flex items-center gap-2">
            {getStatusIcon(user.status)}
            {user.status}
          </div>
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registration Status</CardTitle>
          <CardDescription>Current status of your NGO verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
              {getStatusIcon(user.status)}
              <div>
                <p className="font-medium">Verification Status: {user.status}</p>
                <p className="text-sm text-muted-foreground">
                  {getStatusMessage(user.status)}
                </p>
              </div>
            </div>

            {user.status === 'Pending' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Clock className="h-4 w-4" />
                  <p className="text-sm font-medium">What happens next?</p>
                </div>
                <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                  <li>Our admin team will review your registration</li>
                  <li>This process usually takes 1-2 business days</li>
                  <li>You'll receive an email notification once verified</li>
                  <li>You can check back here for status updates</li>
                </ul>
              </div>
            )}

            {user.status === 'Rejected' && user.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-red-800">
                  <XCircle className="h-4 w-4" />
                  <p className="text-sm font-medium">Rejection Details</p>
                </div>
                <p className="mt-2 text-sm text-red-700">{user.rejectionReason}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>NGO Information</CardTitle>
          <CardDescription>Your registered NGO details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Organization Name</label>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contact</label>
              <p className="font-medium">{user.contact}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Category</label>
              <p className="font-medium">{user.category}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Address</label>
              <p className="font-medium">{user.address}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="font-medium">{user.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
