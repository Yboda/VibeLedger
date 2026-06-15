'use client';

import { useMemo } from 'react';
import { CrossfadeContent } from '@/components/common/CrossfadeContent';
import { HeatmapSkeleton } from '@/components/common/skeletons';
import { useTransactionsByRangeQuery } from '../_api/useAnalyticsQuery';
import { useAnalyticsPeriod } from '../_providers/analytics-period-context';

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

// 날짜를 주차(0-based)와 요일(0=월 ~ 6=일)로 변환
function getWeekAndDay(dateStr: string) {
  const d = new Date(dateStr);
  // 해당 월 1일의 요일 기준 주차 시작
  const dayOfWeek = d.getDay(); // 0=일, 1=월, ..., 6=토
  const weekDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0=월, 6=일

  // 1일을 기준으로 주차 계산
  const firstDayOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
  const firstDayOfWeek =
    firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
  const weekIndex = Math.floor((d.getDate() - 1 + firstDayOfWeek) / 7);

  return { weekIndex, weekDay };
}

function getIntensityClass(value: number, max: number) {
  if (max === 0 || value === 0) return 'bg-gray-100';
  const ratio = value / max;
  if (ratio < 0.2) return 'bg-green-100';
  if (ratio < 0.4) return 'bg-green-200';
  if (ratio < 0.6) return 'bg-yellow-200';
  if (ratio < 0.8) return 'bg-orange-200';
  return 'bg-red-300';
}

export function WeeklyHeatmap() {
  const { startDate, endDate } = useAnalyticsPeriod();
  const { data: transactions = [], isLoading } = useTransactionsByRangeQuery(
    startDate,
    endDate
  );

  const { grid, weekLabels, maxVal } = useMemo(() => {
    const rangeStart = new Date(startDate);
    const monthStart = new Date(
      rangeStart.getFullYear(),
      rangeStart.getMonth(),
      1
    );

    // 해당 월의 최대 주차 계산
    const lastDay = new Date(
      rangeStart.getFullYear(),
      rangeStart.getMonth() + 1,
      0
    );
    const firstDayOfWeek =
      monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1;
    const totalWeeks = Math.ceil((lastDay.getDate() + firstDayOfWeek) / 7);

    // grid[weekIndex][dayIndex] = 지출 합계
    const grid: number[][] = Array.from({ length: totalWeeks }, () =>
      Array(7).fill(0)
    );

    for (const tx of transactions) {
      if (tx.categories?.type !== 'EXPENSE') continue;
      const { weekIndex, weekDay } = getWeekAndDay(tx.date);
      const row = grid[weekIndex];
      if (weekIndex >= 0 && weekIndex < totalWeeks && row !== undefined) {
        row[weekDay] = (row[weekDay] ?? 0) + tx.amount;
      }
    }

    const allVals = grid.flat();
    const maxVal = Math.max(...allVals, 1);

    const weekLabels = Array.from(
      { length: totalWeeks },
      (_, i) => `${i + 1}주차`
    );

    return { grid, weekLabels, maxVal };
  }, [transactions, startDate]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        요일별 지출 패턴
      </h3>

      <CrossfadeContent
        isLoading={isLoading}
        skeleton={<HeatmapSkeleton weeks={5} days={7} />}
        className="min-h-[192px]"
      >
        <>
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 pt-6">
              {weekLabels.map((week, i) => (
                <div
                  key={i}
                  className="h-10 flex items-center text-xs text-slate-500"
                >
                  {week}
                </div>
              ))}
            </div>
            <div className="flex-1">
              <div className="flex gap-2 mb-2">
                {DAY_LABELS.map((day, i) => (
                  <div
                    key={i}
                    className="flex-1 text-center text-xs text-slate-500 font-medium"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {grid.map((week, wi) => (
                  <div key={wi} className="flex gap-2">
                    {week.map((value, di) => (
                      <div
                        key={di}
                        title={
                          value > 0
                            ? `₩${value.toLocaleString('ko-KR')}`
                            : '지출 없음'
                        }
                        className={`flex-1 h-10 rounded-lg ${getIntensityClass(value, maxVal)} flex items-center justify-center text-xs font-medium text-slate-700 hover:ring-2 hover:ring-slate-400 transition-all cursor-pointer`}
                      >
                        {value > 0
                          ? value >= 10000
                            ? `${Math.floor(value / 10000)}만`
                            : `${value.toLocaleString('ko-KR')}`
                          : ''}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-xs text-slate-500">적음</span>
            <div className="flex gap-1">
              {[
                'bg-green-100',
                'bg-green-200',
                'bg-yellow-200',
                'bg-orange-200',
                'bg-red-300',
              ].map((bg, i) => (
                <div key={i} className={`w-4 h-4 rounded ${bg}`} />
              ))}
            </div>
            <span className="text-xs text-slate-500">많음</span>
          </div>
        </>
      </CrossfadeContent>
    </div>
  );
}
