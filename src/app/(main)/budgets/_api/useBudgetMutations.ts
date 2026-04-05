import { useMutation, useQueryClient } from '@tanstack/react-query';
import { upsertBudgets, deleteBudget, BudgetRow } from '@/lib/api/budgets';

export function useUpsertBudgetsMutation(month: number, year: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rows: BudgetRow[]) => upsertBudgets(rows),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', month, year] });
    },
  });
}

export function useDeleteBudgetMutation(month: number, year: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', month, year] });
    },
  });
}
