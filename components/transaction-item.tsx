import { formatCurrency, formatDate } from '@/lib/utils';
import * as Icons from 'lucide-react';
import { ExpenseWithCategory } from '@/types';

interface TransactionItemProps {
  expense: ExpenseWithCategory;
}

export function TransactionItem({ expense }: TransactionItemProps) {
  const IconComponent = (Icons as any)[expense.category.icon] || Icons.Wallet;

  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-0">
      <div
        className="p-2 rounded-lg"
        style={{ backgroundColor: expense.category.color + '20' }}
      >
        <IconComponent
          className="w-5 h-5"
          style={{ color: expense.category.color }}
        />
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm">
          {expense.description || expense.category.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(new Date(expense.date))}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold">{formatCurrency(expense.amount)}</p>
      </div>
    </div>
  );
}
