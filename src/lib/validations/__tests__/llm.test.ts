import { describe, expect, it } from 'vitest';
import { insightItemsSchema, parsedTransactionSchema } from '../llm';

describe('llm validation', () => {
  it('accepts a strict parsed transaction JSON shape', () => {
    const result = parsedTransactionSchema.safeParse({
      amount: 4500,
      date: '2026-05-07',
      description: '아메리카노',
      categoryName: '카페/간식',
      type: 'EXPENSE',
    });

    expect(result.success).toBe(true);
  });

  it('rejects malformed parsed transaction output', () => {
    const result = parsedTransactionSchema.safeParse({
      amount: -1,
      date: 'tomorrow',
      description: 'bad output',
      categoryName: '',
      type: 'SPEND',
    });

    expect(result.success).toBe(false);
  });

  it('limits insight output to three validated items', () => {
    const result = insightItemsSchema.safeParse([
      {
        type: 'positive',
        title: '좋아요',
        description: '저축률이 안정적이에요.',
      },
      {
        type: 'warning',
        title: '주의',
        description: '식비가 예산에 가까워요.',
      },
      { type: 'info', title: '팁', description: '주말 지출을 점검해보세요.' },
    ]);

    expect(result.success).toBe(true);
  });
});
