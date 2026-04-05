'use client';

import Spinner from '@/components/common/Spinner';
import { useBudgetsQuery } from '../_api/useBudgetsQuery';

export function BudgetSummary({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const { data = [], isLoading } = useBudgetsQuery(month, year);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6 h-[120px] flex items-center justify-center">
        <Spinner size="sm" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <p className="text-slate-400 text-sm text-center py-4">
          이번 달 예산이 설정되지 않았습니다. 위의 버튼으로 예산을 추가해보세요.
        </p>
      </div>
    );
  }

  const totalBudget = data.reduce((s, b) => s + b.budget_amount, 0);
  const totalSpent = data.reduce((s, b) => s + b.spent_amount, 0);
  const remaining = totalBudget - totalSpent;
  const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const isOver = remaining < 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-slate-500 text-sm">이번 달 전체 예산</p>
          <p className="text-3xl font-bold text-slate-800">
            ₩{totalBudget.toLocaleString('ko-KR')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-slate-500 text-sm">남은 예산</p>
          <p
            className={`text-2xl font-bold ${isOver ? 'text-red-500' : 'text-green-600'}`}
          >
            {isOver ? '-' : ''}₩{Math.abs(remaining).toLocaleString('ko-KR')}
          </p>
        </div>
      </div>

      <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : 'bg-linear-to-r from-[#F97354] to-[#FBBF24]'}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-slate-600">
          사용: ₩{totalSpent.toLocaleString('ko-KR')} ({percentage.toFixed(1)}%)
        </span>
        <span className={isOver ? 'text-red-500' : 'text-slate-500'}>
          {isOver
            ? `₩${Math.abs(remaining).toLocaleString('ko-KR')} 초과`
            : `₩${remaining.toLocaleString('ko-KR')} 남음`}
        </span>
      </div>
    </div>
  );
}
