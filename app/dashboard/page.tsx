import { Suspense } from 'react';
import { Bell, User, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CategoryCard } from '@/components/category-card';
import { TransactionItem } from '@/components/transaction-item';
import { AddExpenseDialog } from '@/components/add-expense-dialog';
import { NavigationMenu } from '@/components/navigation-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { AppShell } from '@/components/app-shell';
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
    <AppShell>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <NavigationMenu />
            </div>
            <h1 className="hidden lg:block text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <AddExpenseDialog categories={categories} />
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Desktop: Two column layout */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Main content - 2 columns on desktop */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card */}
            <Card className="p-6 lg:p-8 bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none">
              <p className="text-sm opacity-90 mb-1">Main balance</p>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                {formatCurrency(totalSpending)}
              </h1>
              <div className="flex gap-4">
                <Link href="/analysis">
                  <Button
                    variant="secondary"
                    className="flex items-center gap-2 h-12 px-6 bg-white/20 hover:bg-white/30 text-white border-none"
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span>View Analysis</span>
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Categories</h2>
                  <Link href="/categories">
                    <Button variant="ghost" size="sm">
                      See all <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
          </div>

          {/* Sidebar - Latest Transactions */}
          <div className="mt-6 lg:mt-0">
            <div className="lg:sticky lg:top-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Latest transactions</h2>
                <Button variant="ghost" size="sm">
                  See all <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <Card className="p-4 dark:bg-gray-900 dark:border-gray-800">
                {recentExpenses.length === 0 ? (
                  <p className="text-center text-gray-600 dark:text-gray-400 py-4">
                    No transactions yet. Add your first expense!
                  </p>
                ) : (
                  <div>
                    {recentExpenses.map((expense) => (
                      <TransactionItem
                        key={expense.id}
                        expense={expense}
                        categories={categories}
                      />
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-950" />}>
      <DashboardContent />
    </Suspense>
  );
}
