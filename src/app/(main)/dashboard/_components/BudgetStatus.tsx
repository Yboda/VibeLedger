'use client';

import Link from 'next/link';
import { useBudgetsQuery } from '../../budgets/_api/useBudgetsQuery';
import { CrossfadeContent } from '@/components/common/CrossfadeContent';
import { BudgetListSkeleton } from './dashboard-skeletons';

const BUDGET_SLOT_COUNT = 4;

export function BudgetStatus() {
  const now = new Date();
  const { data: budgets = [], isLoading } = useBudgetsQuery(
    now.getMonth() + 1,
    now.getFullYear()
  );

  const displayBudgets = budgets.slice(0, BUDGET_SLOT_COUNT);
  const emptySlots = Math.max(0, BUDGET_SLOT_COUNT - displayBudgets.length);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <h3 className="font-semibold text-slate-800">예산 현황</h3>
        <Link
          href="/budgets"
          className="text-sm font-medium text-brand-coral hover:underline"
        >
          전체 보기
        </Link>
      </div>

      <CrossfadeContent
        isLoading={isLoading}
        className="min-h-0 w-full flex-1"
        skeleton={<BudgetListSkeleton rows={BUDGET_SLOT_COUNT} />}
      >
        {displayBudgets.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-sm text-slate-400">
              이번 달 예산이 없습니다.
              <br />
              <Link
                href="/budgets"
                className="text-brand-coral hover:underline"
              >
                예산 설정하기
              </Link>
            </p>
          </div>
        ) : (
          <div className="flex h-full flex-col justify-between">
            {displayBudgets.map(item => {
              const percentage =
                item.budget_amount > 0
                  ? Math.min(
                      (item.spent_amount / item.budget_amount) * 100,
                      100
                    )
                  : 0;
              const isOver = item.spent_amount > item.budget_amount;

              return (
                <div key={item.budget_id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-slate-600">{item.category_name}</span>
                    <span
                      className={`font-medium ${isOver ? 'text-red-500' : 'text-slate-800'}`}
                    >
                      ₩{item.spent_amount.toLocaleString('ko-KR')} / ₩
                      {item.budget_amount.toLocaleString('ko-KR')}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full"
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
            {Array.from({ length: emptySlots }).map((_, index) => (
              <div key={`empty-${index}`} className="invisible" aria-hidden>
                <div className="mb-1 h-4" />
                <div className="h-2" />
              </div>
            ))}
          </div>
        )}
      </CrossfadeContent>
    </div>
  );
}
