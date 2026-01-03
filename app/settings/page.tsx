import { Suspense } from 'react';
import { ArrowLeft, User, Bell, Lock, Palette, Database, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Settings</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">
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

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
              {section.title}
            </h3>
            <Card className="divide-y">
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="p-2 rounded-lg bg-gray-100">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </Card>
          </div>
        ))}

        {/* Danger Zone */}
        <div>
          <h3 className="text-sm font-semibold text-red-600 mb-3 px-1">
            Danger Zone
          </h3>
          <Card>
            <button className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors text-left">
              <div>
                <p className="font-medium text-red-600">Clear All Data</p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete all expenses and categories
                </p>
              </div>
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <SettingsContent />
    </Suspense>
  );
}
