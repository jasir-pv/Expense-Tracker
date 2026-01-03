'use server';

import { prisma } from '@/lib/db';

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });
}

export async function getCategoriesWithExpenses() {
  return await prisma.category.findMany({
    include: {
      expenses: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export async function getCategoryById(id: string) {
  return await prisma.category.findUnique({
    where: { id },
    include: {
      expenses: {
        orderBy: {
          date: 'desc',
        },
      },
    },
  });
}

export async function getCategorySpending() {
  const categories = await prisma.category.findMany({
    include: {
      expenses: true,
    },
  });

  const totalSpending = categories.reduce((acc, cat) => {
    const catTotal = cat.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    return acc + catTotal;
  }, 0);

  return categories.map((category) => {
    const amount = category.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    return {
      category: category.name,
      amount,
      color: category.color,
      percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0,
    };
  }).filter(cat => cat.amount > 0);
}
