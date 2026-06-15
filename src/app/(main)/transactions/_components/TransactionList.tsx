'use client';

import { useMemo, useState } from 'react';
import {
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CrossfadeContent } from '@/components/common/CrossfadeContent';
import { TransactionListSkeleton } from '@/components/common/skeletons';
import { cn } from '@/lib/utils';
import { type Transaction } from '@/lib/api/transactions';
import { CategoryIcon } from './CategoryIcon';

function SelectCheckbox({
  checked,
  indeterminate,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label: string;
  className?: string;
}) {
  return (
    <input
      type="checkbox"
      aria-label={label}
      checked={checked}
      ref={el => {
        if (el) el.indeterminate = Boolean(indeterminate);
      }}
      onChange={onChange}
      onClick={event => event.stopPropagation()}
      className={cn(
        'h-4 w-4 shrink-0 rounded border-slate-300 text-[#F97354] focus:ring-[#F97354]',
        className
      )}
    />
  );
}

export function TransactionList({
  transactions,
  total,
  page,
  pageSize,
  onPageChange,
  loading,
  isDeleting,
  onEdit,
  onDelete,
  onDeleteSelected,
}: {
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  isDeleting?: boolean;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: number) => void;
  onDeleteSelected: (ids: number[]) => boolean | Promise<boolean>;
}) {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const totalPages = Math.ceil(total / pageSize);
  const pageIds = transactions.map(tx => tx.id);
  const visibleIdSet = useMemo(
    () => new Set(transactions.map(tx => tx.id)),
    [transactions]
  );
  const activeSelectedIds = useMemo(
    () => new Set([...selectedIds].filter(id => visibleIdSet.has(id))),
    [selectedIds, visibleIdSet]
  );
  const selectedOnPage = pageIds.filter(id => activeSelectedIds.has(id));
  const allOnPageSelected =
    pageIds.length > 0 && selectedOnPage.length === pageIds.length;
  const someOnPageSelected =
    selectedOnPage.length > 0 && selectedOnPage.length < pageIds.length;

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  };

  const enterSelectionMode = () => {
    setIsSelectionMode(true);
    setSelectedIds(new Set());
  };

  const toggleOne = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllOnPage = () => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        pageIds.forEach(id => next.delete(id));
      } else {
        pageIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(activeSelectedIds);
    if (ids.length === 0) return;

    const deleted = await onDeleteSelected(ids);
    if (deleted) exitSelectionMode();
  };

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
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      {isSelectionMode && !loading && transactions.length > 0 && (
        <div className="flex items-center justify-between border-b border-[#F97354]/20 bg-[#FFF7F5] px-5 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              disabled={isDeleting}
              onClick={exitSelectionMode}
              className="h-8 gap-1.5 px-2 text-slate-600 hover:text-slate-900"
            >
              <X className="h-4 w-4" />
              취소
            </Button>
            <div className="h-4 w-px bg-slate-200" />
            <SelectCheckbox
              checked={allOnPageSelected}
              indeterminate={someOnPageSelected}
              onChange={toggleAllOnPage}
              label="현재 페이지 전체 선택"
            />
            <span className="text-sm font-medium text-slate-700">
              {activeSelectedIds.size > 0
                ? `${activeSelectedIds.size}개 선택됨`
                : '전체 선택'}
            </span>
          </div>
          <Button
            variant="destructive"
            size="sm"
            disabled={isDeleting || activeSelectedIds.size === 0}
            className="flex items-center gap-1.5"
            onClick={() => void handleBulkDelete()}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {isDeleting ? '삭제 중...' : '선택 삭제'}
          </Button>
        </div>
      )}

      <CrossfadeContent
        isLoading={loading}
        skeleton={<TransactionListSkeleton groups={3} />}
        className="min-h-[320px]"
      >
        {transactions.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            거래 내역이 없습니다.
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([date, txs]) => (
            <div key={date}>
              <div className="border-b border-gray-100 bg-gray-50 px-5 py-3">
                <p className="text-sm font-medium text-slate-600">
                  {formatDate(date)}
                </p>
              </div>
              {txs.map(tx => {
                const isSelected = activeSelectedIds.has(tx.id);
                const label = tx.description ?? tx.categories?.name ?? '미분류';

                return (
                  <div
                    key={tx.id}
                    role={isSelectionMode ? 'button' : undefined}
                    tabIndex={isSelectionMode ? 0 : undefined}
                    onClick={
                      isSelectionMode ? () => toggleOne(tx.id) : undefined
                    }
                    onKeyDown={
                      isSelectionMode
                        ? event => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              toggleOne(tx.id);
                            }
                          }
                        : undefined
                    }
                    className={cn(
                      'group flex items-center justify-between border-b border-gray-100 px-5 py-4 transition-colors',
                      isSelectionMode && 'cursor-pointer',
                      isSelected ? 'bg-[#FFF7F5]' : 'hover:bg-gray-50'
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div
                        className={cn(
                          'overflow-hidden transition-all duration-200',
                          isSelectionMode ? 'w-4 opacity-100' : 'w-0 opacity-0'
                        )}
                      >
                        <SelectCheckbox
                          checked={isSelected}
                          onChange={() => toggleOne(tx.id)}
                          label={`${label} 선택`}
                        />
                      </div>
                      <CategoryIcon category={tx.categories} />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-800">
                          {label}
                        </p>
                        <p className="text-sm text-slate-500">
                          {tx.categories?.name ?? '미분류'}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <p
                        className={cn(
                          'font-semibold',
                          tx.categories?.type === 'INCOME'
                            ? 'text-green-600'
                            : 'text-slate-800'
                        )}
                      >
                        {formatAmount(tx)}
                      </p>
                      {!isSelectionMode && (
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => onEdit(tx)}
                            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-gray-200 hover:text-slate-600"
                            title="수정"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(tx.id)}
                            disabled={isDeleting}
                            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                            title="삭제"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </CrossfadeContent>

      {!loading && total > 0 && (
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-500">
              총 {total}개 거래 중 {(page - 1) * pageSize + 1}-
              {Math.min(page * pageSize, total)} 표시
            </p>
            {!isSelectionMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={enterSelectionMode}
                className="h-8 gap-1.5 px-2 text-slate-500 hover:text-slate-800"
              >
                <CheckSquare className="h-3.5 w-3.5" />
                선택
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1 || isSelectionMode}
            >
              <ChevronLeft className="h-4 w-4" />
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
                    disabled={isSelectionMode}
                    className={cn(
                      'h-8 w-8 rounded text-sm',
                      pageNum === page
                        ? 'bg-slate-800 font-medium text-white'
                        : 'text-slate-600 hover:bg-gray-100',
                      isSelectionMode && 'cursor-not-allowed opacity-40'
                    )}
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
              disabled={
                page === totalPages || totalPages === 0 || isSelectionMode
              }
            >
              다음
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
