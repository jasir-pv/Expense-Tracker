'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { updateExpense, deleteExpense } from '@/app/actions/expense-actions';
import { useToast } from '@/components/ui/toast';
import { ExpenseWithCategory } from '@/types';
import { Category } from '@prisma/client';
import { formatCurrency } from '@/lib/utils';

interface EditTransactionDialogProps {
  expense: ExpenseWithCategory;
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTransactionDialog({
  expense,
  categories,
  open,
  onOpenChange,
}: EditTransactionDialogProps) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state
  const [amount, setAmount] = useState(expense.amount.toString());
  const [description, setDescription] = useState(expense.description || '');
  const [categoryId, setCategoryId] = useState(expense.categoryId);
  const [date, setDate] = useState(
    new Date(expense.date).toISOString().split('T')[0]
  );

  // Reset form when expense changes
  useEffect(() => {
    setAmount(expense.amount.toString());
    setDescription(expense.description || '');
    setCategoryId(expense.categoryId);
    setDate(new Date(expense.date).toISOString().split('T')[0]);
  }, [expense]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      await updateExpense(expense.id, {
        amount: parseFloat(amount),
        description: description || undefined,
        categoryId,
        date: new Date(date),
      });

      addToast({
        title: 'Transaction updated',
        description: 'Your transaction has been successfully updated.',
        variant: 'success',
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update expense:', error);
      addToast({
        title: 'Error',
        description: 'Failed to update transaction. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleteLoading(true);

    try {
      const deletedExpense = await deleteExpense(expense.id);

      addToast({
        title: 'Transaction deleted',
        description: `${deletedExpense.description || deletedExpense.category.name} (${formatCurrency(deletedExpense.amount)}) has been deleted.`,
        variant: 'success',
      });

      setShowDeleteConfirm(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete expense:', error);
      addToast({
        title: 'Error',
        description: 'Failed to delete transaction. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="w-5 h-5" />
              Edit Transaction
            </DialogTitle>
            <DialogDescription>
              Update the details of your transaction below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
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

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Input
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did you spend on?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
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
              Delete Transaction
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Are you sure you want to delete this transaction?</p>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">
                  {expense.description || expense.category.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(expense.amount)} &bull;{' '}
                  {new Date(expense.date).toLocaleDateString()}
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
              {deleteLoading ? 'Deleting...' : 'Delete Transaction'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
