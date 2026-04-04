import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTransaction } from '@/lib/api/transactions';

export function useDeleteTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
    },
  });
}
