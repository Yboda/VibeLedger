'use client';

import Spinner from '@/components/common/Spinner';
import {
  useMonthlyTrendForAnalyticsQuery,
  useTransactionsByRangeQuery,
} from '../_api/useAnalyticsQuery';
import { useAnalyticsPeriod } from '../_providers/analytics-period-context';

// 주간 모드: 거래 데이터를 요일별로 집계
function buildWeeklyData(
  transactions: {
    date: string;
    amount: number;
    categories: { type: string } | null;
  }[]
) {
  const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];
  const incomeByDay = Array(7).fill(0);
  const expenseByDay = Array(7).fill(0);

  for (const tx of transactions) {
    const d = new Date(tx.date);
    let diff = d.getDay() - 1; // 월=0, 일=6
    if (diff < 0) diff = 6;
    const type = tx.categories?.type;
    if (type === 'INCOME') incomeByDay[diff] += tx.amount;
    else if (type === 'EXPENSE') expenseByDay[diff] += tx.amount;
  }

  return DAY_LABELS.map((label, i) => ({
    month: label,
    income: incomeByDay[i],
    expense: expenseByDay[i],
  }));
}

export function SpendingTrendChart() {
  const { period, startDate, endDate } = useAnalyticsPeriod();

  // month/year → monthly trend API, week → raw transactions
  const monthlyMonths = period === 'year' ? 12 : 6;
  const { data: monthlyData = [], isLoading: monthlyLoading } =
    useMonthlyTrendForAnalyticsQuery(monthlyMonths);

  const { data: weekTxs = [], isLoading: weekLoading } =
    useTransactionsByRangeQuery(startDate, endDate);

  const isLoading = period === 'week' ? weekLoading : monthlyLoading;

  let chartData: { month: string; income: number; expense: number }[] = [];
  if (period === 'week') {
    chartData = buildWeeklyData(
      weekTxs.map(tx => ({
        date: tx.date,
        amount: tx.amount,
        categories: tx.categories ? { type: tx.categories.type } : null,
      }))
    );
  } else {
    chartData = monthlyData;
  }

  const maxValue = Math.max(
    1,
    ...chartData.flatMap(d => [d.income, d.expense])
  );

  const periodLabel =
    period === 'week'
      ? '요일별'
      : period === 'year'
        ? '연간 월별'
        : '최근 6개월';

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">
          수입 vs 지출 추이 ({periodLabel})
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FBBF24]" />
            <span className="text-sm text-slate-600">수입</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#F97354]" />
            <span className="text-sm text-slate-600">지출</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner size="sm" />
        </div>
      ) : (
        <div className="flex items-end gap-2 h-64">
          {chartData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full flex gap-1 items-end"
                style={{ height: '220px' }}
              >
                <div
                  className="flex-1 bg-[#FBBF24] rounded-t transition-all duration-300 hover:opacity-80"
                  style={{ height: `${(d.income / maxValue) * 100}%` }}
                />
                <div
                  className="flex-1 bg-[#F97354] rounded-t transition-all duration-300 hover:opacity-80"
                  style={{ height: `${(d.expense / maxValue) * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">{d.month}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
