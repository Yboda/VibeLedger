import { createClient } from '@/lib/supabase/client';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  icon: string | null;
  color: string | null;
}

export interface Transaction {
  id: number;
  amount: number;
  description: string | null;
  date: string;
  created_at: string;
  category_id: number | null;
  user_id: string;
  categories: Category | null;
}

export interface FetchTransactionsOptions {
  page?: number;
  pageSize?: number;
  type?: 'all' | TransactionType;
  search?: string;
}

export interface TransactionListResult {
  data: Transaction[];
  total: number;
  error: string | null;
}

export interface MonthlyTransactionSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  error: string | null;
}

export async function fetchTransactions({
  page = 1,
  pageSize = 10,
  type = 'all',
  search = '',
}: FetchTransactionsOptions = {}): Promise<TransactionListResult> {
  const supabase = createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const joinClause = type !== 'all' ? 'categories!inner(*)' : 'categories(*)';

  let query = supabase
    .from('transactions')
    .select(`*, ${joinClause}`, { count: 'exact' })
    .order('date', { ascending: false })
    .range(from, to);

  if (type !== 'all') {
    query = query.eq('categories.type', type);
  }

  if (search.trim()) {
    query = query.ilike('description', `%${search.trim()}%`);
  }

  const { data, error, count } = await query;

  if (error) return { data: [], total: 0, error: error.message };
  return {
    data: (data as unknown as Transaction[]) ?? [],
    total: count ?? 0,
    error: null,
  };
}

export async function fetchMonthlyTransactionSummary(): Promise<MonthlyTransactionSummary> {
  const supabase = createClient();

  const now = new Date();
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toISOString();
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  ).toISOString();

  const { data, error } = await supabase
    .from('transactions')
    .select('amount, categories(type)')
    .gte('date', startOfMonth)
    .lte('date', endOfMonth);

  if (error) {
    return {
      totalIncome: 0,
      totalExpense: 0,
      netBalance: 0,
      error: error.message,
    };
  }

  let totalIncome = 0;
  let totalExpense = 0;

  for (const tx of data ?? []) {
    const catType = (
      tx.categories as unknown as { type: TransactionType } | null
    )?.type;
    if (catType === 'INCOME') totalIncome += tx.amount;
    else if (catType === 'EXPENSE') totalExpense += tx.amount;
  }

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    error: null,
  };
}
