'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

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

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string;
  const icon = formData.get('icon') as string;
  const color = formData.get('color') as string;

  if (!name || !icon || !color) {
    throw new Error('Name, icon, and color are required');
  }

  // Check if category already exists
  const existing = await prisma.category.findUnique({
    where: { name },
  });

  if (existing) {
    throw new Error('Category with this name already exists');
  }

  await prisma.category.create({
    data: {
      name,
      icon,
      color,
    },
  });

  revalidatePath('/dashboard');
  revalidatePath('/analysis');
}
