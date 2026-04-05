'use client';

import { useMemo, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSetHeader } from '../_providers/header-context';
import { BudgetSummary } from './_components/BudgetSummary';
import { BudgetCardsGrid } from './_components/BudgetCardsGrid';
import { MonthlyComparison } from './_components/MonthlyComparison';
import { BudgetModal } from './_components/BudgetModal';
import { useBudgetsQuery } from './_api/useBudgetsQuery';
import { useUpsertBudgetsMutation } from './_api/useBudgetMutations';
import { BudgetRow } from '@/lib/api/budgets';

export default function BudgetsPage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const openModal = useCallback(() => {
    setModalKey(k => k + 1);
    setIsModalOpen(true);
  }, []);

  const { data: budgets = [] } = useBudgetsQuery(month, year);
  const { mutate: upsertBudgets, isPending } = useUpsertBudgetsMutation(
    month,
    year
  );

  const handleSave = useCallback(
    (rows: BudgetRow[]) => {
      upsertBudgets(rows, { onSuccess: () => setIsModalOpen(false) });
    },
    [upsertBudgets]
  );

  const action = useMemo(
    () => (
      <Button
        className="bg-[#F97354] hover:bg-[#e86344] text-white flex items-center gap-2"
        onClick={openModal}
      >
        <Plus className="w-4 h-4" />
        예산 설정
      </Button>
    ),
    [openModal]
  );

  useSetHeader({
    title: '예산 관리',
    description: '카테고리별 예산을 설정하고 지출을 관리하세요',
    action,
  });

  return (
    <>
      <BudgetSummary month={month} year={year} />
      <BudgetCardsGrid month={month} year={year} onEdit={openModal} />
      <MonthlyComparison />

      <BudgetModal
        key={modalKey}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        month={month}
        year={year}
        existingBudgets={budgets}
        onSave={handleSave}
        isSaving={isPending}
      />
    </>
  );
}
