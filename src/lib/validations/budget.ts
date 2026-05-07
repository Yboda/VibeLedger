import { z } from 'zod';

export const budgetRowSchema = z.object({
  category_id: z
    .number()
    .int('카테고리가 올바르지 않습니다.')
    .positive('카테고리를 선택하세요.'),
  amount: z
    .number()
    .int('예산은 정수여야 합니다.')
    .positive('예산은 0보다 커야 합니다.')
    .max(1_000_000_000, '예산 금액이 너무 큽니다.'),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
});

export const budgetRowsSchema = z.array(budgetRowSchema).min(1);

export type ValidBudgetRow = z.infer<typeof budgetRowSchema>;
