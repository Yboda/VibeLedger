'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return '좋은 아침이에요';
  if (hour < 18) return '좋은 오후예요';
  return '좋은 저녁이에요';
}

export default function DashboardPage() {
  const [userName, setUserName] = useState('');
  const { data: summary, isLoading: summaryLoading } = useMonthlySummaryQuery();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      const name = user?.user_metadata?.display_name ?? user?.email ?? '';
      setUserName(name);
    });
  }, []);

  useSetHeader({
    subtitle: getGreeting(),
    titleHighlight: userName,
    titleSuffix: '님, 반갑습니다!',
    showDate: true,
  });

  const totalIncome = summary?.totalIncome ?? 0;
  const totalExpense = summary?.totalExpense ?? 0;

  return (
    <>
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
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
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-6">
        <MonthlySpendingTrend />
        <BudgetStatus />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <RecentTransactions />
        <TopSpendingCategories />
      </div>
    </>
  );
}
