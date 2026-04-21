'use client';

import { type ReactElement } from 'react';
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
import Spinner from '@/components/common/Spinner';
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

export function CategoryBreakdown() {
  const { startDate, endDate } = useAnalyticsPeriod();
  const { data: categories = [], isLoading } = useCategorySpendingByRangeQuery(
    startDate,
    endDate
  );

  const total = categories.reduce((sum, c) => sum + c.total, 0);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        카테고리별 지출
      </h3>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Spinner size="sm" />
        </div>
      ) : categories.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-slate-400 text-sm">
            해당 기간에 지출 내역이 없습니다.
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-8">
          {/* 도넛 차트 */}
          <div className="relative w-48 h-48 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {
                categories.reduce(
                  (acc, cat, i) => {
                    const startAngle = acc.offset;
                    const angle = total > 0 ? (cat.total / total) * 360 : 0;
                    const endAngle = startAngle + angle;

                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;

                    const x1 = 50 + 40 * Math.cos(startRad);
                    const y1 = 50 + 40 * Math.sin(startRad);
                    const x2 = 50 + 40 * Math.cos(endRad);
                    const y2 = 50 + 40 * Math.sin(endRad);

                    const largeArc = angle > 180 ? 1 : 0;

                    acc.paths.push(
                      <path
                        key={i}
                        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={cat.color ?? '#6B7280'}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    );

                    acc.offset = endAngle;
                    return acc;
                  },
                  { paths: [] as ReactElement[], offset: 0 }
                ).paths
              }
              <circle cx="50" cy="50" r="25" fill="white" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-slate-800">
                ₩{total.toLocaleString('ko-KR')}
              </p>
              <p className="text-xs text-slate-500">총 지출</p>
            </div>
          </div>

          {/* 목록 */}
          <div className="flex-1 space-y-3">
            {categories.map((cat, i) => {
              const percentage = total > 0 ? (cat.total / total) * 100 : 0;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: cat.color ?? '#6B7280' }}
                  >
                    {(() => {
                      const Icon =
                        (cat.icon ? ICON_MAP[cat.icon] : null) ??
                        MoreHorizontal;
                      return <Icon className="w-4 h-4 text-white" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-700">
                        {cat.name}
                      </span>
                      <span className="text-sm font-semibold text-slate-800">
                        ₩{cat.total.toLocaleString('ko-KR')}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: cat.color ?? '#6B7280',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
