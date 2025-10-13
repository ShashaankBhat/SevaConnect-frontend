import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, CheckCircle, AlertTriangle, Clock, Trash2, Users, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';

export default function NotificationsPage() {
  const { toast } = useToast();
  const {
    notifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    unreadCount,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState('all');

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    toast({
      title: 'Notification Read',
      description: 'Notification marked as read.',
    });
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id);
    toast({
      title: 'Notification Deleted',
      description: 'The notification has been removed.',
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast({
      title: 'All Marked as Read',
      description: 'All notifications have been marked as read.',
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'pending_approval':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'expired_item':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'new_registration':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'new_donor':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'new_ngo':
        return <Building2 className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'new_donor':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">New Donor</Badge>;
      case 'new_ngo':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">New NGO</Badge>;
      case 'pending_approval':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      default:
        return null;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead;
    if (activeTab === 'read') return n.isRead;
    return true;
  });

  const pendingActionsCount = notifications.filter(
    (n) => (n.type === 'pending_approval' || n.type === 'new_ngo') && !n.isRead
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with platform activities</p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{unreadCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{pendingActionsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Registrations</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {
                notifications.filter(
                  (n) => (n.type === 'new_donor' || n.type === 'new_ngo') && !n.isRead
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
          <CardDescription>
            Real-time notifications for donor and NGO registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
              <TabsTrigger value="read">Read ({notifications.length - unreadCount})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-2">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No notifications to display.</p>
                  <p className="text-sm">
                    Notifications will appear here when donors or NGOs register.
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-4 p-4 rounded-lg border transition-colors"
                  >
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getNotificationBadge(notification.type)}
                          {!notification.isRead && (
                            <Badge variant="secondary" className="ml-2">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
