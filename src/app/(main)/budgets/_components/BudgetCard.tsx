import { type ElementType } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export function BudgetCard({
  icon: Icon,
  iconBg,
  category,
  budget,
  spent,
  color,
}: {
  icon: ElementType;
  iconBg: string;
  category: string;
  budget: number;
  spent: number;
  color: string;
}) {
  const percentage = Math.min((spent / budget) * 100, 100);
  const remaining = budget - spent;
  const isOverBudget = spent > budget;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: iconBg }}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{category}</h3>
            <p className="text-sm text-slate-500">월 예산</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Pencil className="w-4 h-4 text-slate-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-end mb-3">
        <div>
          <p className="text-2xl font-bold text-slate-800">
            ₩{spent.toFixed(2)}
          </p>
          <p className="text-sm text-slate-500">/ ₩{budget.toFixed(2)}</p>
        </div>
        <div
          className={`text-right ${isOverBudget ? 'text-red-500' : 'text-green-600'}`}
        >
          <p className="text-sm font-medium">
            {isOverBudget ? '초과' : '남음'}
          </p>
          <p className="font-semibold">₩{Math.abs(remaining).toFixed(2)}</p>
        </div>
      </div>

      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : ''}`}
          style={{
            width: `${percentage}%`,
            backgroundColor: isOverBudget ? undefined : color,
          }}
        />
      </div>

      <p className="text-xs text-slate-500 mt-2 text-right">
        {percentage.toFixed(0)}% 사용
      </p>
    </div>
  );
}
