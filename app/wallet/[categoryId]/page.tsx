import { Suspense } from 'react';
import { ArrowLeft, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TransactionItem } from '@/components/transaction-item';
import { ExpenseChart } from '@/components/expense-chart';
import { getCategoryById } from '@/app/actions/category-actions';
import { formatCurrency, getMonthName } from '@/lib/utils';
import * as Icons from 'lucide-react';

async function WalletDetailsContent({ categoryId }: { categoryId: string }) {
  const category = await getCategoryById(categoryId);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Wallet details</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Category Info */}
        <Card className="p-6 border-none" style={{ backgroundColor: category.color + '15' }}>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: category.color + '30' }}
            >
              <IconComponent className="w-6 h-6" style={{ color: category.color }} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{category.name}</p>
              <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </Card>

        {/* Month Navigation */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {getMonthName(currentMonth)}, {currentYear}
              </p>
              <p className="text-xl font-bold">{formatCurrency(monthlySpent)}</p>
              <p className="text-xs text-muted-foreground">Spent</p>
            </div>
            <Button variant="ghost" size="icon">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>

        {/* Chart */}
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-4">Last 15 days</h3>
          <ExpenseChart data={chartData} />
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search for any transaction"
            className="pl-10"
          />
        </div>

        {/* Transactions */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Latest transaction</h2>
          <Card className="p-4">
            {category.expenses.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No transactions in this category yet.
              </p>
            ) : (
              <div>
                {category.expenses.slice(0, 10).map((expense) => (
                  <TransactionItem
                    key={expense.id}
                    expense={{ ...expense, category }}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default async function WalletDetailsPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <WalletDetailsContent categoryId={categoryId} />
    </Suspense>
  );
}
