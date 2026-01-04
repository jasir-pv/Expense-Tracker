'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UpcomingExpenseItem } from '@/components/upcoming-expense-item';
import {
  AddUpcomingExpenseDialog,
  EditUpcomingExpenseDialog,
} from '@/components/upcoming-expense-dialog';
import { UpcomingExpenseWithCategory } from '@/types';
import { Category } from '@prisma/client';

interface UpcomingExpensesListProps {
  expenses: UpcomingExpenseWithCategory[];
  categories: Category[];
  weeklyExpenses: UpcomingExpenseWithCategory[];
  monthlyExpenses: UpcomingExpenseWithCategory[];
  yearlyExpenses: UpcomingExpenseWithCategory[];
  oneTimeExpenses: UpcomingExpenseWithCategory[];
}

export function UpcomingExpensesList({
  expenses,
  categories,
  weeklyExpenses,
  monthlyExpenses,
  yearlyExpenses,
  oneTimeExpenses,
}: UpcomingExpensesListProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<UpcomingExpenseWithCategory | null>(null);

  const handleEdit = (expense: UpcomingExpenseWithCategory) => {
    setSelectedExpense(expense);
    setEditDialogOpen(true);
  };

  const renderExpenseList = (items: UpcomingExpenseWithCategory[], emptyMessage: string) => {
    if (items.length === 0) {
      return (
        <p className="text-center text-gray-600 dark:text-gray-400 py-8">
          {emptyMessage}
        </p>
      );
    }

    return (
      <div className="space-y-1">
        {items.map((expense) => (
          <UpcomingExpenseItem
            key={expense.id}
            expense={expense}
            categories={categories}
            onEdit={handleEdit}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Card className="p-4 lg:p-6 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Scheduled Expenses
          </h2>
          <AddUpcomingExpenseDialog categories={categories} />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-5 mb-4">
            <TabsTrigger value="all">All ({expenses.length})</TabsTrigger>
            <TabsTrigger value="weekly">Weekly ({weeklyExpenses.length})</TabsTrigger>
            <TabsTrigger value="monthly">Monthly ({monthlyExpenses.length})</TabsTrigger>
            <TabsTrigger value="yearly">Yearly ({yearlyExpenses.length})</TabsTrigger>
            <TabsTrigger value="one_time">One-time ({oneTimeExpenses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {renderExpenseList(expenses, 'No upcoming expenses. Add one to get started!')}
          </TabsContent>

          <TabsContent value="weekly">
            {renderExpenseList(weeklyExpenses, 'No weekly recurring expenses.')}
          </TabsContent>

          <TabsContent value="monthly">
            {renderExpenseList(monthlyExpenses, 'No monthly recurring expenses.')}
          </TabsContent>

          <TabsContent value="yearly">
            {renderExpenseList(yearlyExpenses, 'No yearly recurring expenses.')}
          </TabsContent>

          <TabsContent value="one_time">
            {renderExpenseList(oneTimeExpenses, 'No one-time scheduled expenses.')}
          </TabsContent>
        </Tabs>
      </Card>

      {selectedExpense && (
        <EditUpcomingExpenseDialog
          expense={selectedExpense}
          categories={categories}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
    </>
  );
}
