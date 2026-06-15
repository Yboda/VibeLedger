'use client';

import Link from 'next/link';
import {
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useMonthlyTrendQuery } from '../_api/useMonthlyTrendQuery';
import { CrossfadeContent } from '@/components/common/CrossfadeContent';
import { MonthlyTrendChartSkeleton } from './dashboard-skeletons';

const NAVY = '#1e293b';
const YELLOW = '#fbbf24';

function formatYAxis(value: number) {
  if (value >= 10000) return `${Math.floor(value / 10000)}만`;
  return `${value}`;
}

export function MonthlySpendingTrend() {
  const { data = [], isLoading } = useMonthlyTrendQuery(12);

  return (
    <div className="col-span-3 flex h-full flex-col overflow-hidden rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <h3 className="font-semibold text-slate-800">
          월별 수입 / 지출 트렌드
        </h3>
        <Link
          href="/analytics"
          className="text-sm font-medium text-[#F97354] hover:underline"
        >
          분석 보기
        </Link>
      </div>
      <CrossfadeContent
        isLoading={isLoading}
        className="min-h-0 w-full flex-1"
        skeleton={<MonthlyTrendChartSkeleton />}
      >
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 4, right: 8, bottom: 0, left: 8 }}
              barCategoryGap="40%"
            >
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={YELLOW} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={YELLOW} stopOpacity={0} />
                </linearGradient>
              </defs>
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
                  name === 'income' ? '수입' : '지출',
                ]}
                contentStyle={{
                  borderRadius: 8,
                  fontSize: 13,
                  border: '1px solid #e2e8f0',
                }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Legend
                formatter={value => (value === 'income' ? '수입' : '지출')}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke={YELLOW}
                strokeWidth={2}
                fill="url(#incomeGradient)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                isAnimationActive
                animationDuration={500}
                animationEasing="ease-out"
              />
              <Bar
                dataKey="expense"
                fill={NAVY}
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
                isAnimationActive
                animationDuration={500}
                animationEasing="ease-out"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CrossfadeContent>
    </div>
  );
}
