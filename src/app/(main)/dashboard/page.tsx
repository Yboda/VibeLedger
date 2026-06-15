'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getUserDisplayName } from '@/lib/auth/display-name';
import { useSetHeader } from '../_providers/header-context';
import { TotalBalanceCard } from './_components/TotalBalanceCard';
import { StatCard } from './_components/StatCard';
import { MiniLineChart } from './_components/MiniLineChart';
import { SavingsGoalCard } from './_components/SavingsGoalCard';
import { MonthlySpendingTrend } from './_components/MonthlySpendingTrend';
import { BudgetStatus } from './_components/BudgetStatus';
import { RecentTransactions } from './_components/RecentTransactions';
import { TopSpendingCategories } from './_components/TopSpendingCategories';
import { useMonthlySummaryQuery } from '../transactions/_api/useMonthlySummaryQuery';
import { DASHBOARD_LAYOUT } from './_components/dashboard-skeletons';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return '좋은 아침이에요';
  if (hour < 18) return '좋은 오후예요';
  return '좋은 저녁이에요';
}

export default function DashboardPage() {
  const [userName, setUserName] = useState<string | null>(null);
  const { data: summary, isLoading: summaryLoading } = useMonthlySummaryQuery();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserName(getUserDisplayName(user));
    });
  }, []);

  useSetHeader({
    subtitle: getGreeting(),
    ...(userName !== null
      ? { titleHighlight: userName, titleSuffix: '님, 반갑습니다!' }
      : { titleLoading: true }),
    showDate: true,
  });

  const totalIncome = summary?.totalIncome ?? 0;
  const totalExpense = summary?.totalExpense ?? 0;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
      {/* Stats Row */}
      <div
        className="grid shrink-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5"
        style={{ height: DASHBOARD_LAYOUT.statsRow }}
      >
        <TotalBalanceCard />
        <StatCard
          title="이번 달 수입"
          value={`+₩${totalIncome.toLocaleString('ko-KR')}`}
          isLoading={summaryLoading}
          chart={<MiniLineChart color="var(--color-brand-yellow)" />}
        />
        <StatCard
          title="이번 달 지출"
          value={`-₩${totalExpense.toLocaleString('ko-KR')}`}
          isLoading={summaryLoading}
          chart={<MiniLineChart color="var(--color-brand-navy)" />}
        />
        <SavingsGoalCard />
      </div>

      {/* Charts Row */}
      <div
        className="grid shrink-0 grid-cols-1 gap-4 xl:grid-cols-4"
        style={{ height: DASHBOARD_LAYOUT.chartsRow }}
      >
        <MonthlySpendingTrend />
        <BudgetStatus />
      </div>

      {/* Bottom Row — 남은 높이 전부 사용 */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-2">
        <RecentTransactions />
        <TopSpendingCategories />
      </div>
    </div>
  );
}
