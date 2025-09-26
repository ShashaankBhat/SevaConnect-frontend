import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AddInventoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem?: any;
}

export function AddInventoryForm({ open, onOpenChange, editItem }: AddInventoryFormProps) {
  const { addInventoryItem, updateInventoryItem } = useApp();
  const [formData, setFormData] = useState({
    name: editItem?.name || '',
    category: editItem?.category || '',
    quantity: editItem?.quantity || '',
    expiryDate: editItem?.expiryDate ? new Date(editItem.expiryDate) : undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.quantity) {
      return;
    }

    const itemData = {
      name: formData.name,
      category: formData.category,
      quantity: parseInt(formData.quantity),
      expiryDate: formData.expiryDate?.toISOString(),
    };

    if (editItem) {
      updateInventoryItem(editItem.id, itemData);
    } else {
      addInventoryItem(itemData);
    }

    // Reset form
    setFormData({
      name: '',
      category: '',
      quantity: '',
      expiryDate: undefined,
    });
    
    onOpenChange(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, expiryDate: date }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editItem ? 'Edit Inventory Item' : 'Add New Item'}</DialogTitle>
          <DialogDescription>
            {editItem ? 'Update the item details below.' : 'Add a new item to your inventory.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter item name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select onValueChange={handleSelectChange} value={formData.category}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Clothing">Clothing</SelectItem>
                <SelectItem value="Medicine">Medicine</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Donated Items">Donated Items</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Expiry Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.expiryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.expiryDate ? format(formData.expiryDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.expiryDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editItem ? 'Update Item' : 'Add Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}