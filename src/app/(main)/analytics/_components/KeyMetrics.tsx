'use client';

import { useMemo } from 'react';
import { ArrowLeftRight, Home, TrendingDown, TrendingUp } from 'lucide-react';
import Spinner from '@/components/common/Spinner';
import { useTransactionsByRangeQuery } from '../_api/useAnalyticsQuery';
import { useAnalyticsPeriod } from '../_providers/analytics-period-context';

function getDayCount(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function KeyMetrics() {
  const { startDate, endDate } = useAnalyticsPeriod();
  const { data: transactions = [], isLoading } = useTransactionsByRangeQuery(
    startDate,
    endDate
  );

  const metrics = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let maxExpense = 0;
    let maxExpenseCategory = '-';
    let expenseCount = 0;

    for (const tx of transactions) {
      const type = tx.categories?.type;
      if (type === 'INCOME') {
        totalIncome += tx.amount;
      } else if (type === 'EXPENSE') {
        totalExpense += tx.amount;
        expenseCount++;
        if (tx.amount > maxExpense) {
          maxExpense = tx.amount;
          maxExpenseCategory = tx.categories?.name ?? '-';
        }
      }
    }

    const dayCount = getDayCount(startDate, endDate);
    const avgDailyExpense = totalExpense / dayCount;
    const savingsRate =
      totalIncome > 0
        ? Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100)
        : 0;

    return {
      avgDailyExpense,
      maxExpense,
      maxExpenseCategory,
      savingsRate,
      expenseCount,
    };
  }, [transactions, startDate, endDate]);

  const cards = [
    {
      label: '평균 일일 지출',
      value: `₩${Math.floor(metrics.avgDailyExpense).toLocaleString('ko-KR')}`,
      icon: TrendingDown,
      colorClass: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: '최대 단일 지출',
      value: `₩${metrics.maxExpense.toLocaleString('ko-KR')}`,
      subLabel: metrics.maxExpenseCategory,
      icon: Home,
      colorClass: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      label: '저축률',
      value: `${metrics.savingsRate.toFixed(1)}%`,
      subLabel: '수입 대비',
      icon: TrendingUp,
      colorClass: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      label: '지출 건수',
      value: `${metrics.expenseCount}건`,
      icon: ArrowLeftRight,
      colorClass: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.colorClass}`}
            >
              <card.icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
          </div>
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              <p className="text-sm text-slate-500">{card.label}</p>
              {card.subLabel && (
                <p className="text-xs text-slate-400 mt-0.5">{card.subLabel}</p>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
