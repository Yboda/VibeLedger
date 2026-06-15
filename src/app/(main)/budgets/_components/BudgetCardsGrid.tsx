'use client';

import { BudgetCardsGridSkeleton } from '@/components/common/skeletons';
import { useBudgetsQuery } from '../_api/useBudgetsQuery';
import { useDeleteBudgetMutation } from '../_api/useBudgetMutations';
import { BudgetCard } from './BudgetCard';

const FALLBACK_COLORS = ['#F97354', '#3B82F6', '#F59E0B', '#10B981', '#8B5CF6'];

export function BudgetCardsGrid({
  month,
  year,
  onEdit,
}: {
  month: number;
  year: number;
  onEdit: () => void;
}) {
  const { data = [], isLoading } = useBudgetsQuery(month, year);
  const { mutate: deleteBudget } = useDeleteBudgetMutation(month, year);

  if (isLoading) {
    return <BudgetCardsGridSkeleton cards={4} />;
  }

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((budget, idx) => (
        <BudgetCard
          key={budget.budget_id}
          budget={budget}
          colorFallback={
            FALLBACK_COLORS[idx % FALLBACK_COLORS.length] ?? '#F97354'
          }
          onEdit={onEdit}
          onDelete={() => deleteBudget(budget.budget_id)}
        />
      ))}
    </div>
  );
}
