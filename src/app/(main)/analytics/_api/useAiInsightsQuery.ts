import { useCallback, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  generateInsights,
  type FinancialSummary,
  type GenerateInsightsResult,
} from '@/actions/llm';
import {
  readAiInsightsCache,
  writeAiInsightsCache,
} from '@/lib/ai-insights-cache';

export function useAiInsightsQuery(
  fetchKey: string,
  summary: FinancialSummary,
  dataLoading: boolean
) {
  const queryClient = useQueryClient();
  const cached = readAiInsightsCache(fetchKey);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const query = useQuery({
    queryKey: ['ai-insights', fetchKey],
    queryFn: async (): Promise<GenerateInsightsResult> => {
      const result = await generateInsights(summary);
      writeAiInsightsCache(fetchKey, result);
      return result;
    },
    initialData: cached,
    enabled: !dataLoading && cached === undefined,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const result = await generateInsights(summary);
      writeAiInsightsCache(fetchKey, result);
      queryClient.setQueryData(['ai-insights', fetchKey], result);
      return result;
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchKey, queryClient, summary]);

  return {
    insightsResult: query.data,
    aiLoading: query.isFetching || isRefreshing,
    refresh,
  };
}
