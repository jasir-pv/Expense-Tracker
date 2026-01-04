'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { UpcomingExpenseFrequency, UpcomingExpenseStatus } from '@prisma/client';
import { UpcomingExpenseFormData } from '@/types';

export async function createUpcomingExpense(data: UpcomingExpenseFormData) {
  const upcomingExpense = await prisma.upcomingExpense.create({
    data: {
      title: data.title,
      amount: data.amount,
      categoryId: data.categoryId,
      icon: data.icon,
      color: data.color,
      dueDate: data.dueDate,
      frequency: data.frequency,
      interval: data.interval,
      autoConvert: data.autoConvert,
    },
    include: {
      category: true,
    },
  });

  revalidatePath('/upcoming');
  revalidatePath('/dashboard');

  return upcomingExpense;
}

export async function updateUpcomingExpense(
  id: string,
  data: Partial<UpcomingExpenseFormData>
) {
  const upcomingExpense = await prisma.upcomingExpense.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.categoryId && { categoryId: data.categoryId }),
      ...(data.icon && { icon: data.icon }),
      ...(data.color && { color: data.color }),
      ...(data.dueDate && { dueDate: data.dueDate }),
      ...(data.frequency && { frequency: data.frequency }),
      ...(data.interval !== undefined && { interval: data.interval }),
      ...(data.autoConvert !== undefined && { autoConvert: data.autoConvert }),
    },
    include: {
      category: true,
    },
  });

  revalidatePath('/upcoming');
  revalidatePath('/dashboard');

  return upcomingExpense;
}

export async function deleteUpcomingExpense(id: string) {
  const upcomingExpense = await prisma.upcomingExpense.delete({
    where: { id },
    include: {
      category: true,
    },
  });

  revalidatePath('/upcoming');
  revalidatePath('/dashboard');

  return upcomingExpense;
}

export async function getUpcomingExpenses(options?: {
  frequency?: UpcomingExpenseFrequency;
  status?: UpcomingExpenseStatus;
}) {
  return await prisma.upcomingExpense.findMany({
    where: {
      ...(options?.frequency && { frequency: options.frequency }),
      ...(options?.status && { status: options.status }),
    },
    include: {
      category: true,
    },
    orderBy: {
      dueDate: 'asc',
    },
  });
}

export async function getUpcomingExpenseById(id: string) {
  return await prisma.upcomingExpense.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
}

export async function getUpcomingExpensesByDateRange(startDate: Date, endDate: Date) {
  return await prisma.upcomingExpense.findMany({
    where: {
      dueDate: {
        gte: startDate,
        lte: endDate,
      },
      status: 'pending',
    },
    include: {
      category: true,
    },
    orderBy: {
      dueDate: 'asc',
    },
  });
}

export async function markUpcomingExpenseAsPaid(id: string) {
  const upcomingExpense = await prisma.upcomingExpense.update({
    where: { id },
    data: {
      status: 'paid',
    },
    include: {
      category: true,
    },
  });

  revalidatePath('/upcoming');
  revalidatePath('/dashboard');

  return upcomingExpense;
}

export async function markUpcomingExpenseAsSkipped(id: string) {
  const upcomingExpense = await prisma.upcomingExpense.update({
    where: { id },
    data: {
      status: 'skipped',
    },
    include: {
      category: true,
    },
  });

  revalidatePath('/upcoming');
  revalidatePath('/dashboard');

  return upcomingExpense;
}

export async function resetUpcomingExpenseStatus(id: string) {
  const upcomingExpense = await prisma.upcomingExpense.update({
    where: { id },
    data: {
      status: 'pending',
    },
    include: {
      category: true,
    },
  });

  revalidatePath('/upcoming');
  revalidatePath('/dashboard');

  return upcomingExpense;
}

export async function convertUpcomingToExpense(id: string) {
  const upcomingExpense = await prisma.upcomingExpense.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!upcomingExpense) {
    throw new Error('Upcoming expense not found');
  }

  // Create the actual expense
  await prisma.expense.create({
    data: {
      amount: upcomingExpense.amount,
      description: upcomingExpense.title,
      categoryId: upcomingExpense.categoryId,
      date: upcomingExpense.dueDate,
    },
  });

  // Mark the upcoming expense as paid
  await prisma.upcomingExpense.update({
    where: { id },
    data: {
      status: 'paid',
    },
  });

  // If it's a recurring expense, create the next occurrence
  if (upcomingExpense.frequency !== 'one_time') {
    const nextDueDate = calculateNextDueDate(
      upcomingExpense.dueDate,
      upcomingExpense.frequency,
      upcomingExpense.interval
    );

    await prisma.upcomingExpense.create({
      data: {
        title: upcomingExpense.title,
        amount: upcomingExpense.amount,
        categoryId: upcomingExpense.categoryId,
        icon: upcomingExpense.icon,
        color: upcomingExpense.color,
        dueDate: nextDueDate,
        frequency: upcomingExpense.frequency,
        interval: upcomingExpense.interval,
        autoConvert: upcomingExpense.autoConvert,
        status: 'pending',
      },
    });
  }

  revalidatePath('/upcoming');
  revalidatePath('/dashboard');
  revalidatePath('/analysis');

  return upcomingExpense;
}

function calculateNextDueDate(
  currentDueDate: Date,
  frequency: UpcomingExpenseFrequency,
  interval?: number | null
): Date {
  const nextDate = new Date(currentDueDate);
  const multiplier = interval || 1;

  switch (frequency) {
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7 * multiplier);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + multiplier);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + multiplier);
      break;
    default:
      break;
  }

  return nextDate;
}

export async function processAutoConvertExpenses() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueExpenses = await prisma.upcomingExpense.findMany({
    where: {
      dueDate: {
        lte: today,
      },
      status: 'pending',
      autoConvert: true,
    },
    include: {
      category: true,
    },
  });

  const results = [];
  for (const expense of dueExpenses) {
    const result = await convertUpcomingToExpense(expense.id);
    results.push(result);
  }

  return results;
}

export async function getUpcomingExpenseSummary() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const endOfYear = new Date(today.getFullYear(), 11, 31);

  const [weeklyTotal, monthlyTotal, yearlyTotal, overdueCount] = await Promise.all([
    prisma.upcomingExpense.aggregate({
      where: {
        dueDate: {
          gte: today,
          lte: endOfWeek,
        },
        status: 'pending',
      },
      _sum: {
        amount: true,
      },
    }),
    prisma.upcomingExpense.aggregate({
      where: {
        dueDate: {
          gte: today,
          lte: endOfMonth,
        },
        status: 'pending',
      },
      _sum: {
        amount: true,
      },
    }),
    prisma.upcomingExpense.aggregate({
      where: {
        dueDate: {
          gte: today,
          lte: endOfYear,
        },
        status: 'pending',
      },
      _sum: {
        amount: true,
      },
    }),
    prisma.upcomingExpense.count({
      where: {
        dueDate: {
          lt: today,
        },
        status: 'pending',
      },
    }),
  ]);

  return {
    weeklyTotal: weeklyTotal._sum.amount || 0,
    monthlyTotal: monthlyTotal._sum.amount || 0,
    yearlyTotal: yearlyTotal._sum.amount || 0,
    overdueCount,
  };
}
