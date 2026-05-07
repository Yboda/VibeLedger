import {
  BookOpen,
  Banknote,
  Car,
  Gift,
  Heart,
  Home,
  MoreHorizontal,
  Music,
  Pencil,
  ShoppingBag,
  Smartphone,
  TrendingUp,
  Trash2,
  Utensils,
  type LucideProps,
} from 'lucide-react';
import { type ElementType } from 'react';
import { BudgetWithSpending } from '@/lib/api/budgets';

const ICON_MAP: Record<string, ElementType<LucideProps>> = {
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

export function BudgetCard({
  budget,
  colorFallback,
  onEdit,
  onDelete,
}: {
  budget: BudgetWithSpending;
  colorFallback: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const color = budget.category_color ?? colorFallback;
  const percentage = Math.min(
    (budget.spent_amount / budget.budget_amount) * 100,
    100
  );
  const remaining = budget.budget_amount - budget.spent_amount;
  const isOver = budget.spent_amount > budget.budget_amount;
  const isNearLimit = !isOver && percentage >= 80;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: color }}
          >
            {(() => {
              const Icon =
                (budget.category_icon
                  ? ICON_MAP[budget.category_icon]
                  : null) ?? MoreHorizontal;
              return <Icon className="w-6 h-6 text-white" />;
            })()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">
              {budget.category_name}
            </h3>
            <p className="text-sm text-slate-500">월 예산</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-end mb-3">
        <div>
          <p className="text-2xl font-bold text-slate-800">
            ₩{budget.spent_amount.toLocaleString('ko-KR')}
          </p>
          <p className="text-sm text-slate-500">
            / ₩{budget.budget_amount.toLocaleString('ko-KR')}
          </p>
        </div>
        <div
          className={`text-right ${isOver ? 'text-red-500' : 'text-green-600'}`}
        >
          <p className="text-sm font-medium">{isOver ? '초과' : '남음'}</p>
          <p className="font-semibold">
            ₩{Math.abs(remaining).toLocaleString('ko-KR')}
          </p>
        </div>
      </div>

      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : ''}`}
          style={{
            width: `${percentage}%`,
            backgroundColor: isOver ? undefined : color,
          }}
        />
      </div>

      <p className="text-xs text-slate-500 mt-2 text-right">
        {percentage.toFixed(0)}% 사용
      </p>
      {(isNearLimit || isOver) && (
        <p
          className={`mt-3 rounded-lg px-3 py-2 text-xs font-medium ${
            isOver ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-700'
          }`}
        >
          {isOver
            ? '예산을 초과했습니다. 다음 지출 전에 조정이 필요해요.'
            : '예산의 80% 이상을 사용했습니다. 남은 지출을 점검해보세요.'}
        </p>
      )}
    </div>
  );
}
