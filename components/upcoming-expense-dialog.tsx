'use client';

import { useState, useEffect } from 'react';
import { Plus, CalendarClock, Pencil, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  createUpcomingExpense,
  updateUpcomingExpense,
  deleteUpcomingExpense,
} from '@/app/actions/upcoming-expense-actions';
import { useToast } from '@/components/ui/toast';
import { Category } from '@prisma/client';
import { UpcomingExpenseWithCategory, UpcomingExpenseFormData } from '@/types';
import { formatCurrency } from '@/lib/utils';

const AVAILABLE_ICONS = [
  'Receipt', 'CreditCard', 'Wallet', 'Home', 'Car', 'Utensils',
  'ShoppingBag', 'Wifi', 'Phone', 'Zap', 'Droplet', 'Heart',
  'GraduationCap', 'Plane', 'Music', 'Film', 'Gamepad2', 'Gift',
];

const AVAILABLE_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
];

interface AddUpcomingExpenseDialogProps {
  categories: Category[];
}

export function AddUpcomingExpenseDialog({ categories }: AddUpcomingExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [icon, setIcon] = useState('Receipt');
  const [color, setColor] = useState('#3b82f6');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [frequency, setFrequency] = useState<'one_time' | 'weekly' | 'monthly' | 'yearly'>('one_time');
  const [interval, setInterval] = useState('1');
  const [autoConvert, setAutoConvert] = useState(false);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategoryId('');
    setIcon('Receipt');
    setColor('#3b82f6');
    setDueDate(new Date().toISOString().split('T')[0]);
    setFrequency('one_time');
    setInterval('1');
    setAutoConvert(false);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const data: UpcomingExpenseFormData = {
        title,
        amount: parseFloat(amount),
        categoryId,
        icon,
        color,
        dueDate: new Date(dueDate),
        frequency,
        interval: frequency !== 'one_time' ? parseInt(interval) : undefined,
        autoConvert,
      };

      await createUpcomingExpense(data);

      addToast({
        title: 'Success',
        description: 'Upcoming expense created successfully',
        variant: 'success',
      });

      setOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create upcoming expense:', error);
      addToast({
        title: 'Error',
        description: 'Failed to create upcoming expense',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const IconPreview = (Icons as any)[icon] || Icons.Receipt;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md">
          <Plus className="w-5 h-5 mr-2" />
          Add Upcoming
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="w-5 h-5" />
            Add Upcoming Expense
          </DialogTitle>
          <DialogDescription>
            Schedule a future expense or set up a recurring payment.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Netflix Subscription"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <IconPreview className="w-4 h-4" />
                      {icon}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_ICONS.map((iconName) => {
                    const IconComp = (Icons as any)[iconName];
                    return (
                      <SelectItem key={iconName} value={iconName}>
                        <div className="flex items-center gap-2">
                          <IconComp className="w-4 h-4" />
                          {iconName}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      {color}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_COLORS.map((c) => (
                    <SelectItem key={c} value={c}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: c }}
                        />
                        {c}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_time">One Time</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {frequency !== 'one_time' && (
              <div className="space-y-2">
                <Label htmlFor="interval">Interval</Label>
                <Input
                  id="interval"
                  type="number"
                  min="1"
                  value={interval}
                  onChange={(e) => setInterval(e.target.value)}
                  placeholder="1"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoConvert"
              checked={autoConvert}
              onChange={(e) => setAutoConvert(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <Label htmlFor="autoConvert" className="text-sm font-normal cursor-pointer">
              Auto-convert to expense on due date
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Upcoming Expense'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface EditUpcomingExpenseDialogProps {
  expense: UpcomingExpenseWithCategory;
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUpcomingExpenseDialog({
  expense,
  categories,
  open,
  onOpenChange,
}: EditUpcomingExpenseDialogProps) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state
  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(expense.amount.toString());
  const [categoryId, setCategoryId] = useState(expense.categoryId);
  const [icon, setIcon] = useState(expense.icon);
  const [color, setColor] = useState(expense.color);
  const [dueDate, setDueDate] = useState(
    new Date(expense.dueDate).toISOString().split('T')[0]
  );
  const [frequency, setFrequency] = useState(expense.frequency);
  const [interval, setInterval] = useState(expense.interval?.toString() || '1');
  const [autoConvert, setAutoConvert] = useState(expense.autoConvert);

  // Reset form when expense changes
  useEffect(() => {
    setTitle(expense.title);
    setAmount(expense.amount.toString());
    setCategoryId(expense.categoryId);
    setIcon(expense.icon);
    setColor(expense.color);
    setDueDate(new Date(expense.dueDate).toISOString().split('T')[0]);
    setFrequency(expense.frequency);
    setInterval(expense.interval?.toString() || '1');
    setAutoConvert(expense.autoConvert);
  }, [expense]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUpcomingExpense(expense.id, {
        title,
        amount: parseFloat(amount),
        categoryId,
        icon,
        color,
        dueDate: new Date(dueDate),
        frequency,
        interval: frequency !== 'one_time' ? parseInt(interval) : undefined,
        autoConvert,
      });

      addToast({
        title: 'Success',
        description: 'Upcoming expense updated successfully',
        variant: 'success',
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update upcoming expense:', error);
      addToast({
        title: 'Error',
        description: 'Failed to update upcoming expense',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleteLoading(true);

    try {
      await deleteUpcomingExpense(expense.id);

      addToast({
        title: 'Deleted',
        description: `${expense.title} (${formatCurrency(expense.amount)}) has been deleted.`,
        variant: 'success',
      });

      setShowDeleteConfirm(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete upcoming expense:', error);
      addToast({
        title: 'Error',
        description: 'Failed to delete upcoming expense',
        variant: 'destructive',
      });
    } finally {
      setDeleteLoading(false);
    }
  }

  const IconPreview = (Icons as any)[icon] || Icons.Receipt;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="w-5 h-5" />
              Edit Upcoming Expense
            </DialogTitle>
            <DialogDescription>
              Update the details of your scheduled expense.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-categoryId">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icon</Label>
                <Select value={icon} onValueChange={setIcon}>
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <IconPreview className="w-4 h-4" />
                        {icon}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_ICONS.map((iconName) => {
                      const IconComp = (Icons as any)[iconName];
                      return (
                        <SelectItem key={iconName} value={iconName}>
                          <div className="flex items-center gap-2">
                            <IconComp className="w-4 h-4" />
                            {iconName}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        {color}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_COLORS.map((c) => (
                      <SelectItem key={c} value={c}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: c }}
                          />
                          {c}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-dueDate">Due Date</Label>
              <Input
                id="edit-dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select value={frequency} onValueChange={(v) => setFrequency(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one_time">One Time</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {frequency !== 'one_time' && (
                <div className="space-y-2">
                  <Label htmlFor="edit-interval">Interval</Label>
                  <Input
                    id="edit-interval"
                    type="number"
                    min="1"
                    value={interval}
                    onChange={(e) => setInterval(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-autoConvert"
                checked={autoConvert}
                onChange={(e) => setAutoConvert(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <Label htmlFor="edit-autoConvert" className="text-sm font-normal cursor-pointer">
                Auto-convert to expense on due date
              </Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
              <div className="flex-1" />
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Delete Upcoming Expense
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Are you sure you want to delete this upcoming expense?</p>
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white">{expense.title}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(expense.amount)} &bull;{' '}
                  {new Date(expense.dueDate).toLocaleDateString()}
                </p>
              </div>
              <p className="text-red-600 font-medium mt-3">
                This action cannot be undone.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
