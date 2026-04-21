'use client';

import Link from 'next/link';
import Spinner from '@/components/common/Spinner';
import { useBudgetsQuery } from '../../budgets/_api/useBudgetsQuery';

export function BudgetStatus() {
  const now = new Date();
  const { data: budgets = [], isLoading } = useBudgetsQuery(
    now.getMonth() + 1,
    now.getFullYear()
  );

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">예산 현황</h3>
        <Link
          href="/budgets"
          className="text-brand-coral text-sm font-medium hover:underline"
        >
          전체 보기
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[140px]">
          <Spinner size="sm" />
        </div>
      ) : budgets.length === 0 ? (
        <div className="flex items-center justify-center h-[140px]">
          <p className="text-slate-400 text-sm text-center">
            이번 달 예산이 없습니다.
            <br />
            <Link href="/budgets" className="text-brand-coral hover:underline">
              예산 설정하기
            </Link>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {budgets.slice(0, 4).map(item => {
            const percentage =
              item.budget_amount > 0
                ? Math.min((item.spent_amount / item.budget_amount) * 100, 100)
                : 0;
            const isOver = item.spent_amount > item.budget_amount;

            return (
              <div key={item.budget_id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{item.category_name}</span>
                  <span
                    className={`font-medium ${isOver ? 'text-red-500' : 'text-slate-800'}`}
                  >
                    ₩{item.spent_amount.toLocaleString('ko-KR')} / ₩
                    {item.budget_amount.toLocaleString('ko-KR')}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: isOver
                        ? '#ef4444'
                        : (item.category_color ?? '#F97354'),
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
