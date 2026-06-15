import postgres from 'postgres';

export const DEFAULT_CATEGORIES = [
  ['식비', 'EXPENSE', 'utensils', '#F97354'],
  ['카페/간식', 'EXPENSE', 'coffee', '#A16207'],
  ['교통', 'EXPENSE', 'bus', '#2563EB'],
  ['쇼핑', 'EXPENSE', 'shopping-bag', '#DB2777'],
  ['주거/통신', 'EXPENSE', 'home', '#475569'],
  ['의료/건강', 'EXPENSE', 'heart-pulse', '#DC2626'],
  ['문화/여가', 'EXPENSE', 'ticket', '#7C3AED'],
  ['교육', 'EXPENSE', 'book-open', '#0891B2'],
  ['기타', 'EXPENSE', 'circle-ellipsis', '#6B7280'],
  ['월급', 'INCOME', 'briefcase-business', '#16A34A'],
  ['용돈', 'INCOME', 'wallet', '#22C55E'],
  ['투자수익', 'INCOME', 'trending-up', '#0D9488'],
  ['기타수입', 'INCOME', 'circle-plus', '#65A30D'],
];

export function createPostgresClient(connectionString) {
  return postgres(connectionString, {
    ssl: connectionString.includes('localhost') ? false : 'require',
    max: 1,
  });
}

export async function insertDefaultCategories(sql) {
  for (const [name, type, icon, color] of DEFAULT_CATEGORIES) {
    await sql`
      insert into public.categories (name, type, icon, color, user_id)
      values (${name}, ${type}, ${icon}, ${color}, null)
    `;
  }
}

export async function listDefaultCategories(sql) {
  return sql`
    select name, type
    from public.categories
    where user_id is null
    order by type desc, name
  `;
}
