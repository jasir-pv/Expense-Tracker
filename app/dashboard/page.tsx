import { Suspense } from 'react';
import { Bell, User, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CategoryCard } from '@/components/category-card';
import { TransactionItem } from '@/components/transaction-item';
import { AddExpenseDialog } from '@/components/add-expense-dialog';
import { AddCategoryDialog } from '@/components/add-category-dialog';
import { NavigationMenu } from '@/components/navigation-menu';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  getCategoriesWithExpenses,
  getCategories,
} from '@/app/actions/category-actions';
import { getRecentExpenses, getTotalBalance } from '@/app/actions/expense-actions';
import { formatCurrency } from '@/lib/utils';

async function DashboardContent() {
  const [categoriesWithExpenses, categories, recentExpenses, totalSpending] =
    await Promise.all([
      getCategoriesWithExpenses(),
      getCategories(),
      getRecentExpenses(5),
      getTotalBalance(),
    ]);

  const categoryTotals = categoriesWithExpenses.map((cat) => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    color: cat.color,
    amount: cat.expenses.reduce((sum, exp) => sum + exp.amount, 0),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <NavigationMenu />
          <div className="flex items-center gap-2">
            <AddExpenseDialog categories={categories} />
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Balance Card */}
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white border-none">
          <p className="text-sm opacity-90 mb-1">Main balance</p>
          <h1 className="text-4xl font-bold mb-6">
            {formatCurrency(totalSpending)}
          </h1>
          <div className="grid grid-cols-3 gap-4">
            <Link href="/analysis">
              <Button
                variant="secondary"
                className="flex flex-col items-center justify-center h-16 bg-white/20 hover:bg-white/30 text-white border-none"
              >
                <TrendingUp className="w-5 h-5 mb-1" />
                <span className="text-xs">Details</span>
              </Button>
            </Link>
          </div>
        </Card>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Quick actions</h2>
            <AddCategoryDialog />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {categoryTotals.slice(0, 4).map((cat) => (
              <CategoryCard
                key={cat.id}
                id={cat.id}
                name={cat.name}
                icon={cat.icon}
                color={cat.color}
                amount={cat.amount}
              />
            ))}
          </div>
        </div>

        {/* All Categories */}
        {categoryTotals.length > 4 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">All Categories</h2>
              <Link href="/analysis">
                <Button variant="ghost" size="sm">
                  See all <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categoryTotals.slice(4).map((cat) => (
                <CategoryCard
                  key={cat.id}
                  id={cat.id}
                  name={cat.name}
                  icon={cat.icon}
                  color={cat.color}
                  amount={cat.amount}
                />
              ))}
            </div>
          </div>
        )}

        {/* Latest Transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Latest transaction</h2>
            <Button variant="ghost" size="sm">
              See all <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <Card className="p-4">
            {recentExpenses.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No transactions yet. Add your first expense!
              </p>
            ) : (
              <div>
                {recentExpenses.map((expense) => (
                  <TransactionItem key={expense.id} expense={expense} />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <DashboardContent />
    </Suspense>
  );
}
