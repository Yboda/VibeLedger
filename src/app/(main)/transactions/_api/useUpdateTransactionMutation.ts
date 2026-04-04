import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateTransaction,
  type UpdateTransactionInput,
} from '@/lib/api/transactions';

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
    },
  });
}
