import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create initial categories with icons and colors
  const categories = [
    {
      name: 'Groceries',
      icon: 'ShoppingCart',
      color: '#8B5CF6', // Purple
    },
    {
      name: 'Transport',
      icon: 'Car',
      color: '#3B82F6', // Blue
    },
    {
      name: 'Entertainment',
      icon: 'Film',
      color: '#10B981', // Green
    },
    {
      name: 'Rent & Utilities',
      icon: 'Home',
      color: '#F97316', // Orange
    },
    {
      name: 'Food & Dining',
      icon: 'UtensilsCrossed',
      color: '#EF4444', // Red
    },
    {
      name: 'Shopping',
      icon: 'ShoppingBag',
      color: '#EC4899', // Pink
    },
    {
      name: 'Health & Fitness',
      icon: 'Heart',
      color: '#06B6D4', // Cyan
    },
    {
      name: 'Education',
      icon: 'GraduationCap',
      color: '#8B5CF6', // Violet
    },
    {
      name: 'Travel',
      icon: 'Plane',
      color: '#14B8A6', // Teal
    },
    {
      name: 'Bills & EMI',
      icon: 'Receipt',
      color: '#F59E0B', // Amber
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
