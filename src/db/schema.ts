import { pgTable, serial, text, integer, decimal, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';

// 사용자 테이블
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatar: text('avatar'), // 프로필 이미지 URL
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 카테고리 테이블
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // 카테고리 이름 (예: 식비, 교통비, 월급)
  type: text('type').notNull(), // 'income' 또는 'expense'
  color: text('color').notNull(), // 카테고리 색상 (hex 코드)
  icon: text('icon'), // 아이콘 이름 또는 이모지
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});

// 거래 내역 테이블
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(), // 금액
  description: text('description').notNull(), // 설명
  date: timestamp('date').notNull(), // 거래 날짜
  categoryId: integer('category_id').notNull().references(() => categories.id, { onDelete: 'restrict' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tags: text('tags'), // 태그 (JSON 배열 형태로 저장)
  imageUrl: text('image_url'), // 영수증 등 이미지 URL
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 예산 테이블
export const budgets = pgTable('budgets', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // 예산 이름
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(), // 예산 금액
  spent: decimal('spent', { precision: 12, scale: 2 }).default('0'), // 사용 금액
  period: text('period').notNull(), // 'monthly', 'weekly', 'yearly'
  categoryId: integer('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  isActive: boolean('is_active').default(true), // 활성화 여부
  startDate: timestamp('start_date').notNull(), // 예산 시작일
  endDate: timestamp('end_date').notNull(), // 예산 종료일
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 목표 테이블 (저축 목표 등)
export const goals = pgTable('goals', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // 목표 이름
  targetAmount: decimal('target_amount', { precision: 12, scale: 2 }).notNull(), // 목표 금액
  currentAmount: decimal('current_amount', { precision: 12, scale: 2 }).default('0'), // 현재 금액
  targetDate: timestamp('target_date'), // 목표 달성일
  description: text('description'), // 목표 설명
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  isCompleted: boolean('is_completed').default(false), // 완료 여부
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 타입 정의
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;
export type Goal = typeof goals.$inferSelect;
export type NewGoal = typeof goals.$inferInsert;
