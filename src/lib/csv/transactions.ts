import { type Transaction, type TransactionType } from '@/lib/api/transactions';

export interface ParsedCsvTransaction {
  date: string;
  type: TransactionType;
  categoryName: string;
  amount: number;
  description: string | null;
}

const CSV_HEADERS = ['date', 'type', 'category', 'amount', 'description'];

function escapeCsv(value: string): string {
  if (!/[",\n\r]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

export function transactionsToCsv(transactions: Transaction[]): string {
  const rows = transactions.map(tx => [
    tx.date.slice(0, 10),
    tx.categories?.type ?? 'EXPENSE',
    tx.categories?.name ?? '',
    String(tx.amount),
    tx.description ?? '',
  ]);

  return [CSV_HEADERS, ...rows]
    .map(row => row.map(escapeCsv).join(','))
    .join('\n');
}

export function parseTransactionsCsv(csv: string): ParsedCsvTransaction[] {
  const lines = csv
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter(line => line.trim().length > 0);

  const [headerLine, ...dataLines] = lines;
  if (!headerLine) return [];

  const headers = parseCsvLine(headerLine).map(header => header.trim());
  const required = ['date', 'type', 'category', 'amount'];
  if (!required.every(header => headers.includes(header))) {
    throw new Error('CSV 헤더는 date,type,category,amount를 포함해야 합니다.');
  }

  return dataLines.map((line, index) => {
    const values = parseCsvLine(line);
    const record = Object.fromEntries(
      headers.map((header, headerIndex) => [
        header,
        values[headerIndex]?.trim() ?? '',
      ])
    );
    const type = record.type;
    const amount = Number(record.amount);

    if (type !== 'INCOME' && type !== 'EXPENSE') {
      throw new Error(`${index + 2}행의 type 값이 올바르지 않습니다.`);
    }
    if (!record.date || Number.isNaN(Date.parse(record.date))) {
      throw new Error(`${index + 2}행의 날짜가 올바르지 않습니다.`);
    }
    if (!record.category) {
      throw new Error(`${index + 2}행의 카테고리가 비어 있습니다.`);
    }
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error(`${index + 2}행의 금액이 올바르지 않습니다.`);
    }

    return {
      date: new Date(record.date).toISOString(),
      type,
      categoryName: record.category,
      amount,
      description: record.description || null,
    };
  });
}
