import { createClient } from '@/lib/supabase/client';
import {
  budgetRowsSchema,
  type ValidBudgetRow,
} from '@/lib/validations/budget';

export interface BudgetWithSpending {
  budget_id: number;
  category_id: number;
  category_name: string;
  category_icon: string | null;
  category_color: string | null;
  budget_amount: number;
  spent_amount: number;
}

export interface BudgetRow {
  category_id: number;
  amount: number;
  month: number;
  year: number;
}

export interface MonthlyBudgetTotal {
  month: string;
  budget: number;
}

export async function fetchBudgetsWithSpending(
  month: number,
  year: number
): Promise<BudgetWithSpending[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  const { data, error } = await supabase.rpc('get_budget_with_spending', {
    target_month: month,
    target_year: year,
  });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row: Record<string, unknown>) => ({
    budget_id: Number(row.budget_id),
    category_id: Number(row.category_id),
    category_name: row.category_name as string,
    category_icon: (row.category_icon as string) ?? null,
    category_color: (row.category_color as string) ?? null,
    budget_amount: Number(row.budget_amount),
    spent_amount: Number(row.spent_amount),
  }));
}

export async function upsertBudgets(rows: BudgetRow[]): Promise<void> {
  const supabase = createClient();
  const parsed = budgetRowsSchema.safeParse(rows);
  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? '예산 입력값이 올바르지 않습니다.'
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  const { error } = await supabase.from('budgets').upsert(
    parsed.data.map((r: ValidBudgetRow) => ({ ...r, user_id: user.id })),
    { onConflict: 'user_id,category_id,month,year' }
  );
  if (error) throw new Error(error.message);
}

export async function deleteBudget(id: number): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) throw new Error(error.message);
}

export async function fetchMonthlyBudgetTotals(
  months = 6
): Promise<MonthlyBudgetTotal[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  const now = new Date();

  const slots = Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      label: `${d.getMonth() + 1}월`,
      key: `${d.getFullYear()}-${d.getMonth() + 1}`,
    };
  });

  const years = [...new Set(slots.map(s => s.year))];
  const { data, error } = await supabase
    .from('budgets')
    .select('year, month, amount')
    .eq('user_id', user.id)
    .in('year', years);

  if (error) throw new Error(error.message);

  const budgetMap = new Map<string, number>();
  for (const row of data ?? []) {
    const key = `${row.year}-${row.month}`;
    budgetMap.set(key, (budgetMap.get(key) ?? 0) + Number(row.amount));
  }

  return slots.map(slot => ({
    month: slot.label,
    budget: budgetMap.get(slot.key) ?? 0,
  }));
}
