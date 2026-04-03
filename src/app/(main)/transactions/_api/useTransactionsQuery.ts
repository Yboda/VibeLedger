import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  fetchTransactions,
  type FetchTransactionsOptions,
} from '@/lib/api/transactions';

export function useTransactionsQuery(options: FetchTransactionsOptions) {
  return useQuery({
    queryKey: ['transactions', options],
    queryFn: () => fetchTransactions(options),
    placeholderData: keepPreviousData,
  });
}
