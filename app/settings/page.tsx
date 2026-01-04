import { Suspense } from 'react';
import { ArrowLeft, User, Bell, Lock, Palette, Database, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NavigationMenu } from '@/components/navigation-menu';
import { AppShell } from '@/components/app-shell';

function SettingsContent() {
  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Settings', description: 'Manage your account details' },
        { icon: Lock, label: 'Privacy & Security', description: 'Control your privacy settings' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', description: 'Manage notification preferences' },
        { icon: Palette, label: 'Appearance', description: 'Customize app theme' },
      ],
    },
    {
      title: 'Data',
      items: [
        { icon: Database, label: 'Export Data', description: 'Download your expense data' },
        { icon: Database, label: 'Import Data', description: 'Import expenses from CSV' },
      ],
    },
    {
      title: 'About',
      items: [
        { icon: Info, label: 'App Version', description: 'Version 1.0.0' },
      ],
    },
  ];

  return (
    <AppShell>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="lg:hidden">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div className="lg:hidden">
              <NavigationMenu />
            </div>
            <h1 className="hidden lg:block text-xl font-semibold text-gray-900 dark:text-white">Settings</h1>
          </div>
          <div className="w-10 lg:hidden" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Sidebar - User Profile */}
          <div className="lg:col-span-1 mb-6 lg:mb-0">
            <div className="lg:sticky lg:top-6 space-y-6">
              {/* User Profile Card */}
              <Card className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white border-none">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Guest User</h2>
                    <p className="text-sm opacity-90">guest@expensetracker.com</p>
                  </div>
                </div>
              </Card>

              {/* Danger Zone - Desktop */}
              <div className="hidden lg:block">
                <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3 px-1">
                  Danger Zone
                </h3>
                <Card className="dark:bg-gray-900 dark:border-gray-800">
                  <button className="w-full p-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-left">
                    <div>
                      <p className="font-medium text-red-600 dark:text-red-400">Clear All Data</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Permanently delete all expenses and categories
                      </p>
                    </div>
                  </button>
                </Card>
              </div>
            </div>
          </div>

          {/* Main Content - Settings Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Desktop: Two columns for settings */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-6 lg:space-y-0">
              {settingsSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 px-1">
                    {section.title}
                  </h3>
                  <Card className="divide-y dark:divide-gray-800 dark:bg-gray-900 dark:border-gray-800">
                    {section.items.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={index}
                          className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                        >
                          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{item.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </Card>
                </div>
              ))}
            </div>

            {/* Danger Zone - Mobile */}
            <div className="lg:hidden">
              <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3 px-1">
                Danger Zone
              </h3>
              <Card className="dark:bg-gray-900 dark:border-gray-800">
                <button className="w-full p-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-left">
                  <div>
                    <p className="font-medium text-red-600 dark:text-red-400">Clear All Data</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Permanently delete all expenses and categories
                    </p>
                  </div>
                </button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-950" />}>
      <SettingsContent />
    </Suspense>
  );
}
