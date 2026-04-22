import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createTransaction,
  type CreateTransactionInput,
  type Transaction,
  type TransactionListResult,
} from '@/lib/api/transactions';
import { toast } from 'sonner';

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

// 서버 응답 전 임시 ID (음수로 실제 ID와 충돌 방지)
let tempIdCounter = -1;

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTransactionInput) => createTransaction(input),

    onMutate: async input => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] });

      // 낙관적으로 사용할 임시 거래 객체 생성
      const tempId = tempIdCounter--;
      const tempTx: Transaction = {
        id: tempId,
        amount: input.amount,
        description: input.description,
        date: input.date,
        category_id: input.category_id,
        user_id: '',
        created_at: new Date().toISOString(),
        categories: null,
      };

      // 목록 쿼리: 총 개수만 +1 (정확한 삽입 위치를 알 수 없으므로 settled 후 갱신)
      const listSnapshots = queryClient.getQueriesData<TransactionListResult>({
        predicate: q => isListQuery(q.queryKey),
      });
      for (const [key, data] of listSnapshots) {
        if (data) {
          queryClient.setQueryData<TransactionListResult>(key, {
            ...data,
            total: data.total + 1,
          });
        }
      }

      // 최근 거래 쿼리: 맨 앞에 추가 (최신순 기준)
      const recentSnapshots = queryClient.getQueriesData<Transaction[]>({
        predicate: q => isRecentQuery(q.queryKey),
      });
      for (const [key, data] of recentSnapshots) {
        if (data) {
          const limit = typeof key[2] === 'number' ? key[2] : 5;
          queryClient.setQueryData<Transaction[]>(
            key,
            [tempTx, ...data].slice(0, limit)
          );
        }
      }

      return { listSnapshots, recentSnapshots, tempId };
    },

    onError: (_err, _input, context) => {
      // 롤백
      for (const [key, data] of context?.listSnapshots ?? []) {
        queryClient.setQueryData(key, data);
      }
      for (const [key, data] of context?.recentSnapshots ?? []) {
        queryClient.setQueryData(key, data);
      }
      toast.error('거래 추가에 실패했습니다. 다시 시도해주세요.');
    },

    onSettled: () => {
      // 서버 최신 데이터로 동기화
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
    },
  });
}
