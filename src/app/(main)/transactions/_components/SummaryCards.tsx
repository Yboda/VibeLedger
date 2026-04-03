'use client';

import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Spinner from '@/components/common/Spinner';
import { useMonthlySummaryQuery } from '../_api/useMonthlySummaryQuery';

export function SummaryCards() {
  const { data, isLoading: loading } = useMonthlySummaryQuery();

  const summary = data ?? { totalIncome: 0, totalExpense: 0, netBalance: 0 };

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm">이번 달 수입</p>
            {loading ? (
              <Spinner className="mt-2" />
            ) : (
              <p className="text-2xl font-bold text-slate-800">
                +₩{summary.totalIncome.toLocaleString()}
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <ArrowDownRight className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm">이번 달 지출</p>
            {loading ? (
              <Spinner className="mt-2" />
            ) : (
              <p className="text-2xl font-bold text-slate-800">
                -₩{summary.totalExpense.toLocaleString()}
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-[#F97354] rounded-xl p-5 shadow-sm text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">순 잔액</p>
            {loading ? (
              <Spinner className="mt-2 text-white" />
            ) : (
              <p className="text-2xl font-bold">
                {summary.netBalance >= 0 ? '+' : ''}₩
                {summary.netBalance.toLocaleString()}
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowDownRight className="w-6 h-6 text-white" />
          </div>
        </div>
        <p className="text-xs text-white/80 mt-2">수입 - 지출</p>
      </div>
    </div>
  );
}
