'use client';

import Spinner from '@/components/common/Spinner';
import { useMonthlySummaryQuery } from '../../transactions/_api/useMonthlySummaryQuery';

export function SavingsGoalCard() {
  const { data, isLoading } = useMonthlySummaryQuery();

  const { totalIncome = 0, totalExpense = 0 } = data ?? {};
  const savingsRate =
    totalIncome > 0
      ? Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100)
      : 0;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-slate-600 text-sm mb-1">이달의 저축률</p>
      {isLoading ? (
        <div className="h-8 flex items-center">
          <Spinner size="sm" />
        </div>
      ) : (
        <p className="text-2xl font-bold text-slate-800">
          {savingsRate.toFixed(1)}%
        </p>
      )}
      <div className="mt-2">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-coral rounded-full transition-all duration-500"
            style={{ width: `${Math.min(savingsRate, 100)}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">
          수입 대비 저축 (수입 - 지출)
        </p>
      </div>
    </div>
  );
}
