import { type Transaction, type TransactionType } from '@/lib/api/transactions';

export interface ParsedCsvTransaction {
  date: string;
  type: TransactionType;
  categoryName: string;
  amount: number;
  description: string | null;
}

export const TRANSACTION_CSV_HEADERS = [
  '날짜',
  '유형',
  '카테고리',
  '금액',
  '내용',
] as const;

type CsvField = 'date' | 'type' | 'category' | 'amount' | 'description';

const HEADER_ALIASES: Record<string, CsvField> = {
  날짜: 'date',
  date: 'date',
  유형: 'type',
  type: 'type',
  카테고리: 'category',
  category: 'category',
  금액: 'amount',
  amount: 'amount',
  내용: 'description',
  description: 'description',
  설명: 'description',
  메모: 'description',
};

const FIELD_LABEL: Record<CsvField, string> = {
  date: '날짜',
  type: '유형',
  category: '카테고리',
  amount: '금액',
  description: '내용',
};

const TYPE_TO_CSV: Record<TransactionType, string> = {
  INCOME: '수입',
  EXPENSE: '지출',
};

function formatCsvType(type: TransactionType): string {
  return TYPE_TO_CSV[type];
}

function parseCsvType(value: string): TransactionType | null {
  const normalized = value.trim();
  if (normalized === '수입' || normalized.toUpperCase() === 'INCOME') {
    return 'INCOME';
  }
  if (normalized === '지출' || normalized.toUpperCase() === 'EXPENSE') {
    return 'EXPENSE';
  }
  return null;
}

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

function normalizeHeaders(headers: string[]): Map<CsvField, number> {
  const indexByField = new Map<CsvField, number>();

  headers.forEach((header, index) => {
    const field = HEADER_ALIASES[header.trim()];
    if (field && !indexByField.has(field)) {
      indexByField.set(field, index);
    }
  });

  return indexByField;
}

function getRequiredFields(indexByField: Map<CsvField, number>): CsvField[] {
  const required: CsvField[] = ['date', 'type', 'category', 'amount'];
  return required.filter(field => !indexByField.has(field));
}

export function transactionsToCsv(transactions: Transaction[]): string {
  const rows = transactions.map(tx => [
    tx.date.slice(0, 10),
    formatCsvType(tx.categories?.type ?? 'EXPENSE'),
    tx.categories?.name ?? '',
    String(tx.amount),
    tx.description ?? '',
  ]);

  const content = [Array.from(TRANSACTION_CSV_HEADERS), ...rows]
    .map(row => row.map(escapeCsv).join(','))
    .join('\n');

  // Excel(Windows)에서 UTF-8 한글을 올바르게 열려면 BOM이 필요합니다.
  return `\uFEFF${content}`;
}

export function parseTransactionsCsv(csv: string): ParsedCsvTransaction[] {
  const lines = csv
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter(line => line.trim().length > 0);

  const [headerLine, ...dataLines] = lines;
  if (!headerLine) return [];

  const headers = parseCsvLine(headerLine).map(header => header.trim());
  const indexByField = normalizeHeaders(headers);
  const missingFields = getRequiredFields(indexByField);

  if (missingFields.length > 0) {
    throw new Error(
      `CSV 헤더에 ${missingFields.map(field => FIELD_LABEL[field]).join(', ')} 열이 필요합니다.`
    );
  }

  return dataLines.map((line, index) => {
    const values = parseCsvLine(line);
    const getValue = (field: CsvField) =>
      values[indexByField.get(field)!]?.trim() ?? '';

    const type = parseCsvType(getValue('type'));
    const amount = Number(getValue('amount'));
    const date = getValue('date');
    const category = getValue('category');
    const description = getValue('description');

    if (!type) {
      throw new Error(
        `${index + 2}행의 유형 값은 '수입' 또는 '지출'이어야 합니다.`
      );
    }
    if (!date || Number.isNaN(Date.parse(date))) {
      throw new Error(`${index + 2}행의 날짜가 올바르지 않습니다.`);
    }
    if (!category) {
      throw new Error(`${index + 2}행의 카테고리가 비어 있습니다.`);
    }
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error(`${index + 2}행의 금액이 올바르지 않습니다.`);
    }

    return {
      date: new Date(date).toISOString(),
      type,
      categoryName: category,
      amount,
      description: description || null,
    };
  });
}
