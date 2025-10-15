import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AddInventoryForm } from '@/components/inventory/AddInventoryForm';
import { Warehouse, AlertTriangle, Calendar, Package, Plus, Edit, Trash2, Minus } from 'lucide-react';

export default function InventoryPage() {
  const { inventory, deleteInventoryItem, updateInventoryItem } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

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

  const handleEdit = (item: any) => {
    const { category, expiryDate, ...rest } = item;
    setEditItem(rest);
    setShowAddForm(true);
  };

  const handleDelete = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteInventoryItem(itemId);
    }
  };

  const handleUseItem = (item: any) => {
    const amount = parseInt(prompt(`Enter quantity to use (available: ${item.quantity})`) || '0', 10);
    if (isNaN(amount) || amount <= 0) return alert('Invalid quantity');
    if (amount > item.quantity) return alert('Not enough stock');
    
    const updatedQuantity = item.quantity - amount;
    updateInventoryItem(item.id, { ...item, quantity: updatedQuantity });
    alert(`Used ${amount} units of ${item.name}. Remaining: ${updatedQuantity}`);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setEditItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Inventory</h1>
          <p className="text-muted-foreground">Monitor your organization's inventory and stock levels</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
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
                  <TableHead className="text-right">Actions</TableHead>
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
                      <TableCell className="text-right flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleUseItem(item)}>
                          <Minus className="h-4 w-4 mr-1" /> Use
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddInventoryForm 
        open={showAddForm} 
        onOpenChange={handleFormClose}
        editItem={editItem}
      />
    </div>
  );
}
