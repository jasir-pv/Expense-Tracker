import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AddCategoryDialog } from '@/components/add-category-dialog';
import { NavigationMenu } from '@/components/navigation-menu';
import { AppShell } from '@/components/app-shell';
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

  const totalAmount = categoryTotals.reduce((sum, cat) => sum + cat.amount, 0);
  const totalTransactions = categoryTotals.reduce((sum, cat) => sum + cat.transactionCount, 0);

  return (
    <AppShell>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="lg:hidden">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div className="lg:hidden">
              <NavigationMenu />
            </div>
            <h1 className="hidden lg:block text-xl font-semibold text-gray-900 dark:text-white">Categories</h1>
          </div>
          <AddCategoryDialog />
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 dark:bg-gray-900 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Categories</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{categoryTotals.length}</p>
          </Card>
          <Card className="p-4 dark:bg-gray-900 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalTransactions}</p>
          </Card>
          <Card className="p-4 col-span-2 lg:col-span-2 bg-gradient-to-br from-blue-500 to-purple-600 text-white border-none">
            <p className="text-sm opacity-90">Total Spending</p>
            <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
          </Card>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {categoryTotals.map((cat) => {
            const IconComponent = (Icons as any)[cat.icon] || Icons.Wallet;
            return (
              <Link key={cat.id} href={`/wallet/${cat.id}`}>
                <Card className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 h-full dark:bg-gray-900 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: cat.color + '20' }}
                      >
                        <IconComponent className="w-6 h-6" style={{ color: cat.color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{cat.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {cat.transactionCount} {cat.transactionCount === 1 ? 'transaction' : 'transactions'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(cat.amount)}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {categoryTotals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No categories yet</p>
            <AddCategoryDialog />
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-950" />}>
      <CategoriesContent />
    </Suspense>
  );
}
