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
import { useCategorySpendingQuery } from '../_api/useCategorySpendingQuery';
import { CrossfadeContent } from '@/components/common/CrossfadeContent';
import { HorizontalBarChartSkeleton } from './dashboard-skeletons';

const FALLBACK_COLORS = ['#F97354', '#3B82F6', '#F59E0B', '#10B981', '#8B5CF6'];

function formatWon(value: number) {
  if (value >= 10000) return `${Math.floor(value / 10000)}만`;
  return `${value.toLocaleString('ko-KR')}`;
}

export function TopSpendingCategories() {
  const { data = [], isLoading } = useCategorySpendingQuery();

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <h3 className="font-semibold text-slate-800">
          이달의 TOP 소비 카테고리
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
        skeleton={<HorizontalBarChartSkeleton rows={5} />}
      >
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-400">
              이번 달 지출 내역이 없습니다.
            </p>
          </div>
        ) : (
          <div className="h-full min-h-[140px] w-full">
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
                <Bar
                  dataKey="total"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={24}
                  isAnimationActive
                  animationDuration={500}
                  animationEasing="ease-out"
                >
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
      </CrossfadeContent>
    </div>
  );
}
