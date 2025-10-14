import { useState } from 'react';
import { useApp, type Need } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Calendar, Package } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const categories = ['Food', 'Clothing', 'Medical', 'Education', 'Shelter', 'Other'];

export default function NeedsPage() {
  const { user } = useAuth(); // NGO info
  const { needs, addNeed, updateNeed, deleteNeed } = useApp();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNeed, setEditingNeed] = useState<Need | null>(null);

  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    quantity: '',
    urgency: '',
    description: '',
    expiryDate: '',
  });

  const resetForm = () => {
    setFormData({
      itemName: '',
      category: '',
      quantity: '',
      urgency: '',
      description: '',
      expiryDate: '',
    });
    setEditingNeed(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const itemName = formData.itemName.trim();
    const category = formData.category;
    const quantity = parseInt(formData.quantity);
    const urgency = formData.urgency as 'High' | 'Medium' | 'Low';
    const description = formData.description.trim();
    const expiryDate = formData.expiryDate || '';

    if (!itemName || !category || !quantity || quantity <= 0 || !urgency) {
      alert('Please fill in all required fields with valid values.');
      return;
    }

    const needData = { itemName, category, quantity, urgency, description, expiryDate };

    if (editingNeed) {
      updateNeed(editingNeed.id, needData);
    } else {
      addNeed(user.id, needData);
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (need: Need) => {
    setEditingNeed(need);
    setFormData({
      itemName: need.itemName,
      category: need.category,
      quantity: need.quantity.toString(),
      urgency: need.urgency,
      description: need.description || '',
      expiryDate: need.expiryDate || '',
    });
    setIsDialogOpen(true);
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getUrgencyVariant = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'default';
    }
  };

  const ngoNeeds = user ? needs.filter(n => n.ngoId === user.id) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Update Needs</h1>
          <p className="text-muted-foreground">Manage your organization's current needs</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Need
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingNeed ? 'Edit Need' : 'Add New Need'}</DialogTitle>
              <DialogDescription>
                {editingNeed ? 'Update the details of this need.' : 'Add a new item that your organization needs.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    id="itemName"
                    value={formData.itemName}
                    onChange={e => handleChange('itemName', e.target.value)}
                    placeholder="e.g., Rice Bags, Blankets"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={v => handleChange('category', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={e => handleChange('quantity', e.target.value)}
                    placeholder="Enter quantity needed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency</Label>
                  <Select value={formData.urgency} onValueChange={v => handleChange('urgency', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e => handleChange('description', e.target.value)}
                    placeholder="Provide additional details about this need"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Needed By (Optional)</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={e => handleChange('expiryDate', e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingNeed ? 'Update Need' : 'Add Need'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Needs</CardTitle>
          <CardDescription>Items currently needed by your organization</CardDescription>
        </CardHeader>
        <CardContent>
          {ngoNeeds.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No needs added yet. Click "Add Need" to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Needed By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ngoNeeds.map(need => (
                  <TableRow key={need.id}>
                    <TableCell className="font-medium">{need.itemName}</TableCell>
                    <TableCell>{need.category}</TableCell>
                    <TableCell>{need.quantity}</TableCell>
                    <TableCell>
                      <Badge variant={getUrgencyVariant(need.urgency)}>{need.urgency}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {need.description || <span className="text-muted-foreground">No description</span>}
                    </TableCell>
                    <TableCell>
                      {need.expiryDate ? (
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          {new Date(need.expiryDate).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No deadline</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(need)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteNeed(need.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
