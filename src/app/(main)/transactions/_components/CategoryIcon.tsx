import {
  BookOpen,
  Banknote,
  Car,
  Gift,
  Heart,
  Home,
  MoreHorizontal,
  Music,
  ShoppingBag,
  Smartphone,
  TrendingUp,
  Utensils,
} from 'lucide-react';
import { type ElementType } from 'react';
import { type Transaction } from '@/lib/api/transactions';

const ICON_MAP: Record<string, ElementType> = {
  utensils: Utensils,
  car: Car,
  home: Home,
  smartphone: Smartphone,
  'shopping-bag': ShoppingBag,
  heart: Heart,
  'book-open': BookOpen,
  music: Music,
  briefcase: Banknote,
  gift: Gift,
  'trending-up': TrendingUp,
};

export function CategoryIcon({
  category,
}: {
  category: Transaction['categories'];
}) {
  const Icon =
    (category?.icon ? ICON_MAP[category.icon] : null) ?? MoreHorizontal;
  const bg = category?.color ?? '#6B7280';

  return (
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center"
      style={{ backgroundColor: bg }}
    >
      <Icon className="w-5 h-5 text-white" />
    </div>
  );
}
