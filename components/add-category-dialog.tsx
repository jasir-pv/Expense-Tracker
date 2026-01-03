'use client';

import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createCategory } from '@/app/actions/category-actions';
import * as Icons from 'lucide-react';

// Popular icons for categories
const ICON_OPTIONS = [
  'ShoppingCart',
  'Car',
  'Film',
  'Home',
  'UtensilsCrossed',
  'ShoppingBag',
  'Heart',
  'GraduationCap',
  'Plane',
  'Receipt',
  'Coffee',
  'Gamepad2',
  'Book',
  'Dumbbell',
  'Smartphone',
  'Shirt',
  'Fuel',
  'Gift',
  'Sparkles',
  'Briefcase',
  'Trophy',
  'CircleDot',
];

const COLOR_OPTIONS = [
  '#8B5CF6', // Purple
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F97316', // Orange
  '#EF4444', // Red
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#14B8A6', // Teal
  '#F59E0B', // Amber
  '#6366F1', // Indigo
  '#84CC16', // Lime
  '#F43F5E', // Rose
];

export function AddCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('Wallet');
  const [selectedColor, setSelectedColor] = useState('#8B5CF6');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    formData.set('icon', selectedIcon);
    formData.set('color', selectedColor);

    try {
      await createCategory(formData);
      setOpen(false);
      e.currentTarget.reset();
      setSelectedIcon('Wallet');
      setSelectedColor('#8B5CF6');
    } catch (error: any) {
      setError(error.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FolderPlus className="w-4 h-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Category</DialogTitle>
          <DialogDescription>
            Add a new category to organize your expenses.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Pets, Hobbies, Insurance"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Select Icon</Label>
            <div className="grid grid-cols-5 gap-2 p-2 border rounded-lg max-h-60 overflow-y-auto">
              {ICON_OPTIONS.map((iconName) => {
                const IconComponent = (Icons as any)[iconName] || Icons.Wallet;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedIcon(iconName)}
                    className={`p-3 rounded-lg border-2 transition-all hover:scale-110 ${
                      selectedIcon === iconName
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-6 h-6 mx-auto" />
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Selected: {selectedIcon}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Select Color</Label>
            <div className="grid grid-cols-6 gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-12 h-12 rounded-lg border-4 transition-all hover:scale-110 ${
                    selectedColor === color
                      ? 'border-gray-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: selectedColor + '30' }}
            >
              {(() => {
                const IconComponent = (Icons as any)[selectedIcon];
                return <IconComponent className="w-6 h-6" style={{ color: selectedColor }} />;
              })()}
            </div>
            <div>
              <p className="text-sm font-medium">Preview</p>
              <p className="text-xs text-muted-foreground">
                This is how your category will look
              </p>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Category'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
