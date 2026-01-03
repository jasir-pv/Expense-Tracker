import { Suspense } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AddCategoryDialog } from '@/components/add-category-dialog';
import { getCategoriesWithExpenses } from '@/app/actions/category-actions';
import { formatCurrency } from '@/lib/utils';
import * as Icons from 'lucide-react';

async function CategoriesContent() {
  const categories = await getCategoriesWithExpenses();

  const categoryTotals = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    color: cat.color,
    amount: cat.expenses.reduce((sum, exp) => sum + exp.amount, 0),
    transactionCount: cat.expenses.length,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">All Categories</h1>
          <AddCategoryDialog />
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {categoryTotals.length} categories • {categoryTotals.reduce((sum, cat) => sum + cat.transactionCount, 0)} transactions
          </p>
        </div>

        {/* Categories Grid */}
        <div className="space-y-3">
          {categoryTotals.map((cat) => {
            const IconComponent = (Icons as any)[cat.icon] || Icons.Wallet;
            return (
              <Link key={cat.id} href={`/wallet/${cat.id}`}>
                <Card className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: cat.color + '20' }}
                      >
                        <IconComponent className="w-6 h-6" style={{ color: cat.color }} />
                      </div>
                      <div>
                        <p className="font-semibold">{cat.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {cat.transactionCount} {cat.transactionCount === 1 ? 'transaction' : 'transactions'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatCurrency(cat.amount)}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {categoryTotals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No categories yet</p>
            <AddCategoryDialog />
          </div>
        )}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <CategoriesContent />
    </Suspense>
  );
}
