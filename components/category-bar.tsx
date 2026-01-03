'use client';

import { CategorySpending } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CategoryBarProps {
  categories: CategorySpending[];
}

export function CategoryBar({ categories }: CategoryBarProps) {
  return (
    <div className="space-y-3">
      {/* Visual Bar */}
      <div className="flex h-3 rounded-full overflow-hidden">
        {categories.map((cat, index) => (
          <div
            key={index}
            style={{
              width: `${cat.percentage}%`,
              backgroundColor: cat.color,
            }}
            className="transition-all"
          />
        ))}
      </div>

      {/* Category List */}
      <div className="space-y-2">
        {categories.map((cat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-sm font-medium">{cat.category}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{formatCurrency(cat.amount)}</p>
              <p className="text-xs text-muted-foreground">
                {cat.percentage.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
