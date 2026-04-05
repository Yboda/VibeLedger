'use client';

import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import Spinner from '@/components/common/Spinner';
import { useCategorySpendingQuery } from '../_api/useCategorySpendingQuery';

const FALLBACK_COLORS = ['#F97354', '#3B82F6', '#F59E0B', '#10B981', '#8B5CF6'];

function formatWon(value: number) {
  if (value >= 10000) return `${Math.floor(value / 10000)}만`;
  return `${value.toLocaleString('ko-KR')}`;
}

export function TopSpendingCategories() {
  const { data = [], isLoading } = useCategorySpendingQuery();

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">
          이달의 TOP 소비 카테고리
        </h3>
        <Link
          href="/analytics"
          className="text-[#F97354] text-sm font-medium hover:underline"
        >
          분석 보기
        </Link>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="sm" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-400 text-sm">
            이번 달 지출 내역이 없습니다.
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 4, right: 56, bottom: 4, left: 4 }}
            >
              <XAxis
                type="number"
                tickFormatter={formatWon}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: '#475569' }}
                width={64}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: unknown) => [
                  `${Number(value).toLocaleString('ko-KR')}원`,
                  '지출',
                ]}
                contentStyle={{
                  borderRadius: 8,
                  fontSize: 13,
                  border: '1px solid #e2e8f0',
                }}
              />
              <Bar dataKey="total" radius={[0, 4, 4, 0]} maxBarSize={24}>
                {data.map((entry, idx) => (
                  <Cell
                    key={entry.category_id}
                    fill={
                      entry.color ||
                      FALLBACK_COLORS[idx % FALLBACK_COLORS.length]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
