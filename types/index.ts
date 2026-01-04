import { Category, Expense, UpcomingExpense, UpcomingExpenseFrequency, UpcomingExpenseStatus } from '@prisma/client';

export type ExpenseWithCategory = Expense & {
  category: Category;
};

export type CategoryWithExpenses = Category & {
  expenses: Expense[];
};

export type MonthlyData = {
  month: string;
  amount: number;
};

export type CategorySpending = {
  category: string;
  amount: number;
  color: string;
  percentage: number;
};

export type UpcomingExpenseWithCategory = UpcomingExpense & {
  category: Category;
};

export type { UpcomingExpenseFrequency, UpcomingExpenseStatus };

export type UpcomingExpenseFormData = {
  title: string;
  amount: number;
  categoryId: string;
  icon: string;
  color: string;
  dueDate: Date;
  frequency: UpcomingExpenseFrequency;
  interval?: number;
  autoConvert: boolean;
};
