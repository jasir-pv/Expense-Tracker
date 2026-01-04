'use client';

import { useState } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import * as Icons from 'lucide-react';
import { ExpenseWithCategory } from '@/types';
import { EditTransactionDialog } from '@/components/edit-transaction-dialog';
import { Category } from '@prisma/client';

interface TransactionItemProps {
  expense: ExpenseWithCategory;
  categories?: Category[];
  editable?: boolean;
}

export function TransactionItem({
  expense,
  categories = [],
  editable = true,
}: TransactionItemProps) {
  const [editOpen, setEditOpen] = useState(false);
  const IconComponent = (Icons as any)[expense.category.icon] || Icons.Wallet;

  const isClickable = editable && categories.length > 0;

  const handleClick = () => {
    if (isClickable) {
      setEditOpen(true);
    }
  };

  return (
    <>
      <div
        className={`flex items-center gap-3 py-3 border-b dark:border-gray-700 last:border-0 ${
          isClickable
            ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 -mx-2 px-2 rounded-lg transition-colors'
            : ''
        }`}
        onClick={handleClick}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && isClickable) {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: expense.category.color + '20' }}
        >
          <IconComponent
            className="w-5 h-5"
            style={{ color: expense.category.color }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate text-gray-900 dark:text-white">
            {expense.description || expense.category.name}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {formatDate(new Date(expense.date))}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(expense.amount)}</p>
          {isClickable && (
            <p className="text-xs text-gray-600 dark:text-gray-400">Tap to edit</p>
          )}
        </div>
      </div>

      {isClickable && (
        <EditTransactionDialog
          expense={expense}
          categories={categories}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
    </>
  );
}
