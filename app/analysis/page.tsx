import { Suspense } from 'react';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CategoryBar } from '@/components/category-bar';
import { getCategorySpending } from '@/app/actions/category-actions';
import { getTotalBalance } from '@/app/actions/expense-actions';
import { formatCurrency } from '@/lib/utils';

async function AnalysisContent() {
  const [categorySpending, totalSpending] = await Promise.all([
    getCategorySpending(),
    getTotalBalance(),
  ]);

  // Find top spending category
  const topCategory = categorySpending.reduce(
    (max, cat) => (cat.amount > max.amount ? cat : max),
    categorySpending[0] || { category: '', amount: 0 }
  );

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
          <h1 className="text-lg font-semibold">Spend analysis</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Total Spending */}
        <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white border-none">
          <p className="text-sm opacity-90 mb-1">Total spending</p>
          <h1 className="text-4xl font-bold mb-2">{formatCurrency(totalSpending)}</h1>
        </Card>

        {/* Category Breakdown */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Category breakdown</h2>
          {categorySpending.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No spending data available yet.
            </p>
          ) : (
            <CategoryBar categories={categorySpending} />
          )}
        </Card>

        {/* Smart Suggestions */}
        {topCategory.amount > 0 && (
          <Card className="p-6 bg-yellow-50 border-yellow-200">
            <div className="flex gap-3">
              <div className="p-2 bg-yellow-200 rounded-lg h-fit">
                <Lightbulb className="w-5 h-5 text-yellow-700" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">
                  Smart category suggestion
                </h3>
                <p className="text-sm text-yellow-800">
                  Your highest spending is on{' '}
                  <span className="font-semibold">{topCategory.category}</span>{' '}
                  ({formatCurrency(topCategory.amount)}). Consider setting a
                  budget limit to track this category better.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Top Categories */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Top spending categories</h2>
          <div className="grid gap-3">
            {categorySpending.slice(0, 5).map((cat, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: cat.color }}
                    >
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{cat.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {cat.percentage.toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold">
                    {formatCurrency(cat.amount)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <AnalysisContent />
    </Suspense>
  );
}
