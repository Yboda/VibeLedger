'use client';

import { useSetHeader } from '../_providers/header-context';
import {
  AnalyticsPeriodProvider,
  useAnalyticsPeriod,
  type AnalyticsPeriod,
} from './_providers/analytics-period-context';
import { PeriodSelector } from './_components/PeriodSelector';
import { KeyMetrics } from './_components/KeyMetrics';
import { SpendingTrendChart } from './_components/SpendingTrendChart';
import { CategoryBreakdown } from './_components/CategoryBreakdown';
import { Insights } from './_components/Insights';
import { WeeklyHeatmap } from './_components/WeeklyHeatmap';

function AnalyticsHeader() {
  useSetHeader({
    title: '분석 리포트',
    description: '지출 패턴을 분석하고 재정 목표를 달성하세요',
  });
  return null;
}

const DAY_KO = ['일', '월', '화', '수', '목', '금', '토'];

function formatDateRange(
  startDate: string,
  endDate: string,
  period: AnalyticsPeriod
): string {
  const s = new Date(startDate);
  const e = new Date(endDate);

  if (period === 'year') return `${s.getFullYear()}년`;
  if (period === 'month') return `${s.getFullYear()}년 ${s.getMonth() + 1}월`;

  // week
  const sStr = `${s.getMonth() + 1}월 ${s.getDate()}일(${DAY_KO[s.getDay()]})`;
  const eStr = `${e.getMonth() + 1}월 ${e.getDate()}일(${DAY_KO[e.getDay()]})`;
  return `${sStr} ~ ${eStr}`;
}

function PeriodHeader() {
  const { period, startDate, endDate } = useAnalyticsPeriod();
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-sm font-medium text-slate-700">
          {formatDateRange(startDate, endDate, period)}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          기간을 선택해 분석 범위를 바꿀 수 있어요
        </p>
      </div>
      <PeriodSelector />
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <AnalyticsPeriodProvider>
      <AnalyticsHeader />
      <PeriodHeader />
      <KeyMetrics />
      <SpendingTrendChart />
      <div className="grid grid-cols-2 gap-6 items-stretch">
        <CategoryBreakdown />
        <Insights />
      </div>
      <WeeklyHeatmap />
    </AnalyticsPeriodProvider>
  );
}
