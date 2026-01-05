'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category } from '@prisma/client';
import { cn } from '@/lib/utils';
import { format, addMonths, subMonths, addWeeks, subWeeks, addYears, subYears, addDays, subDays } from 'date-fns';

interface TransactionFiltersProps {
  categories: Category[];
}

type DateFilter = 'day' | 'week' | 'month' | 'year';

export function TransactionFilters({ categories }: TransactionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentFilter = (searchParams.get('filter') as DateFilter) || 'month';
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentDateParam = searchParams.get('date');
  const currentDate = currentDateParam ? new Date(currentDateParam) : new Date();

  const [searchValue, setSearchValue] = useState(currentSearch);

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`/transactions?${params.toString()}`);
    });
  };

  const handleFilterChange = (filter: DateFilter) => {
    updateFilters({ filter, date: '' });
  };

  const handleCategoryChange = (categoryId: string) => {
    updateFilters({ category: categoryId === 'all' ? '' : categoryId });
  };

  const handleSearch = () => {
    updateFilters({ search: searchValue });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    let newDate: Date;

    switch (currentFilter) {
      case 'day':
        newDate = direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1);
        break;
      case 'week':
        newDate = direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1);
        break;
      case 'month':
        newDate = direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1);
        break;
      case 'year':
        newDate = direction === 'prev' ? subYears(currentDate, 1) : addYears(currentDate, 1);
        break;
    }

    updateFilters({ date: newDate.toISOString() });
  };

  const getDateLabel = () => {
    switch (currentFilter) {
      case 'day':
        return format(currentDate, 'MMMM d, yyyy');
      case 'week':
        return `Week of ${format(currentDate, 'MMM d, yyyy')}`;
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'year':
        return format(currentDate, 'yyyy');
    }
  };

  const filters: { value: DateFilter; label: string }[] = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
  ];

  return (
    <div className="space-y-4">
      {/* Date Filter Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleFilterChange(filter.value)}
            className={cn(
              'flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors',
              currentFilter === filter.value
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateDate('prev')}
          disabled={isPending}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span className="font-medium text-gray-900 dark:text-white">
          {getDateLabel()}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateDate('next')}
          disabled={isPending}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Search and Category Filter */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search transactions..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSearch}
            className="pl-9 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <Select value={currentCategory || 'all'} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[140px] dark:bg-gray-800 dark:border-gray-700">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
