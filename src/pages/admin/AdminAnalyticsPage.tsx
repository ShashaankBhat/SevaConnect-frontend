import { useAdminApp } from '@/contexts/AdminAppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Gift, Package } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { ngoRegistrations, getAllDonations, getAllInventory, getAllNeeds, getStats } = useAdminApp();
  const donations = getAllDonations();
  const inventory = getAllInventory();
  const needs = getAllNeeds();
  const stats = getStats();

  // Calculate category distributions
  const categoryDistribution = inventory.reduce((acc: any, item: any) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const donationsByStatus = {
    Pending: donations.filter((d: any) => d.status === 'Pending').length,
    Confirmed: donations.filter((d: any) => d.status === 'Confirmed').length,
    Received: donations.filter((d: any) => d.status === 'Received').length,
  };

  const ngosByStatus = {
    Pending: ngoRegistrations.filter(ngo => ngo.status === 'Pending').length,
    Verified: ngoRegistrations.filter(ngo => ngo.status === 'Verified').length,
    Rejected: ngoRegistrations.filter(ngo => ngo.status === 'Rejected').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
        <p className="text-muted-foreground">Platform performance and insights</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total NGOs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNGOs}</div>
            <p className="text-xs text-muted-foreground">
              {ngosByStatus.Verified} verified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donations.length}</div>
            <p className="text-xs text-muted-foreground">
              {donationsByStatus.Received} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInventoryItems}</div>
            <p className="text-xs text-muted-foreground">
              {inventory.length} unique items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Needs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{needs.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all NGOs
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>NGO Status Distribution</CardTitle>
            <CardDescription>Registration status breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(ngosByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${
                    status === 'Verified' ? 'bg-success' :
                    status === 'Pending' ? 'bg-warning' :
                    'bg-destructive'
                  }`} />
                  <span className="text-sm font-medium">{status}</span>
                </div>
                <span className="text-2xl font-bold">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donation Status</CardTitle>
            <CardDescription>Donation pipeline breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(donationsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${
                    status === 'Received' ? 'bg-success' :
                    status === 'Confirmed' ? 'bg-primary' :
                    'bg-warning'
                  }`} />
                  <span className="text-sm font-medium">{status}</span>
                </div>
                <span className="text-2xl font-bold">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
            <CardDescription>Item distribution across categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(categoryDistribution).length === 0 ? (
              <p className="text-sm text-muted-foreground">No inventory data available</p>
            ) : (
              Object.entries(categoryDistribution).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category}</span>
                  <span className="text-2xl font-bold">{count as number}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
            <CardDescription>System status indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Low Stock Alerts</span>
              <span className={`text-2xl font-bold ${stats.lowStockItems > 0 ? 'text-destructive' : 'text-success'}`}>
                {stats.lowStockItems}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Expiring Items</span>
              <span className={`text-2xl font-bold ${stats.expiringItems > 0 ? 'text-warning' : 'text-success'}`}>
                {stats.expiringItems}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Pending Verifications</span>
              <span className={`text-2xl font-bold ${stats.pendingVerifications > 0 ? 'text-warning' : 'text-success'}`}>
                {stats.pendingVerifications}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
