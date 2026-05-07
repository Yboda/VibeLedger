import { createClient } from '@/lib/supabase/client';
import {
  transactionInputSchema,
  transactionUpdateSchema,
  type ValidTransactionInput,
  type ValidTransactionUpdate,
} from '@/lib/validations/transaction';

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

export interface CategorySpending {
  category_id: number;
  name: string;
  color: string;
  icon: string | null;
  total: number;
}

export interface FetchTransactionsOptions {
  page?: number;
  pageSize?: number;
  type?: 'all' | TransactionType;
  search?: string;
}

async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export interface TransactionListResult {
  data: Transaction[];
  total: number;
  error: string | null;
}

export interface ExportTransactionsOptions {
  type?: 'all' | TransactionType;
  search?: string;
  limit?: number;
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
  const userId = await getCurrentUserId();
  if (!userId) return { data: [], total: 0, error: '로그인이 필요합니다.' };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const joinClause = type !== 'all' ? 'categories!inner(*)' : 'categories(*)';

  let query = supabase
    .from('transactions')
    .select(`*, ${joinClause}`, { count: 'exact' })
    .eq('user_id', userId)
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

export async function fetchTransactionsForExport({
  type = 'all',
  search = '',
  limit = 5000,
}: ExportTransactionsOptions = {}): Promise<Transaction[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('로그인이 필요합니다.');

  const joinClause = type !== 'all' ? 'categories!inner(*)' : 'categories(*)';

  let query = supabase
    .from('transactions')
    .select(`*, ${joinClause}`)
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);

  if (type !== 'all') {
    query = query.eq('categories.type', type);
  }

  if (search.trim()) {
    query = query.ilike('description', `%${search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as unknown as Transaction[]) ?? [];
}

export interface CreateTransactionInput {
  amount: number;
  description: string | null;
  date: string;
  category_id: number;
}

export interface UpdateTransactionInput {
  amount?: number;
  description?: string | null;
  date?: string;
  category_id?: number;
}

export async function fetchCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, type, icon, color')
    .order('type', { ascending: false })
    .order('name');
  if (error) throw new Error(error.message);
  return (data as Category[]) ?? [];
}

export async function createTransaction(
  input: CreateTransactionInput
): Promise<{ data: Transaction | null; error: string | null }> {
  const supabase = createClient();
  const parsed = transactionInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      data: null,
      error: parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다.',
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: null, error: '로그인이 필요합니다.' };

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      ...(parsed.data satisfies ValidTransactionInput),
      user_id: user.id,
    })
    .select('*, categories(*)')
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as unknown as Transaction, error: null };
}

export async function updateTransaction(
  id: number,
  input: UpdateTransactionInput
): Promise<{ data: Transaction | null; error: string | null }> {
  const supabase = createClient();
  const parsed = transactionUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      data: null,
      error: parsed.error.issues[0]?.message ?? '입력값이 올바르지 않습니다.',
    };
  }

  const userId = await getCurrentUserId();
  if (!userId) return { data: null, error: '로그인이 필요합니다.' };

  const { data, error } = await supabase
    .from('transactions')
    .update(parsed.data satisfies ValidTransactionUpdate)
    .eq('id', id)
    .eq('user_id', userId)
    .select('*, categories(*)')
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as unknown as Transaction, error: null };
}

export async function deleteTransaction(
  id: number
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  if (!userId) return { error: '로그인이 필요합니다.' };

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) return { error: error.message };
  return { error: null };
}

export async function fetchRecentTransactions(
  limit = 5
): Promise<Transaction[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('로그인이 필요합니다.');

  const { data, error } = await supabase
    .from('transactions')
    .select('*, categories(*)')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data as unknown as Transaction[]) ?? [];
}

export async function fetchCategorySpending(
  startDate?: string,
  endDate?: string
): Promise<CategorySpending[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('로그인이 필요합니다.');

  const now = new Date();
  const from =
    startDate ?? new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const to =
    endDate ??
    new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    ).toISOString();

  const { data, error } = await supabase
    .from('transactions')
    .select('amount, categories(id, name, color, icon, type)')
    .eq('user_id', userId)
    .gte('date', from)
    .lte('date', to);

  if (error) throw new Error(error.message);

  const map = new Map<number, CategorySpending>();
  for (const tx of data ?? []) {
    const cat = tx.categories as unknown as {
      id: number;
      name: string;
      color: string;
      icon: string | null;
      type: string;
    } | null;
    if (!cat || cat.type !== 'EXPENSE') continue;
    const existing = map.get(cat.id);
    if (existing) {
      existing.total += tx.amount;
    } else {
      map.set(cat.id, {
        category_id: cat.id,
        name: cat.name,
        color: cat.color ?? '#6B7280',
        icon: cat.icon,
        total: tx.amount,
      });
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
}

// 특정 날짜 범위 내 거래 전체 조회 (Analytics 집계용)
export interface RawTransaction {
  id: number;
  amount: number;
  date: string;
  description: string | null;
  categories: {
    id: number;
    name: string;
    type: TransactionType;
    color: string | null;
    icon: string | null;
  } | null;
}

export async function fetchTransactionsByRange(
  startDate: string,
  endDate: string
): Promise<RawTransaction[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('로그인이 필요합니다.');

  const { data, error } = await supabase
    .from('transactions')
    .select(
      'id, amount, date, description, categories(id, name, type, color, icon)'
    )
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });
  if (error) throw new Error(error.message);
  return (data as unknown as RawTransaction[]) ?? [];
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
}

export async function fetchMonthlyTrend(months = 12): Promise<MonthlyTrend[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc(
    'get_monthly_income_expense_trend',
    { months_count: months }
  );
  if (error) throw new Error(error.message);

  // RPC 결과를 YYYY-MM 키로 맵핑
  const rpcMap = new Map<string, { income: number; expense: number }>();
  for (const row of data ?? []) {
    rpcMap.set(row.month as string, {
      income: Number(row.income) || 0,
      expense: Number(row.expense) || 0,
    });
  }

  // 현재 달 기준 최근 N개월 슬롯 생성 (빈 달 → 0)
  const now = new Date();
  const result: MonthlyTrend[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = `${d.getMonth() + 1}월`;
    const found = rpcMap.get(key);
    result.push({
      month: label,
      income: found?.income ?? 0,
      expense: found?.expense ?? 0,
    });
  }
  return result;
}

export async function fetchMonthlyTransactionSummary(): Promise<MonthlyTransactionSummary> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      totalIncome: 0,
      totalExpense: 0,
      netBalance: 0,
      error: '로그인이 필요합니다.',
    };
  }

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
    .eq('user_id', userId)
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
