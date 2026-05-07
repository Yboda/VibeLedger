import { describe, expect, it } from 'vitest';
import { parseTransactionsCsv, transactionsToCsv } from './transactions';
import { type Transaction } from '@/lib/api/transactions';

describe('transaction CSV helpers', () => {
  it('exports transactions with escaped fields', () => {
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
    ]);

    expect(csv).toContain('"커피, 라떼"');
  });

  it('parses valid transaction rows', () => {
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
