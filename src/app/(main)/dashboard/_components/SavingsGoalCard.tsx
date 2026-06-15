'use client';

import { useMonthlySummaryQuery } from '../../transactions/_api/useMonthlySummaryQuery';
import { StatValueSkeleton } from './dashboard-skeletons';

export function SavingsGoalCard() {
  const { data, isLoading } = useMonthlySummaryQuery();

  const { totalIncome = 0, totalExpense = 0 } = data ?? {};
  const savingsRate =
    totalIncome > 0
      ? Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100)
      : 0;

  return (
    <div className="flex h-full flex-col rounded-xl bg-white p-4 shadow-sm">
      <p className="mb-1 text-sm text-slate-600">이달의 저축률</p>
      <div className="mb-2 h-8">
        {isLoading ? (
          <StatValueSkeleton />
        ) : (
          <p className="text-2xl font-bold text-slate-800">
            {savingsRate.toFixed(1)}%
          </p>
        )}
      </div>
      <div className="mt-auto">
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full bg-brand-coral ${isLoading ? 'w-0' : ''}`}
            style={
              isLoading
                ? undefined
                : { width: `${Math.min(savingsRate, 100)}%` }
            }
          />
        </div>
        <p className="mt-1 text-xs text-slate-500">
          수입 대비 저축 (수입 - 지출)
        </p>
      </div>
    </div>
  );
}
