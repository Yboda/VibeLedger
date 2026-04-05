import { useQuery } from '@tanstack/react-query';
import { fetchMonthlyTrend } from '@/lib/api/transactions';

export function useMonthlyTrendQuery(months = 6) {
  return useQuery({
    queryKey: ['transactions', 'monthly-trend', months],
    queryFn: () => fetchMonthlyTrend(months),
  });
}
