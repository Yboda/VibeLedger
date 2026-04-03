import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  Car,
  Coffee,
  CreditCard,
  Dumbbell,
  Film,
  Gift,
  Home,
  MoreHorizontal,
  Plane,
  ShoppingBag,
  Smartphone,
  Utensils,
  Wallet,
} from 'lucide-react';
import { type ElementType } from 'react';
import { type Transaction } from '@/lib/api/transactions';

const ICON_MAP: Record<string, ElementType> = {
  Utensils,
  Home,
  ShoppingBag,
  Car,
  Smartphone,
  Coffee,
  Film,
  Dumbbell,
  Gift,
  Plane,
  Wallet,
  CreditCard,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
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
