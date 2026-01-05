import { Suspense } from 'react';
import { ArrowLeft, Receipt } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NavigationMenu } from '@/components/navigation-menu';
import { AppShell } from '@/components/app-shell';
import { TransactionFilters } from '@/components/transaction-filters';
import { TransactionItem } from '@/components/transaction-item';
import { getFilteredTransactions, TransactionFilters as TFilters } from '@/app/actions/expense-actions';
import { getCategories } from '@/app/actions/category-actions';
import { formatCurrency, formatDate } from '@/lib/utils';

interface TransactionsPageProps {
  searchParams: Promise<{
    filter?: string;
    category?: string;
    search?: string;
    date?: string;
  }>;
}

async function TransactionsContent({ searchParams }: TransactionsPageProps) {
  const params = await searchParams;

  const filters: TFilters = {
    dateFilter: (params.filter as TFilters['dateFilter']) || 'month',
    categoryId: params.category || undefined,
    search: params.search || undefined,
    customDate: params.date ? new Date(params.date) : undefined,
  };

  const [{ transactions, total, startDate, endDate }, categories] = await Promise.all([
    getFilteredTransactions(filters),
    getCategories(),
  ]);

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
              Transactions
            </h1>
          </div>
          <div className="w-10 lg:hidden" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Total Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white border-none">
              <p className="text-sm opacity-90 mb-1">Total for period</p>
              <h2 className="text-3xl lg:text-4xl font-bold mb-2">{formatCurrency(total)}</h2>
              <p className="text-sm opacity-75">
                {formatDate(startDate)} - {formatDate(endDate)}
              </p>
            </Card>

            {/* Filters */}
            <Card className="p-4 dark:bg-gray-900 dark:border-gray-800">
              <TransactionFilters categories={categories} />
            </Card>

            {/* Transaction List - Mobile */}
            <div className="lg:hidden">
              <Card className="p-4 dark:bg-gray-900 dark:border-gray-800">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Transactions ({transactions.length})
                </h2>
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <Receipt className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No transactions found for this period.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y dark:divide-gray-700">
                    {transactions.map((transaction) => (
                      <TransactionItem
                        key={transaction.id}
                        expense={transaction}
                        categories={categories}
                        editable={true}
                      />
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* Sidebar - Transaction List Desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <Card className="p-4 dark:bg-gray-900 dark:border-gray-800 max-h-[calc(100vh-8rem)] overflow-auto">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white sticky top-0 bg-white dark:bg-gray-900 pb-2">
                  Transactions ({transactions.length})
                </h2>
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <Receipt className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No transactions found.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y dark:divide-gray-700">
                    {transactions.map((transaction) => (
                      <TransactionItem
                        key={transaction.id}
                        expense={transaction}
                        categories={categories}
                        editable={true}
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

export default function TransactionsPage(props: TransactionsPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-950" />}>
      <TransactionsContent {...props} />
    </Suspense>
  );
}
