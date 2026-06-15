import { describe, expect, it } from 'vitest';
import { parseTransactionsCsv, transactionsToCsv } from './transactions';
import { type Transaction } from '@/lib/api/transactions';

describe('transaction CSV helpers', () => {
  it('exports transactions with Korean headers, type labels, and escaped fields', () => {
    const csv = transactionsToCsv([
      {
        id: 1,
        amount: 4500,
        description: '커피, 라떼',
        date: '2026-05-07T00:00:00.000Z',
        created_at: '2026-05-07T00:00:00.000Z',
        category_id: 1,
        user_id: 'user-1',
        categories: {
          id: 1,
          name: '카페/간식',
          type: 'EXPENSE',
          icon: null,
          color: null,
        },
      } satisfies Transaction,
      {
        id: 2,
        amount: 3000000,
        description: '월급',
        date: '2026-05-01T00:00:00.000Z',
        created_at: '2026-05-01T00:00:00.000Z',
        category_id: 2,
        user_id: 'user-1',
        categories: {
          id: 2,
          name: '급여',
          type: 'INCOME',
          icon: null,
          color: null,
        },
      } satisfies Transaction,
    ]);

    expect(csv).toContain('\uFEFF');
    expect(csv.startsWith('\uFEFF날짜,유형,카테고리,금액,내용')).toBe(true);
    expect(csv).toContain('"커피, 라떼"');
    expect(csv).toContain(',지출,');
    expect(csv).toContain(',수입,');
    expect(csv).not.toContain(',EXPENSE,');
    expect(csv).not.toContain(',INCOME,');
  });

  it('parses rows with Korean headers and type labels', () => {
    const rows = parseTransactionsCsv(
      '날짜,유형,카테고리,금액,내용\n2026-05-07,지출,식비,12000,점심\n2026-05-01,수입,급여,3000000,월급'
    );

    expect(rows).toEqual([
      {
        date: '2026-05-07T00:00:00.000Z',
        type: 'EXPENSE',
        categoryName: '식비',
        amount: 12000,
        description: '점심',
      },
      {
        date: '2026-05-01T00:00:00.000Z',
        type: 'INCOME',
        categoryName: '급여',
        amount: 3000000,
        description: '월급',
      },
    ]);
  });

  it('still parses legacy English headers and type labels', () => {
    const rows = parseTransactionsCsv(
      'date,type,category,amount,description\n2026-05-07,EXPENSE,식비,12000,점심'
    );

    expect(rows).toEqual([
      {
        date: '2026-05-07T00:00:00.000Z',
        type: 'EXPENSE',
        categoryName: '식비',
        amount: 12000,
        description: '점심',
      },
    ]);
  });
});
