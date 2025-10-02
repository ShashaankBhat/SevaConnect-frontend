import { useAdminApp } from '@/contexts/AdminAppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Package, Gift, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminAlertsPage() {
  const { getAllInventory, getAllDonations } = useAdminApp();
  const inventory = getAllInventory();
  const donations = getAllDonations();

  const lowStockItems = inventory.filter((item: any) => item.quantity < 5);
  const expiringItems = inventory.filter((item: any) => {
    if (!item.expiryDate) return false;
    const daysUntilExpiry = Math.ceil(
      (new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  });
  const newDonations = donations.filter((d: any) => d.status === 'Pending');

  const alerts = [
    ...lowStockItems.map((item: any) => ({
      id: `low-${item.id}`,
      type: 'Low Stock',
      message: `${item.name} is running low (${item.quantity} units remaining)`,
      severity: 'high',
      icon: Package,
      timestamp: new Date().toISOString()
    })),
    ...expiringItems.map((item: any) => {
      const daysUntilExpiry = Math.ceil(
        (new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return {
        id: `expiry-${item.id}`,
        type: 'Expiring Soon',
        message: `${item.name} expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`,
        severity: 'medium',
        icon: AlertTriangle,
        timestamp: item.expiryDate
      };
    }),
    ...newDonations.map((donation: any) => ({
      id: `donation-${donation.id}`,
      type: 'New Donation',
      message: `${donation.donorName} donated ${donation.quantity} ${donation.item}`,
      severity: 'info',
      icon: Gift,
      timestamp: donation.donatedAt
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-warning">Medium Priority</Badge>;
      case 'info':
        return <Badge variant="default">Info</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Alerts</h1>
        <p className="text-muted-foreground">Monitor critical notifications across the platform</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {alerts.filter(a => a.severity === 'high').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Donations</CardTitle>
            <Gift className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {alerts.filter(a => a.type === 'New Donation').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Alerts</CardTitle>
          <CardDescription>Recent system notifications and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No alerts at this time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => {
                const Icon = alert.icon;
                return (
                  <div
                    key={alert.id}
                    className="flex items-start gap-4 rounded-lg border p-4"
                  >
                    <Icon className={`h-5 w-5 mt-0.5 ${
                      alert.severity === 'high' ? 'text-destructive' :
                      alert.severity === 'medium' ? 'text-warning' :
                      'text-primary'
                    }`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{alert.type}</p>
                        {getSeverityBadge(alert.severity)}
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
