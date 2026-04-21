'use client';

import { useSetHeader } from '../_providers/header-context';
import { AnalyticsPeriodProvider } from './_providers/analytics-period-context';
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

export default function AnalyticsPage() {
  return (
    <AnalyticsPeriodProvider>
      <AnalyticsHeader />

      {/* 기간 선택 — Provider 내부에서 렌더 */}
      <div className="flex justify-end mb-4">
        <PeriodSelector />
      </div>

      <KeyMetrics />
      <SpendingTrendChart />
      <div className="grid grid-cols-2 gap-6">
        <CategoryBreakdown />
        <Insights />
      </div>
      <WeeklyHeatmap />
    </AnalyticsPeriodProvider>
  );
}
