'use client';

import { HandCoins, Receipt, Activity } from 'lucide-react';
import { CrossfadeContent } from '@/components/common/CrossfadeContent';
import { StatCardsRowSkeleton } from '@/components/common/skeletons';
import { useMonthlySummaryQuery } from '../_api/useMonthlySummaryQuery';

export function SummaryCards() {
  const { data, isLoading: loading } = useMonthlySummaryQuery();

  const summary = data ?? { totalIncome: 0, totalExpense: 0, netBalance: 0 };

  return (
    <CrossfadeContent
      isLoading={loading}
      skeleton={<StatCardsRowSkeleton count={3} className="mb-6 grid-cols-3" />}
    >
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">이번 달 수입</p>
              <p className="text-2xl font-bold text-slate-800">
                +₩{summary.totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <HandCoins className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">이번 달 지출</p>
              <p className="text-2xl font-bold text-slate-800">
                -₩{summary.totalExpense.toLocaleString()}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Receipt className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-[#F97354] p-5 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">이달의 흐름</p>
              <p className="text-2xl font-bold">
                {summary.netBalance >= 0 ? '+' : ''}₩
                {summary.netBalance.toLocaleString()}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="mt-2 text-xs text-white/80">수입 - 지출</p>
        </div>
      </div>
    </CrossfadeContent>
  );
}
