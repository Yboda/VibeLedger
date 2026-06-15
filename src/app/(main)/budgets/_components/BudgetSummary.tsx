'use client';

import { CrossfadeContent } from '@/components/common/CrossfadeContent';
import { BudgetSummarySkeleton } from '@/components/common/skeletons';
import { useBudgetsQuery } from '../_api/useBudgetsQuery';

export function BudgetSummary({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const { data = [], isLoading } = useBudgetsQuery(month, year);

  const totalBudget = data.reduce((s, b) => s + b.budget_amount, 0);
  const totalSpent = data.reduce((s, b) => s + b.spent_amount, 0);
  const remaining = totalBudget - totalSpent;
  const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const isOver = remaining < 0;

  return (
    <CrossfadeContent
      isLoading={isLoading}
      skeleton={<BudgetSummarySkeleton />}
    >
      {data.length === 0 ? (
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <p className="py-4 text-center text-sm text-slate-400">
            이번 달 예산이 설정되지 않았습니다. 위의 버튼으로 예산을
            추가해보세요.
          </p>
        </div>
      ) : (
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">이번 달 전체 예산</p>
              <p className="text-3xl font-bold text-slate-800">
                ₩{totalBudget.toLocaleString('ko-KR')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">남은 예산</p>
              <p
                className={`text-2xl font-bold ${isOver ? 'text-red-500' : 'text-green-600'}`}
              >
                {isOver ? '-' : ''}₩
                {Math.abs(remaining).toLocaleString('ko-KR')}
              </p>
            </div>
          </div>

          <div className="relative mb-2 h-4 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : 'bg-linear-to-r from-[#F97354] to-[#FBBF24]'}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-600">
              사용: ₩{totalSpent.toLocaleString('ko-KR')} (
              {percentage.toFixed(1)}
              %)
            </span>
            <span className={isOver ? 'text-red-500' : 'text-slate-500'}>
              {isOver
                ? `₩${Math.abs(remaining).toLocaleString('ko-KR')} 초과`
                : `₩${remaining.toLocaleString('ko-KR')} 남음`}
            </span>
          </div>
        </div>
      )}
    </CrossfadeContent>
  );
}
