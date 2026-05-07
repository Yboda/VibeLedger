import { describe, expect, it } from 'vitest';
import {
  transactionInputSchema,
  transactionUpdateSchema,
} from '../transaction';

describe('transaction validation', () => {
  it('accepts a valid transaction input', () => {
    const result = transactionInputSchema.safeParse({
      amount: 12000,
      description: '점심',
      date: new Date('2026-05-07').toISOString(),
      category_id: 1,
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid amount and missing category', () => {
    const result = transactionInputSchema.safeParse({
      amount: 0,
      description: null,
      date: '2026-05-07',
      category_id: 0,
    });

    expect(result.success).toBe(false);
  });

  it('allows partial update payloads', () => {
    const result = transactionUpdateSchema.safeParse({
      description: '수정된 메모',
    });

    expect(result.success).toBe(true);
  });
});
