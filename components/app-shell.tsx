'use client';

import { DesktopSidebar } from './desktop-sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DesktopSidebar />
      <div className="lg:pl-64">
        {children}
      </div>
    </div>
  );
}
