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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return '좋은 아침이에요';
  if (hour < 18) return '좋은 오후예요';
  return '좋은 저녁이에요';
}

export default function DashboardPage() {
  const [userName, setUserName] = useState('');

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

  return (
    <>
      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <TotalBalanceCard />
        <StatCard
          title="Total Income"
          value="₩2,293.31"
          chart={<MiniLineChart />}
        />
        <StatCard
          title="Total Expenses"
          value="₩384.90"
          chart={<MiniLineChart />}
        />
        <SavingsGoalCard />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MonthlySpendingTrend />
        <BudgetStatus />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-4">
        <RecentTransactions />
        <TopSpendingCategories />
      </div>
    </>
  );
}
