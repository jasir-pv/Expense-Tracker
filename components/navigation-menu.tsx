'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Home, TrendingUp, Wallet, Settings, LogOut, CalendarClock, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function NavigationMenu() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      icon: Receipt,
      label: 'Transactions',
      href: '/transactions',
    },
    {
      icon: CalendarClock,
      label: 'Upcoming Expenses',
      href: '/upcoming',
    },
    {
      icon: TrendingUp,
      label: 'Spend Analysis',
      href: '/analysis',
    },
    {
      icon: Wallet,
      label: 'Categories',
      href: '/categories',
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/settings',
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Expense Tracker
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className="mt-8 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 text-base hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950 dark:hover:to-purple-950"
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12 text-base text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
