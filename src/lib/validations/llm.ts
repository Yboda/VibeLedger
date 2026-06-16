import { z } from 'zod';
import { transactionTypeSchema } from './transaction';

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: '날짜는 YYYY-MM-DD 형식이어야 합니다.',
});

/** LLM이 금액 없이 날짜·장소만 반환할 수 있음 (0/null은 미입력으로 처리) */
const llmAmountSchema = z.preprocess((val: unknown) => {
  if (val == null || val === '') return undefined;
  const n = Number(val);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return Math.floor(n);
}, z.number().int('금액은 정수여야 합니다.').positive('금액은 0보다 커야 합니다.').max(1_000_000_000, '금액이 너무 큽니다.').optional());

export const parsedTransactionSchema = z.object({
  amount: llmAmountSchema,
  date: isoDateSchema,
  description: z.string().trim().max(100).default(''),
  categoryName: z.string().trim().min(1),
  type: transactionTypeSchema,
});

export const insightItemSchema = z.object({
  type: z.enum(['positive', 'warning', 'info']),
  title: z.string().trim().min(1).max(30),
  description: z.string().trim().min(1).max(160),
});

export const insightItemsSchema = z.array(insightItemSchema).min(1).max(3);
