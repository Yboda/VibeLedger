'use client';

import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSetHeader } from '../_providers/header-context';
import { BudgetSummary } from './_components/BudgetSummary';
import { BudgetCardsGrid } from './_components/BudgetCardsGrid';
import { MonthlyComparison } from './_components/MonthlyComparison';

export default function BudgetsPage() {
  const action = useMemo(
    () => (
      <Button className="bg-[#F97354] hover:bg-[#e86344] text-white flex items-center gap-2">
        <Plus className="w-4 h-4" />새 예산 추가
      </Button>
    ),
    []
  );

  useSetHeader({
    title: '예산 관리',
    description: '카테고리별 예산을 설정하고 지출을 관리하세요',
    action,
  });

  return (
    <>
      <BudgetSummary />
      <BudgetCardsGrid />
      <MonthlyComparison />
    </>
  );
}
