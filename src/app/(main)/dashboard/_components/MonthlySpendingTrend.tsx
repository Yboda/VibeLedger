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
import Spinner from '@/components/common/Spinner';
import { useMonthlyTrendQuery } from '../_api/useMonthlyTrendQuery';

const NAVY = '#1e293b';
const YELLOW = '#fbbf24';

function formatYAxis(value: number) {
  if (value >= 10000) return `${Math.floor(value / 10000)}만`;
  return `${value}`;
}

export function MonthlySpendingTrend() {
  const { data = [], isLoading } = useMonthlyTrendQuery(12);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm col-span-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">
          월별 수입 / 지출 트렌드
        </h3>
        <Link
          href="/analytics"
          className="text-[#F97354] text-sm font-medium hover:underline"
        >
          분석 보기
        </Link>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-[192px]">
          <Spinner size="sm" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={192}>
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
            {/* 수입: Area (물결+배경색, 바 뒤에 렌더) */}
            <Area
              type="monotone"
              dataKey="income"
              stroke={YELLOW}
              strokeWidth={2}
              fill="url(#incomeGradient)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            {/* 지출: Bar (앞에 렌더) */}
            <Bar
              dataKey="expense"
              fill={NAVY}
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
