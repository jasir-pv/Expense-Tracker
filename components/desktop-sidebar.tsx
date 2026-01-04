'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, Wallet, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function DesktopSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      href: '/dashboard',
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
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-gray-900 border-r dark:border-gray-800">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center h-16 px-6 border-b dark:border-gray-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Expense Tracker
          </h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-3 h-11 text-sm font-medium',
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive && 'text-blue-600 dark:text-blue-400')} />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t dark:border-gray-800">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-11 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
