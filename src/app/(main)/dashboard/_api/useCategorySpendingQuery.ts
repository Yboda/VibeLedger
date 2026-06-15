import { useQuery } from '@tanstack/react-query';
import { fetchCategorySpending } from '@/lib/api/transactions';

export function useCategorySpendingQuery() {
  return useQuery({
    queryKey: ['transactions', 'category-spending', 'monthly'],
    queryFn: () => fetchCategorySpending(undefined, undefined, { limit: 5 }),
  });
}
