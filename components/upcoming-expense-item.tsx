'use client';

import { useState } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import * as Icons from 'lucide-react';
import { UpcomingExpenseWithCategory } from '@/types';
import { Category } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Check, X, RefreshCw, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  markUpcomingExpenseAsPaid,
  markUpcomingExpenseAsSkipped,
  resetUpcomingExpenseStatus,
  convertUpcomingToExpense,
  deleteUpcomingExpense,
} from '@/app/actions/upcoming-expense-actions';
import { useToast } from '@/components/ui/toast';

interface UpcomingExpenseItemProps {
  expense: UpcomingExpenseWithCategory;
  categories: Category[];
  onEdit: (expense: UpcomingExpenseWithCategory) => void;
}

export function UpcomingExpenseItem({
  expense,
  categories,
  onEdit,
}: UpcomingExpenseItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const IconComponent = (Icons as any)[expense.icon] || Icons.Wallet;

  const isOverdue = new Date(expense.dueDate) < new Date() && expense.status === 'pending';
  const isPaid = expense.status === 'paid';
  const isSkipped = expense.status === 'skipped';

  const getFrequencyLabel = (frequency: string, interval?: number | null) => {
    if (interval && interval > 1) {
      switch (frequency) {
        case 'weekly':
          return `Every ${interval} weeks`;
        case 'monthly':
          return `Every ${interval} months`;
        case 'yearly':
          return `Every ${interval} years`;
        default:
          return 'One time';
      }
    }
    switch (frequency) {
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'yearly':
        return 'Yearly';
      default:
        return 'One time';
    }
  };

  const handleMarkAsPaid = async () => {
    setIsLoading(true);
    try {
      await markUpcomingExpenseAsPaid(expense.id);
      addToast({ title: 'Success', description: 'Expense marked as paid', variant: 'success' });
    } catch (error) {
      addToast({ title: 'Error', description: 'Failed to mark as paid', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsSkipped = async () => {
    setIsLoading(true);
    try {
      await markUpcomingExpenseAsSkipped(expense.id);
      addToast({ title: 'Success', description: 'Expense marked as skipped', variant: 'success' });
    } catch (error) {
      addToast({ title: 'Error', description: 'Failed to mark as skipped', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {
      await resetUpcomingExpenseStatus(expense.id);
      addToast({ title: 'Success', description: 'Expense status reset', variant: 'success' });
    } catch (error) {
      addToast({ title: 'Error', description: 'Failed to reset status', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvert = async () => {
    setIsLoading(true);
    try {
      await convertUpcomingToExpense(expense.id);
      addToast({ title: 'Success', description: 'Converted to expense successfully', variant: 'success' });
    } catch (error) {
      addToast({ title: 'Error', description: 'Failed to convert to expense', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteUpcomingExpense(expense.id);
      addToast({ title: 'Success', description: 'Expense deleted', variant: 'success' });
    } catch (error) {
      addToast({ title: 'Error', description: 'Failed to delete expense', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`py-3 px-3 border-b dark:border-gray-700 last:border-0 rounded-lg transition-colors ${
        isPaid
          ? 'bg-green-50 dark:bg-green-950/30'
          : isSkipped
          ? 'bg-gray-100 dark:bg-gray-800/50 opacity-60'
          : isOverdue
          ? 'bg-red-50 dark:bg-red-950/30'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      {/* Top row: Icon, Title, Amount, Actions */}
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-lg flex-shrink-0"
          style={{ backgroundColor: expense.color + '20' }}
        >
          <IconComponent
            className="w-5 h-5"
            style={{ color: expense.color }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`font-medium text-sm ${isPaid || isSkipped ? 'line-through' : ''} text-gray-900 dark:text-white`}>
              {expense.title}
            </p>
            {isOverdue && (
              <span className="px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full whitespace-nowrap">
                Overdue
              </span>
            )}
            {isPaid && (
              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full whitespace-nowrap">
                Paid
              </span>
            )}
            {isSkipped && (
              <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full whitespace-nowrap">
                Skipped
              </span>
            )}
          </div>
          <p className={`font-semibold text-base ${isPaid || isSkipped ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
            {formatCurrency(expense.amount)}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {expense.status === 'pending' && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900"
                onClick={handleConvert}
                disabled={isLoading}
                title="Mark as paid and convert to expense"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-600 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={handleMarkAsSkipped}
                disabled={isLoading}
                title="Skip this expense"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isLoading}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(expense)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {expense.status === 'pending' && (
                <>
                  <DropdownMenuItem onClick={handleMarkAsPaid}>
                    <Check className="w-4 h-4 mr-2" />
                    Mark as paid
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleMarkAsSkipped}>
                    <X className="w-4 h-4 mr-2" />
                    Skip
                  </DropdownMenuItem>
                </>
              )}
              {(isPaid || isSkipped) && (
                <DropdownMenuItem onClick={handleReset}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset status
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 dark:text-red-400 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Bottom row: Date, Category, Frequency, Auto-convert */}
      <div className="flex items-center gap-2 mt-2 ml-11 text-xs text-gray-600 dark:text-gray-400 flex-wrap">
        <span className="whitespace-nowrap">{formatDate(new Date(expense.dueDate))}</span>
        <span>•</span>
        <span className="whitespace-nowrap">{expense.category.name}</span>
        <span>•</span>
        <span className="whitespace-nowrap">{getFrequencyLabel(expense.frequency, expense.interval)}</span>
        {expense.autoConvert && (
          <>
            <span>•</span>
            <span className="text-blue-600 dark:text-blue-400 whitespace-nowrap">Auto</span>
          </>
        )}
      </div>
    </div>
  );
}
