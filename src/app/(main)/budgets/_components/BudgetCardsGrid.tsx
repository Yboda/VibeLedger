import {
  Car,
  Coffee,
  Dumbbell,
  Film,
  Home,
  ShoppingBag,
  Smartphone,
  Utensils,
} from 'lucide-react';
import { BudgetCard } from './BudgetCard';

export function BudgetCardsGrid() {
  const budgets = [
    {
      icon: Utensils,
      iconBg: '#FBBF24',
      category: '식비',
      budget: 400,
      spent: 234.5,
      color: '#FBBF24',
    },
    {
      icon: Home,
      iconBg: '#F97354',
      category: '주거비',
      budget: 500,
      spent: 350.0,
      color: '#F97354',
    },
    {
      icon: Car,
      iconBg: '#3B82F6',
      category: '교통비',
      budget: 150,
      spent: 89.0,
      color: '#3B82F6',
    },
    {
      icon: ShoppingBag,
      iconBg: '#8B5CF6',
      category: '쇼핑',
      budget: 200,
      spent: 45.9,
      color: '#8B5CF6',
    },
    {
      icon: Coffee,
      iconBg: '#A16207',
      category: '카페/간식',
      budget: 100,
      spent: 78.39,
      color: '#A16207',
    },
    {
      icon: Film,
      iconBg: '#EC4899',
      category: '여가/문화',
      budget: 150,
      spent: 25.0,
      color: '#EC4899',
    },
    {
      icon: Dumbbell,
      iconBg: '#10B981',
      category: '건강/운동',
      budget: 100,
      spent: 25.0,
      color: '#10B981',
    },
    {
      icon: Smartphone,
      iconBg: '#1e3a5f',
      category: '통신비',
      budget: 80,
      spent: 0,
      color: '#1e3a5f',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {budgets.map((budget, index) => (
        <BudgetCard key={index} {...budget} />
      ))}
    </div>
  );
}
