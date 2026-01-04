import { Suspense } from 'react';
import { ArrowLeft, CalendarClock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NavigationMenu } from '@/components/navigation-menu';
import { AppShell } from '@/components/app-shell';
import { getCategories } from '@/app/actions/category-actions';
import {
  getUpcomingExpenses,
  getUpcomingExpenseSummary,
} from '@/app/actions/upcoming-expense-actions';
import { formatCurrency } from '@/lib/utils';
import { UpcomingExpensesList } from './upcoming-expenses-list';

async function UpcomingContent() {
  const [expenses, categories, summary] = await Promise.all([
    getUpcomingExpenses(),
    getCategories(),
    getUpcomingExpenseSummary(),
  ]);

  // Group expenses by frequency for display
  const weeklyExpenses = expenses.filter((e) => e.frequency === 'weekly');
  const monthlyExpenses = expenses.filter((e) => e.frequency === 'monthly');
  const yearlyExpenses = expenses.filter((e) => e.frequency === 'yearly');
  const oneTimeExpenses = expenses.filter((e) => e.frequency === 'one_time');
  const overdueExpenses = expenses.filter(
    (e) => new Date(e.dueDate) < new Date() && e.status === 'pending'
  );

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
            <h1 className="hidden lg:block text-xl font-semibold text-gray-900 dark:text-white">
              Upcoming Expenses
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
                <p className="text-xs opacity-90 mb-1">This Week</p>
                <p className="text-xl font-bold">{formatCurrency(summary.weeklyTotal)}</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none">
                <p className="text-xs opacity-90 mb-1">This Month</p>
                <p className="text-xl font-bold">{formatCurrency(summary.monthlyTotal)}</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none">
                <p className="text-xs opacity-90 mb-1">This Year</p>
                <p className="text-xl font-bold">{formatCurrency(summary.yearlyTotal)}</p>
              </Card>
              <Card className={`p-4 border-none ${summary.overdueCount > 0 ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' : 'bg-gradient-to-br from-gray-400 to-gray-500 text-white'}`}>
                <p className="text-xs opacity-90 mb-1">Overdue</p>
                <p className="text-xl font-bold">{summary.overdueCount}</p>
              </Card>
            </div>

            {/* Overdue Alert */}
            {overdueExpenses.length > 0 && (
              <Card className="p-4 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900 dark:text-red-100">
                      {overdueExpenses.length} Overdue Expense{overdueExpenses.length > 1 ? 's' : ''}
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      You have expenses that are past their due date. Mark them as paid or skip them.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Expenses List with Tabs */}
            <UpcomingExpensesList
              expenses={expenses}
              categories={categories}
              weeklyExpenses={weeklyExpenses}
              monthlyExpenses={monthlyExpenses}
              yearlyExpenses={yearlyExpenses}
              oneTimeExpenses={oneTimeExpenses}
            />
          </div>

          {/* Sidebar */}
          <div className="mt-6 lg:mt-0 space-y-6">
            {/* Quick Stats */}
            <Card className="p-6 dark:bg-gray-900 dark:border-gray-800">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <CalendarClock className="w-5 h-5" />
                Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Upcoming</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{expenses.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Weekly</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{weeklyExpenses.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Monthly</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{monthlyExpenses.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Yearly</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{yearlyExpenses.length}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">One-time</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{oneTimeExpenses.length}</span>
                </div>
              </div>
            </Card>

            {/* Recurring Expenses Info */}
            <Card className="p-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                About Recurring Expenses
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                When you mark a recurring expense as paid, a new entry will automatically
                be created for the next occurrence based on the frequency you set.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function UpcomingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-950" />}>
      <UpcomingContent />
    </Suspense>
  );
}
