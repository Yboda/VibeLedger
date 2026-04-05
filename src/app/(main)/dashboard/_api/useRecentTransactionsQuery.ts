import { useQuery } from '@tanstack/react-query';
import { fetchRecentTransactions } from '@/lib/api/transactions';

export function useRecentTransactionsQuery(limit = 5) {
  return useQuery({
    queryKey: ['transactions', 'recent', limit],
    queryFn: () => fetchRecentTransactions(limit),
  });
}
