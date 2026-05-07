-- VibeLedger baseline schema, seed data, RLS policies, and RPCs.
-- Apply this in Supabase SQL editor or with the Supabase CLI.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'transaction_type') then
    create type public.transaction_type as enum ('INCOME', 'EXPENSE');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamp default now() not null
);

create table if not exists public.categories (
  id serial primary key,
  name text not null,
  type public.transaction_type default 'EXPENSE' not null,
  icon text,
  color text,
  user_id uuid references public.profiles(id) on delete cascade
);

create table if not exists public.transactions (
  id serial primary key,
  amount integer not null check (amount > 0),
  description text,
  date timestamp default now() not null,
  category_id integer references public.categories(id) on delete set null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp default now() not null
);

create table if not exists public.budgets (
  id serial primary key,
  amount integer not null check (amount > 0),
  month integer not null check (month between 1 and 12),
  year integer not null check (year between 2000 and 2100),
  category_id integer not null references public.categories(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp default now() not null,
  constraint budgets_user_category_month_unique unique (user_id, category_id, month, year)
);

create unique index if not exists categories_default_name_type_unique
  on public.categories (name, type)
  where user_id is null;

create index if not exists transactions_user_date_idx
  on public.transactions (user_id, date desc);

create index if not exists budgets_user_period_idx
  on public.budgets (user_id, year, month);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'name')
  )
  on conflict (id) do update
    set email = excluded.email,
        display_name = coalesce(excluded.display_name, public.profiles.display_name);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.categories (name, type, icon, color, user_id)
values
  ('식비', 'EXPENSE', 'utensils', '#F97354', null),
  ('카페/간식', 'EXPENSE', 'coffee', '#A16207', null),
  ('교통', 'EXPENSE', 'bus', '#2563EB', null),
  ('쇼핑', 'EXPENSE', 'shopping-bag', '#DB2777', null),
  ('주거/통신', 'EXPENSE', 'home', '#475569', null),
  ('의료/건강', 'EXPENSE', 'heart-pulse', '#DC2626', null),
  ('문화/여가', 'EXPENSE', 'ticket', '#7C3AED', null),
  ('교육', 'EXPENSE', 'book-open', '#0891B2', null),
  ('기타', 'EXPENSE', 'circle-ellipsis', '#6B7280', null),
  ('월급', 'INCOME', 'briefcase-business', '#16A34A', null),
  ('용돈', 'INCOME', 'wallet', '#22C55E', null),
  ('투자수익', 'INCOME', 'trending-up', '#0D9488', null),
  ('기타수입', 'INCOME', 'circle-plus', '#65A30D', null)
on conflict do nothing;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "categories_select_defaults_or_own" on public.categories;
create policy "categories_select_defaults_or_own"
  on public.categories for select
  to authenticated
  using (user_id is null or user_id = auth.uid());

drop policy if exists "categories_insert_own" on public.categories;
create policy "categories_insert_own"
  on public.categories for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "categories_update_own" on public.categories;
create policy "categories_update_own"
  on public.categories for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "categories_delete_own" on public.categories;
create policy "categories_delete_own"
  on public.categories for delete
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "transactions_select_own" on public.transactions;
create policy "transactions_select_own"
  on public.transactions for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "transactions_insert_own" on public.transactions;
create policy "transactions_insert_own"
  on public.transactions for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "transactions_update_own" on public.transactions;
create policy "transactions_update_own"
  on public.transactions for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "transactions_delete_own" on public.transactions;
create policy "transactions_delete_own"
  on public.transactions for delete
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "budgets_select_own" on public.budgets;
create policy "budgets_select_own"
  on public.budgets for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "budgets_insert_own" on public.budgets;
create policy "budgets_insert_own"
  on public.budgets for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "budgets_update_own" on public.budgets;
create policy "budgets_update_own"
  on public.budgets for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "budgets_delete_own" on public.budgets;
create policy "budgets_delete_own"
  on public.budgets for delete
  to authenticated
  using (user_id = auth.uid());

create or replace function public.get_budget_with_spending(
  target_month integer,
  target_year integer
)
returns table (
  budget_id integer,
  category_id integer,
  category_name text,
  category_icon text,
  category_color text,
  budget_amount integer,
  spent_amount bigint
)
language sql
stable
security invoker
set search_path = public
as $$
  with period as (
    select
      make_timestamp(target_year, target_month, 1, 0, 0, 0) as start_at,
      (make_timestamp(target_year, target_month, 1, 0, 0, 0) + interval '1 month') as end_at
  ),
  spending as (
    select
      t.category_id,
      coalesce(sum(t.amount), 0)::bigint as spent_amount
    from public.transactions t
    join public.categories c on c.id = t.category_id
    cross join period p
    where t.user_id = auth.uid()
      and c.type = 'EXPENSE'
      and t.date >= p.start_at
      and t.date < p.end_at
    group by t.category_id
  )
  select
    b.id as budget_id,
    c.id as category_id,
    c.name as category_name,
    c.icon as category_icon,
    c.color as category_color,
    b.amount as budget_amount,
    coalesce(s.spent_amount, 0) as spent_amount
  from public.budgets b
  join public.categories c on c.id = b.category_id
  left join spending s on s.category_id = b.category_id
  where b.user_id = auth.uid()
    and b.month = target_month
    and b.year = target_year
  order by c.name;
$$;

create or replace function public.get_monthly_income_expense_trend(
  months_count integer default 12
)
returns table (
  month text,
  income bigint,
  expense bigint
)
language sql
stable
security invoker
set search_path = public
as $$
  with safe_input as (
    select greatest(1, least(coalesce(months_count, 12), 24)) as months_count
  ),
  month_slots as (
    select date_trunc('month', current_date) - (n || ' months')::interval as month_start
    from safe_input, generate_series(months_count - 1, 0, -1) as n
  ),
  tx as (
    select
      date_trunc('month', t.date) as month_start,
      c.type,
      sum(t.amount)::bigint as amount
    from public.transactions t
    join public.categories c on c.id = t.category_id
    where t.user_id = auth.uid()
      and t.date >= (
        select min(month_start) from month_slots
      )
    group by date_trunc('month', t.date), c.type
  )
  select
    to_char(ms.month_start, 'YYYY-MM') as month,
    coalesce(sum(tx.amount) filter (where tx.type = 'INCOME'), 0)::bigint as income,
    coalesce(sum(tx.amount) filter (where tx.type = 'EXPENSE'), 0)::bigint as expense
  from month_slots ms
  left join tx on tx.month_start = ms.month_start
  group by ms.month_start
  order by ms.month_start;
$$;
