import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Warehouse, AlertTriangle, Calendar, Package } from 'lucide-react';

export default function InventoryPage() {
  const { inventory } = useApp();

  const isLowStock = (quantity: number) => quantity < 5;
  
  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return expiry <= sevenDaysFromNow;
  };

  const getStockStatus = (quantity: number) => {
    if (quantity < 5) return { label: 'Low Stock', variant: 'destructive' as const };
    if (quantity < 10) return { label: 'Limited', variant: 'default' as const };
    return { label: 'In Stock', variant: 'secondary' as const };
  };

  const lowStockItems = inventory.filter(item => isLowStock(item.quantity));
  const expiringSoonItems = inventory.filter(item => isExpiringSoon(item.expiryDate));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Manage Inventory</h1>
        <p className="text-muted-foreground">Monitor your organization's inventory and stock levels</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">Items in inventory</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Units in stock</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Items below 5 units</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{expiringSoonItems.length}</div>
            <p className="text-xs text-muted-foreground">Within 7 days</p>
          </CardContent>
        </Card>
      </div>

      {(lowStockItems.length > 0 || expiringSoonItems.length > 0) && (
        <div className="grid gap-6 md:grid-cols-2">
          {lowStockItems.length > 0 && (
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center text-destructive">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Low Stock Alert
                </CardTitle>
                <CardDescription>Items that need immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-destructive/10 rounded">
                      <span className="font-medium">{item.name}</span>
                      <Badge variant="destructive">{item.quantity} left</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {expiringSoonItems.length > 0 && (
            <Card className="border-warning/50">
              <CardHeader>
                <CardTitle className="flex items-center text-warning">
                  <Calendar className="mr-2 h-5 w-5" />
                  Expiring Soon
                </CardTitle>
                <CardDescription>Items expiring within 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {expiringSoonItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-warning/10 rounded">
                      <span className="font-medium">{item.name}</span>
                      <Badge variant="outline" className="text-warning">
                        {item.expiryDate && new Date(item.expiryDate).toLocaleDateString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
          <CardDescription>
            All items currently in your inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          {inventory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Warehouse className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No items in inventory yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => {
                  const stockStatus = getStockStatus(item.quantity);
                  const expiring = isExpiringSoon(item.expiryDate);
                  
                  return (
                    <TableRow key={item.id} className={expiring ? 'bg-warning/5' : ''}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {isLowStock(item.quantity) && (
                            <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
                          )}
                          {expiring && (
                            <Calendar className="mr-2 h-4 w-4 text-warning" />
                          )}
                          {item.name}
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className={isLowStock(item.quantity) ? 'text-destructive font-semibold' : ''}>
                        {item.quantity}
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.variant}>
                          {stockStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.expiryDate ? (
                          <span className={expiring ? 'text-warning font-semibold' : ''}>
                            {new Date(item.expiryDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">No expiry</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(item.addedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}