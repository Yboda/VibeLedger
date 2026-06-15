'use client';

import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { fetchMonthlyBudgetTotals } from '@/lib/api/budgets';
import { CrossfadeContent } from '@/components/common/CrossfadeContent';
import { PairedBarChartSkeleton } from '@/components/common/skeletons';
import { useMonthlyTrendQuery } from '../../dashboard/_api/useMonthlyTrendQuery';

function formatYAxis(value: number) {
  if (value >= 10000) return `${Math.floor(value / 10000)}만`;
  return `${value}`;
}

export function MonthlyComparison() {
  const { data: budgetTotals = [], isLoading: isBudgetLoading } = useQuery({
    queryKey: ['budgets', 'monthly-totals', 6],
    queryFn: () => fetchMonthlyBudgetTotals(6),
  });

  const { data: spendingTrend = [], isLoading: isSpendingLoading } =
    useMonthlyTrendQuery(6);

  const isLoading = isBudgetLoading || isSpendingLoading;

  const chartData = budgetTotals.map(bt => {
    const spending = spendingTrend.find(s => s.month === bt.month);
    return {
      month: bt.month,
      예산: bt.budget,
      지출: spending?.expense ?? 0,
    };
  });

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        월별 예산 vs 지출 추이
      </h3>
      <CrossfadeContent
        isLoading={isLoading}
        skeleton={<PairedBarChartSkeleton bars={6} height={192} />}
        className="h-48"
      >
        <ResponsiveContainer width="100%" height={192}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 8, bottom: 0, left: 8 }}
            barCategoryGap="30%"
            barGap={4}
          >
            <CartesianGrid vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              formatter={(value: unknown, name: unknown) => [
                `${Number(value).toLocaleString('ko-KR')}원`,
                String(name),
              ]}
              contentStyle={{
                borderRadius: 8,
                fontSize: 13,
                border: '1px solid #e2e8f0',
              }}
              cursor={{ fill: '#f8fafc' }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />
            <Bar
              dataKey="예산"
              fill="#cbd5e1"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="지출"
              fill="#1e293b"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </CrossfadeContent>
    </div>
  );
}
