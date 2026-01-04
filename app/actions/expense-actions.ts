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
