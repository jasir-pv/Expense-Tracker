import { Suspense } from 'react';
import { ArrowLeft, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TransactionItem } from '@/components/transaction-item';
import { ExpenseChart } from '@/components/expense-chart';
import { NavigationMenu } from '@/components/navigation-menu';
import { AppShell } from '@/components/app-shell';
import { getCategoryById, getCategories } from '@/app/actions/category-actions';
import { formatCurrency, getMonthName } from '@/lib/utils';
import * as Icons from 'lucide-react';

async function WalletDetailsContent({ categoryId }: { categoryId: string }) {
  const [category, categories] = await Promise.all([
    getCategoryById(categoryId),
    getCategories(),
  ]);

  if (!category) {
    notFound();
  }

  const IconComponent = (Icons as any)[category.icon] || Icons.Wallet;
  const totalAmount = category.expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Prepare chart data - group by day for the last 15 days
  const today = new Date();
  const chartData = Array.from({ length: 15 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (14 - i));
    const dateStr = date.toISOString().split('T')[0];

    const dayExpenses = category.expenses.filter(
      (exp) => new Date(exp.date).toISOString().split('T')[0] === dateStr
    );

    const amount = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    return {
      date: `${date.getDate()}`,
      amount,
    };
  });

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const monthlySpent = category.expenses
    .filter((exp) => {
      const expDate = new Date(exp.date);
      return (
        expDate.getMonth() + 1 === currentMonth &&
        expDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <AppShell>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/categories" className="lg:hidden">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div className="lg:hidden">
              <NavigationMenu />
            </div>
            <div className="hidden lg:flex lg:items-center lg:gap-2">
              <Link href="/categories">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Categories
                </Button>
              </Link>
              <span className="text-gray-600 dark:text-gray-400">/</span>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{category.name}</h1>
            </div>
          </div>
          <div className="w-10 lg:hidden" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Info */}
            <Card className="p-6 lg:p-8 border-none dark:bg-gray-800" style={{ backgroundColor: category.color + '15' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: category.color + '30' }}
                  >
                    <IconComponent className="w-8 h-8" style={{ color: category.color }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{category.name}</p>
                    <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalAmount)}</p>
                  </div>
                </div>
                {/* Month Navigation - Desktop inline */}
                <div className="hidden lg:flex items-center gap-4">
                  <Button variant="ghost" size="icon">
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getMonthName(currentMonth)}, {currentYear}
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(monthlySpent)}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Month Navigation - Mobile */}
            <Card className="p-4 lg:hidden dark:bg-gray-900 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {getMonthName(currentMonth)}, {currentYear}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(monthlySpent)}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Spent</p>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </Card>

            {/* Chart */}
            <Card className="p-4 lg:p-6 dark:bg-gray-900 dark:border-gray-800">
              <h3 className="text-sm font-medium mb-4 text-gray-900 dark:text-white">Last 15 days</h3>
              <div className="h-48 lg:h-64">
                <ExpenseChart data={chartData} />
              </div>
            </Card>
          </div>

          {/* Sidebar - Transactions */}
          <div className="mt-6 lg:mt-0">
            <div className="lg:sticky lg:top-6 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search transactions"
                  className="pl-10"
                />
              </div>

              {/* Transactions */}
              <div>
                <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Latest transactions</h2>
                <Card className="p-4 dark:bg-gray-900 dark:border-gray-800">
                  {category.expenses.length === 0 ? (
                    <p className="text-center text-gray-600 dark:text-gray-400 py-4">
                      No transactions in this category yet.
                    </p>
                  ) : (
                    <div className="max-h-[500px] overflow-y-auto">
                      {category.expenses.slice(0, 10).map((expense) => (
                        <TransactionItem
                          key={expense.id}
                          expense={{ ...expense, category }}
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
      </div>
    </AppShell>
  );
}

export default async function WalletDetailsPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-950" />}>
      <WalletDetailsContent categoryId={categoryId} />
    </Suspense>
  );
}
