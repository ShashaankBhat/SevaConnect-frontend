import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Gift, Calendar, Bell, CheckCircle } from 'lucide-react';

export default function AlertsPage() {
  const { alerts, markAlertAsRead, getUnreadAlerts } = useApp();
  const unreadAlerts = getUnreadAlerts();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'Low Stock': return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'Expiry': return <Calendar className="h-5 w-5 text-warning" />;
      case 'New Donation': return <Gift className="h-5 w-5 text-primary" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'Low Stock': return 'destructive' as const;
      case 'Expiry': return 'default' as const;
      case 'New Donation': return 'secondary' as const;
      default: return 'default' as const;
    }
  };

  const handleMarkAsRead = (alertId: string) => {
    markAlertAsRead(alertId);
  };

  const handleMarkAllAsRead = () => {
    unreadAlerts.forEach(alert => markAlertAsRead(alert.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alerts</h1>
          <p className="text-muted-foreground">Stay updated with important notifications</p>
        </div>
        
        {unreadAlerts.length > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline">
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">All notifications</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{unreadAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {alerts.filter(alert => alert.type === 'Low Stock').length}
            </div>
            <p className="text-xs text-muted-foreground">Low stock items</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Bell className="mx-auto h-12 w-12 mb-4 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">No alerts at the moment. You're all caught up!</p>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`transition-all duration-200 ${
                alert.isRead 
                  ? 'opacity-60 border-muted' 
                  : 'border-l-4 border-l-primary shadow-md'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-base">{alert.type}</CardTitle>
                        <Badge variant={getAlertVariant(alert.type)}>
                          {alert.type}
                        </Badge>
                        {!alert.isRead && (
                          <Badge variant="outline" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        {new Date(alert.createdAt).toLocaleString()}
                      </CardDescription>
                    </div>
                  </div>
                  
                  {!alert.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(alert.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className={`${alert.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                  {alert.message}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}