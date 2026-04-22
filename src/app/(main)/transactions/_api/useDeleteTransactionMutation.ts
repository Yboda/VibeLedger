import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteTransaction,
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

export function useDeleteTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTransaction(id),

    onMutate: async id => {
      // 진행 중인 refetch가 낙관적 업데이트를 덮어쓰지 않도록 취소
      await queryClient.cancelQueries({ queryKey: ['transactions'] });

      // 목록 쿼리 스냅샷 저장 + 낙관적 제거
      const listSnapshots = queryClient.getQueriesData<TransactionListResult>({
        predicate: q => isListQuery(q.queryKey),
      });
      for (const [key, data] of listSnapshots) {
        if (data) {
          queryClient.setQueryData<TransactionListResult>(key, {
            ...data,
            data: data.data.filter(tx => tx.id !== id),
            total: Math.max(0, data.total - 1),
          });
        }
      }

      // 최근 거래 쿼리 스냅샷 저장 + 낙관적 제거
      const recentSnapshots = queryClient.getQueriesData<Transaction[]>({
        predicate: q => isRecentQuery(q.queryKey),
      });
      for (const [key, data] of recentSnapshots) {
        if (data) {
          queryClient.setQueryData<Transaction[]>(
            key,
            data.filter(tx => tx.id !== id)
          );
        }
      }

      return { listSnapshots, recentSnapshots };
    },

    onError: (_err, _id, context) => {
      // 에러 시 스냅샷으로 롤백
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
