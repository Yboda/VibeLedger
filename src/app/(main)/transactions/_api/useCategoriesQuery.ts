import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/lib/api/transactions';

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: Infinity,
  });
}
