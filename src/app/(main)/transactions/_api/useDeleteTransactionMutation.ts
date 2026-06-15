import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteTransactions,
  type Transaction,
  type TransactionListResult,
} from '@/lib/api/transactions';

function isListQuery(queryKey: readonly unknown[]): boolean {
  return (
    queryKey[0] === 'transactions' &&
    typeof queryKey[1] === 'object' &&
    queryKey[1] !== null &&
    !Array.isArray(queryKey[1])
  );
}

function isRecentQuery(queryKey: readonly unknown[]): boolean {
  return queryKey[0] === 'transactions' && queryKey[1] === 'recent';
}

export function useDeleteTransactionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const result = await deleteTransactions(ids);
      if (result.error) throw new Error(result.error);
    },

    onMutate: async ids => {
      const idSet = new Set(ids);

      await queryClient.cancelQueries({ queryKey: ['transactions'] });

      const listSnapshots = queryClient.getQueriesData<TransactionListResult>({
        predicate: q => isListQuery(q.queryKey),
      });
      for (const [key, data] of listSnapshots) {
        if (data) {
          const removedCount = data.data.filter(tx => idSet.has(tx.id)).length;
          queryClient.setQueryData<TransactionListResult>(key, {
            ...data,
            data: data.data.filter(tx => !idSet.has(tx.id)),
            total: Math.max(0, data.total - removedCount),
          });
        }
      }

      const recentSnapshots = queryClient.getQueriesData<Transaction[]>({
        predicate: q => isRecentQuery(q.queryKey),
      });
      for (const [key, data] of recentSnapshots) {
        if (data) {
          queryClient.setQueryData<Transaction[]>(
            key,
            data.filter(tx => !idSet.has(tx.id))
          );
        }
      }

      return { listSnapshots, recentSnapshots };
    },

    onError: (_err, _ids, context) => {
      for (const [key, data] of context?.listSnapshots ?? []) {
        queryClient.setQueryData(key, data);
      }
      for (const [key, data] of context?.recentSnapshots ?? []) {
        queryClient.setQueryData(key, data);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
    },
  });
}

/** @deprecated use useDeleteTransactionsMutation */
export const useDeleteTransactionMutation = useDeleteTransactionsMutation;
