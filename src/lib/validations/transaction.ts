import { z } from 'zod';

export const transactionTypeSchema = z.enum(['INCOME', 'EXPENSE']);

export const transactionInputSchema = z.object({
  amount: z
    .number()
    .int('금액은 정수여야 합니다.')
    .positive('금액은 0보다 커야 합니다.')
    .max(1_000_000_000, '금액이 너무 큽니다.'),
  description: z
    .string()
    .trim()
    .max(100, '메모는 100자 이하여야 합니다.')
    .nullable(),
  date: z
    .string()
    .refine(
      value => !Number.isNaN(Date.parse(value)),
      '유효한 날짜가 아닙니다.'
    ),
  category_id: z
    .number()
    .int('카테고리가 올바르지 않습니다.')
    .positive('카테고리를 선택하세요.'),
});

export const transactionUpdateSchema = transactionInputSchema.partial();

export type ValidTransactionInput = z.infer<typeof transactionInputSchema>;
export type ValidTransactionUpdate = z.infer<typeof transactionUpdateSchema>;
