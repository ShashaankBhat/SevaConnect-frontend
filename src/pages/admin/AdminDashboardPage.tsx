import { useAdminApp } from '@/contexts/AdminAppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Gift, Package, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function AdminDashboardPage() {
  const { getStats } = useAdminApp();
  const stats = getStats();

  const statCards = [
    { 
      title: 'Total NGOs', 
      value: stats.totalNGOs, 
      icon: Users, 
      description: 'Registered organizations',
      color: 'text-blue-600'
    },
    { 
      title: 'Pending Verifications', 
      value: stats.pendingVerifications, 
      icon: Clock, 
      description: 'Awaiting approval',
      color: 'text-warning'
    },
    { 
      title: 'Total Donations', 
      value: stats.totalDonations, 
      icon: Gift, 
      description: 'All time donations',
      color: 'text-success'
    },
    { 
      title: 'Inventory Items', 
      value: stats.totalInventoryItems, 
      icon: Package, 
      description: 'Total items in stock',
      color: 'text-primary'
    },
    { 
      title: 'Low Stock Alerts', 
      value: stats.lowStockItems, 
      icon: AlertTriangle, 
      description: 'Items below 5 units',
      color: 'text-destructive'
    },
    { 
      title: 'Expiring Soon', 
      value: stats.expiringItems, 
      icon: AlertTriangle, 
      description: 'Within 7 days',
      color: 'text-warning'
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and statistics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Verify NGOs</span>
              </div>
              <span className="text-xs bg-warning text-warning-foreground px-2 py-1 rounded">
                {stats.pendingVerifications} pending
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span className="text-sm font-medium">Low Stock Alerts</span>
              </div>
              <span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded">
                {stats.lowStockItems} items
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Platform Status</span>
              <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded">
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <span className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
