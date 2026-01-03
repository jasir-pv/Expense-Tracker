import { Category, Expense } from '@prisma/client';

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
