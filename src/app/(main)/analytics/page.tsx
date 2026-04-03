'use client';

import { useMemo } from 'react';
import { useSetHeader } from '../_providers/header-context';
import { PeriodSelector } from './_components/PeriodSelector';
import { KeyMetrics } from './_components/KeyMetrics';
import { SpendingTrendChart } from './_components/SpendingTrendChart';
import { CategoryBreakdown } from './_components/CategoryBreakdown';
import { Insights } from './_components/Insights';
import { WeeklyHeatmap } from './_components/WeeklyHeatmap';

export default function AnalyticsPage() {
  const action = useMemo(() => <PeriodSelector />, []);

  useSetHeader({
    title: '분석 리포트',
    description: '지출 패턴을 분석하고 재정 목표를 달성하세요',
    action,
  });

  return (
    <>
      <KeyMetrics />
      <SpendingTrendChart />
      <div className="grid grid-cols-2 gap-6">
        <CategoryBreakdown />
        <Insights />
      </div>
      <WeeklyHeatmap />
    </>
  );
}
