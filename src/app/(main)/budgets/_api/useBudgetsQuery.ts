import { useQuery } from '@tanstack/react-query';
import { fetchBudgetsWithSpending } from '@/lib/api/budgets';

export function useBudgetsQuery(month: number, year: number) {
  return useQuery({
    queryKey: ['budgets', month, year],
    queryFn: () => fetchBudgetsWithSpending(month, year),
  });
}
