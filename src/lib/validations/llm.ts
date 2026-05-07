import { z } from 'zod';
import { transactionTypeSchema } from './transaction';

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: '날짜는 YYYY-MM-DD 형식이어야 합니다.',
});

export const parsedTransactionSchema = z.object({
  amount: z
    .number()
    .int('금액은 정수여야 합니다.')
    .positive('금액은 0보다 커야 합니다.')
    .max(1_000_000_000, '금액이 너무 큽니다.'),
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
