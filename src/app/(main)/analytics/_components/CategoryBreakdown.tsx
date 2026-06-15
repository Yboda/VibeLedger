'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
  BookOpen,
  Banknote,
  Car,
  Gift,
  Heart,
  Home,
  MoreHorizontal,
  Music,
  ShoppingBag,
  Smartphone,
  TrendingUp,
  Utensils,
  type LucideProps,
} from 'lucide-react';
import { type ElementType } from 'react';
import { CrossfadeContent } from '@/components/common/CrossfadeContent';
import { DonutChartSkeleton } from '@/components/common/skeletons';
import { useCategorySpendingByRangeQuery } from '../_api/useAnalyticsQuery';
import { useAnalyticsPeriod } from '../_providers/analytics-period-context';

const ICON_MAP: Record<string, ElementType<LucideProps>> = {
  utensils: Utensils,
  car: Car,
  home: Home,
  smartphone: Smartphone,
  'shopping-bag': ShoppingBag,
  heart: Heart,
  'book-open': BookOpen,
  music: Music,
  briefcase: Banknote,
  gift: Gift,
  'trending-up': TrendingUp,
};

const DONUT_COLORS = [
  '#F97354',
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
];

function formatAmount(amount: number): string {
  if (amount >= 100_000_000) return `${(amount / 100_000_000).toFixed(1)}억`;
  if (amount >= 10_000)
    return `${(amount / 10_000) % 1 === 0 ? amount / 10_000 : (amount / 10_000).toFixed(1)}만`;
  return amount.toLocaleString('ko-KR');
}

interface ChartItem {
  name: string;
  value: number;
  color: string;
  totalForPct: number;
}

interface DonutTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: ChartItem }>;
}

function DonutTooltip({ active, payload }: DonutTooltipProps) {
  if (!active || !payload?.length || !payload[0]) return null;
  const { name, value, payload: raw } = payload[0];
  const pct =
    raw.totalForPct > 0 ? ((value / raw.totalForPct) * 100).toFixed(1) : '0.0';
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-sm pointer-events-none">
      <p className="font-semibold text-slate-700 mb-0.5">{name}</p>
      <p className="text-slate-500">₩{value.toLocaleString('ko-KR')}</p>
      <p className="text-slate-400 text-xs">{pct}%</p>
    </div>
  );
}

export function CategoryBreakdown() {
  const { startDate, endDate } = useAnalyticsPeriod();
  const { data: categories = [], isLoading } = useCategorySpendingByRangeQuery(
    startDate,
    endDate
  );

  const total = categories.reduce((sum, c) => sum + c.total, 0);

  const chartData: ChartItem[] = categories.map((cat, i) => ({
    name: cat.name,
    value: cat.total,
    color: cat.color ?? DONUT_COLORS[i % DONUT_COLORS.length] ?? '#6B7280',
    totalForPct: total,
  }));

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 shrink-0">
        카테고리별 지출
      </h3>

      <CrossfadeContent
        isLoading={isLoading}
        skeleton={<DonutChartSkeleton rows={5} />}
        className="flex-1"
      >
        {categories.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-slate-400">
              해당 기간에 지출 내역이 없습니다.
            </p>
          </div>
        ) : (
          <>
            {/* 도넛 차트 (Recharts) — 중앙 금액 오버레이 */}
            <div className="relative shrink-0" style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius="45%"
                    outerRadius="70%"
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={categories.length > 1 ? 2 : 0}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<DonutTooltip />}
                    wrapperStyle={{ zIndex: 10 }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* 중앙 총 지출 텍스트 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-base font-bold text-slate-800 leading-tight">
                  ₩{formatAmount(total)}
                </p>
                <p className="text-xs text-slate-500">총 지출</p>
              </div>
            </div>

            {/* 카테고리 목록 */}
            <div className="flex-1 min-h-0 space-y-2.5 overflow-y-auto pr-1 mt-4">
              {categories.map((cat, i) => {
                const color =
                  cat.color ??
                  DONUT_COLORS[i % DONUT_COLORS.length] ??
                  '#6B7280';
                const percentage = total > 0 ? (cat.total / total) * 100 : 0;
                const Icon =
                  (cat.icon ? ICON_MAP[cat.icon] : null) ?? MoreHorizontal;

                return (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-700 truncate">
                          {cat.name}
                        </span>
                        <span className="text-sm font-semibold text-slate-800 ml-2 shrink-0">
                          ₩{cat.total.toLocaleString('ko-KR')}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 w-9 text-right shrink-0">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CrossfadeContent>
    </div>
  );
}
