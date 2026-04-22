import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateTransaction,
  type UpdateTransactionInput,
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

function applyUpdate(
  tx: Transaction,
  id: number,
  input: UpdateTransactionInput
): Transaction {
  if (tx.id !== id) return tx;
  return {
    ...tx,
    amount: input.amount ?? tx.amount,
    description:
      input.description !== undefined ? input.description : tx.description,
    date: input.date ?? tx.date,
    // category_id가 바뀌면 categories join은 invalidate 후 서버에서 정확히 갱신됨
    category_id:
      input.category_id !== undefined ? input.category_id : tx.category_id,
  };
}

export function useUpdateTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: UpdateTransactionInput;
    }) => updateTransaction(id, input),

    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] });

      // 목록 쿼리 스냅샷 + 낙관적 업데이트
      const listSnapshots = queryClient.getQueriesData<TransactionListResult>({
        predicate: q => isListQuery(q.queryKey),
      });
      for (const [key, data] of listSnapshots) {
        if (data) {
          queryClient.setQueryData<TransactionListResult>(key, {
            ...data,
            data: data.data.map(tx => applyUpdate(tx, id, input)),
          });
        }
      }

      // 최근 거래 쿼리 스냅샷 + 낙관적 업데이트
      const recentSnapshots = queryClient.getQueriesData<Transaction[]>({
        predicate: q => isRecentQuery(q.queryKey),
      });
      for (const [key, data] of recentSnapshots) {
        if (data) {
          queryClient.setQueryData<Transaction[]>(
            key,
            data.map(tx => applyUpdate(tx, id, input))
          );
        }
      }

      return { listSnapshots, recentSnapshots };
    },

    onError: (_err, _vars, context) => {
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
