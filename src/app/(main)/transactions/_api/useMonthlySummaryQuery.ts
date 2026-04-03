import { useQuery } from '@tanstack/react-query';
import { fetchMonthlyTransactionSummary } from '@/lib/api/transactions';

export function useMonthlySummaryQuery() {
  return useQuery({
    queryKey: ['monthly-summary'],
    queryFn: fetchMonthlyTransactionSummary,
  });
}
