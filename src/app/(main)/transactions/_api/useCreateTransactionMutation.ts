import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createTransaction,
  type CreateTransactionInput,
} from '@/lib/api/transactions';

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTransactionInput) => createTransaction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
    },
  });
}
