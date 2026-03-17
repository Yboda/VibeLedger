import { pgTable, serial, text, integer, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core';

// 거래 유형 정의 (지출/수입)
export const transactionTypeEnum = pgEnum('transaction_type', ['INCOME', 'EXPENSE']);

// 1. 유저 프로필 (Supabase Auth ID와 연동)
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // Supabase의 auth.users.id를 그대로 사용
  email: text('email').notNull(),
  displayName: text('display_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. 카테고리 (지출/수입 항목 분류)
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: transactionTypeEnum('type').default('EXPENSE').notNull(),
  icon: text('icon'), // UI에서 보여줄 아이콘 이름 (Lucide-react 등)
  color: text('color'), // 차트에서 사용할 색상 코드 (예: #FF5733)
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
});

// 3. 거래 내역 (가장 중요한 테이블)
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  amount: integer('amount').notNull(), // 금액 (정수형으로 저장하여 부동소수점 오차 방지)
  description: text('description'), // 메모/상세 내용
  date: timestamp('date').defaultNow().notNull(), // 지출 발생 일자 (일별/월별 집계의 기준)
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. 예산 설정 (차트에서 예산 대비 지출 확인용)
export const budgets = pgTable('budgets', {
  id: serial('id').primaryKey(),
  amount: integer('amount').notNull(),
  month: integer('month').notNull(), // 1 ~ 12
  year: integer('year').notNull(),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
});