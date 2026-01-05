'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createExpense(formData: FormData) {
  const amount = parseFloat(formData.get('amount') as string);
  const description = formData.get('description') as string;
  const categoryId = formData.get('categoryId') as string;
  const date = formData.get('date') as string;

  if (!amount || !categoryId) {
    throw new Error('Amount and category are required');
  }

  await prisma.expense.create({
    data: {
      amount,
      description,
      categoryId,
      date: date ? new Date(date) : new Date(),
    },
  });

  revalidatePath('/dashboard');
  revalidatePath('/wallet');
  revalidatePath('/analysis');
  revalidatePath('/transactions');
}

export async function getExpenses() {
  return await prisma.expense.findMany({
    include: {
      category: true,
    },
    orderBy: {
      date: 'desc',
    },
  });
}

export async function getRecentExpenses(limit: number = 5) {
  return await prisma.expense.findMany({
    include: {
      category: true,
    },
    orderBy: {
      date: 'desc',
    },
    take: limit,
  });
}

export async function getExpensesByCategory(categoryId: string) {
  return await prisma.expense.findMany({
    where: {
      categoryId,
    },
    include: {
      category: true,
    },
    orderBy: {
      date: 'desc',
    },
  });
}

export async function getTotalBalance() {
  const result = await prisma.expense.aggregate({
    _sum: {
      amount: true,
    },
  });

  return result._sum.amount || 0;
}

export async function updateExpense(
  id: string,
  data: {
    amount?: number;
    description?: string;
    categoryId?: string;
    date?: Date;
  }
) {
  const expense = await prisma.expense.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });

  revalidatePath('/dashboard');
  revalidatePath('/wallet');
  revalidatePath('/analysis');
  revalidatePath('/categories');

  return expense;
}

export async function deleteExpense(id: string) {
  const expense = await prisma.expense.delete({
    where: { id },
    include: {
      category: true,
    },
  });

  revalidatePath('/dashboard');
  revalidatePath('/wallet');
  revalidatePath('/analysis');
  revalidatePath('/categories');

  return expense;
}

export async function getExpenseById(id: string) {
  return await prisma.expense.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
}

export type TransactionFilters = {
  dateFilter: 'day' | 'week' | 'month' | 'year';
  categoryId?: string;
  search?: string;
  customDate?: Date;
};

export async function getFilteredTransactions(filters: TransactionFilters) {
  const { dateFilter, categoryId, search, customDate } = filters;
  const now = customDate ? new Date(customDate) : new Date();

  let startDate: Date;
  let endDate: Date;

  switch (dateFilter) {
    case 'day':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
    case 'week':
      const dayOfWeek = now.getDay();
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday);
      endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6, 23, 59, 59, 999);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
  }

  const whereClause: any = {
    date: {
      gte: startDate,
      lte: endDate,
    },
  };

  if (categoryId) {
    whereClause.categoryId = categoryId;
  }

  if (search) {
    whereClause.description = {
      contains: search,
      mode: 'insensitive',
    };
  }

  const transactions = await prisma.expense.findMany({
    where: whereClause,
    include: {
      category: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  return { transactions, total, startDate, endDate };
}
