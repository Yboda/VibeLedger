import { useQuery } from '@tanstack/react-query';
import {
  fetchTransactionsByRange,
  fetchCategorySpending,
  fetchMonthlyTrend,
} from '@/lib/api/transactions';

// 특정 범위 내 원시 거래 데이터 (WeeklyHeatmap, KeyMetrics 공통 사용)
export function useTransactionsByRangeQuery(
  startDate: string,
  endDate: string
) {
  return useQuery({
    queryKey: ['analytics', 'transactions', startDate, endDate],
    queryFn: () => fetchTransactionsByRange(startDate, endDate),
    staleTime: 1000 * 60 * 5,
  });
}

// 카테고리별 지출 (CategoryBreakdown)
export function useCategorySpendingByRangeQuery(
  startDate: string,
  endDate: string
) {
  return useQuery({
    queryKey: ['analytics', 'category-spending', startDate, endDate],
    queryFn: () => fetchCategorySpending(startDate, endDate),
    staleTime: 1000 * 60 * 5,
  });
}

// 월별 트렌드 (SpendingTrendChart — month / year 모드)
export function useMonthlyTrendForAnalyticsQuery(months: number) {
  return useQuery({
    queryKey: ['analytics', 'monthly-trend', months],
    queryFn: () => fetchMonthlyTrend(months),
    staleTime: 1000 * 60 * 5,
  });
}
