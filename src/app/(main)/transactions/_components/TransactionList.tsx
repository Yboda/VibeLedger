import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/common/Spinner';
import { type Transaction } from '@/lib/api/transactions';
import { CategoryIcon } from './CategoryIcon';

export function TransactionList({
  transactions,
  total,
  page,
  pageSize,
  onPageChange,
  loading,
  onEdit,
  onDelete,
}: {
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);

  const groupedTransactions = transactions.reduce(
    (acc, tx) => {
      const date = tx.date.slice(0, 10);
      if (!acc[date]) acc[date] = [];
      acc[date].push(tx);
      return acc;
    },
    {} as Record<string, Transaction[]>
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const formatAmount = (tx: Transaction) => {
    const sign = tx.categories?.type === 'INCOME' ? '+' : '-';
    return `${sign}₩${tx.amount.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-16 text-center text-slate-500">
          거래 내역이 없습니다.
        </div>
      ) : (
        Object.entries(groupedTransactions).map(([date, txs]) => (
          <div key={date}>
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-sm font-medium text-slate-600">
                {formatDate(date)}
              </p>
            </div>
            {txs.map(tx => (
              <div
                key={tx.id}
                className="group px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <CategoryIcon category={tx.categories} />
                  <div>
                    <p className="font-medium text-slate-800">
                      {tx.description ?? tx.categories?.name ?? '미분류'}
                    </p>
                    <p className="text-sm text-slate-500">
                      {tx.categories?.name ?? '미분류'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p
                    className={`font-semibold ${
                      tx.categories?.type === 'INCOME'
                        ? 'text-green-600'
                        : 'text-slate-800'
                    }`}
                  >
                    {formatAmount(tx)}
                  </p>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(tx)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-gray-200 transition-colors"
                      title="수정"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(tx.id)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      {!loading && total > 0 && (
        <div className="px-5 py-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            총 {total}개 거래 중 {(page - 1) * pageSize + 1}-
            {Math.min(page * pageSize, total)} 표시
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              이전
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum =
                  totalPages <= 5
                    ? i + 1
                    : page <= 3
                      ? i + 1
                      : page >= totalPages - 2
                        ? totalPages - 4 + i
                        : page - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-8 h-8 rounded text-sm ${
                      pageNum === page
                        ? 'bg-slate-800 text-white font-medium'
                        : 'hover:bg-gray-100 text-slate-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages || totalPages === 0}
            >
              다음
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
