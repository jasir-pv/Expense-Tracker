import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import * as Icons from 'lucide-react';

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  color: string;
  amount: number;
}

export function CategoryCard({ id, name, icon, color, amount }: CategoryCardProps) {
  const IconComponent = (Icons as any)[icon] || Icons.Wallet;

  return (
    <Link href={`/wallet/${id}`}>
      <Card
        className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border-none"
        style={{ backgroundColor: color + '15' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: color + '30' }}
          >
            <IconComponent className="w-6 h-6" style={{ color }} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{name}</p>
            <p className="text-lg font-bold">{formatCurrency(amount)}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
