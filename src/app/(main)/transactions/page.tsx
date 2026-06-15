'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Download, Plus, Upload } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  createTransaction,
  fetchTransactionsForExport,
  findCategoryForImport,
  type Category,
  type Transaction,
  type TransactionType,
} from '@/lib/api/transactions';
import {
  parseTransactionsCsv,
  transactionsToCsv,
} from '@/lib/csv/transactions';
import { useTransactionsQuery } from './_api/useTransactionsQuery';
import { useDeleteTransactionsMutation } from './_api/useDeleteTransactionMutation';
import { useCategoriesQuery } from './_api/useCategoriesQuery';
import { useSetHeader } from '../_providers/header-context';
import { useTransactionModal } from '../_providers/transaction-modal-context';
import { SummaryCards } from './_components/SummaryCards';
import { FilterBar } from './_components/FilterBar';
import { TransactionList } from './_components/TransactionList';
import { CsvImportOverlay } from './_components/CsvImportOverlay';
import { toast } from 'sonner';

export default function TransactionsPage() {
  const [filter, setFilter] = useState<'all' | TransactionType>('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [importState, setImportState] = useState({
    active: false,
    current: 0,
    total: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filterRef = useRef(filter);
  const searchRef = useRef(search);
  const categoriesRef = useRef<Category[]>([]);

  const PAGE_SIZE = 10;

  const { openModal } = useTransactionModal();
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteTransactionsMutation();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategoriesQuery();

  filterRef.current = filter;
  searchRef.current = search;
  categoriesRef.current = categories;

  const handleExport = useCallback(async () => {
    try {
      const exportData = await fetchTransactionsForExport({
        type: filterRef.current,
        search: searchRef.current,
      });
      const csv = transactionsToCsv(exportData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const today = new Date().toISOString().slice(0, 10);
      link.download = `vibe-ledger-거래내역-${today}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`${exportData.length}건의 거래를 내보냈습니다.`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'CSV 내보내기에 실패했습니다.'
      );
    }
  }, []);

  const handleImport = useCallback(
    async (file: File) => {
      try {
        if (categoriesLoading) {
          throw new Error(
            '카테고리를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.'
          );
        }

        if (categoriesRef.current.length === 0) {
          throw new Error(
            '등록된 카테고리가 없습니다. Supabase 마이그레이션(기본 카테고리 seed)을 적용했는지 확인해 주세요.'
          );
        }

        const rows = parseTransactionsCsv(await file.text());
        setImportState({ active: true, current: 0, total: rows.length });

        for (const [index, row] of rows.entries()) {
          const category = findCategoryForImport(
            categoriesRef.current,
            row.categoryName,
            row.type
          );
          if (!category) {
            const available = categoriesRef.current
              .filter(c => c.type === row.type)
              .map(c => c.name)
              .join(', ');
            throw new Error(
              `"${row.categoryName}" 카테고리를 찾을 수 없습니다. (${row.type === 'INCOME' ? '수입' : '지출'} 카테고리: ${available})`
            );
          }

          const result = await createTransaction({
            amount: row.amount,
            description: row.description,
            date: row.date,
            category_id: category.id,
          });
          if (result.error) throw new Error(result.error);

          setImportState({
            active: true,
            current: index + 1,
            total: rows.length,
          });
        }

        await queryClient.invalidateQueries({ queryKey: ['transactions'] });
        await queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });

        toast.success(`${rows.length}건의 거래를 가져왔습니다.`);
      } catch (error) {
        await queryClient.invalidateQueries({ queryKey: ['transactions'] });
        await queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
        toast.error(
          error instanceof Error
            ? error.message
            : 'CSV 가져오기에 실패했습니다.'
        );
      } finally {
        setImportState({ active: false, current: 0, total: 0 });
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    [categoriesLoading, queryClient]
  );

  const action = useMemo(
    () => (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => void handleExport()}
          disabled={importState.active}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          CSV 내보내기
        </Button>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={categoriesLoading || importState.active}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {importState.active ? '가져오는 중...' : 'CSV 가져오기'}
        </Button>
        <Button
          onClick={() => openModal()}
          disabled={importState.active}
          className="flex items-center gap-2 bg-[#F97354] text-white hover:bg-[#e86344]"
        >
          <Plus className="w-4 h-4" />
          거래 추가
        </Button>
      </div>
    ),
    [openModal, handleExport, categoriesLoading, importState.active]
  );

  useSetHeader({
    title: '거래 내역',
    description: '모든 수입과 지출을 한눈에 확인하세요',
    showDate: true,
    action,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: txData, isLoading: loading } = useTransactionsQuery({
    page,
    pageSize: PAGE_SIZE,
    type: filter,
    search,
  });

  const transactions = txData?.data ?? [];
  const total = txData?.total ?? 0;

  const handleFilterChange = (newFilter: 'all' | TransactionType) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handleEdit = (tx: Transaction) => {
    openModal(tx);
  };

  const handleDelete = (id: number) => {
    if (confirm('이 거래를 삭제하시겠습니까?')) {
      deleteMutation.mutate([id], {
        onSuccess: () => toast.success('거래를 삭제했습니다.'),
        onError: error =>
          toast.error(
            error instanceof Error ? error.message : '삭제에 실패했습니다.'
          ),
      });
    }
  };

  const handleDeleteSelected = async (ids: number[]) => {
    if (
      !confirm(
        `선택한 ${ids.length}건의 거래를 삭제하시겠습니까?\n삭제된 거래는 복구할 수 없습니다.`
      )
    ) {
      return false;
    }

    try {
      await deleteMutation.mutateAsync(ids);
      toast.success(`${ids.length}건의 거래를 삭제했습니다.`);
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : '삭제에 실패했습니다.'
      );
      return false;
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        disabled={importState.active}
        onChange={event => {
          const file = event.target.files?.[0];
          if (file) void handleImport(file);
        }}
      />
      <div className="relative">
        {importState.active && (
          <CsvImportOverlay
            current={importState.current}
            total={importState.total}
          />
        )}
        <div
          className={
            importState.active ? 'pointer-events-none select-none' : undefined
          }
          aria-hidden={importState.active}
        >
          <SummaryCards />
          <FilterBar
            filter={filter}
            onFilterChange={handleFilterChange}
            search={searchInput}
            onSearchChange={setSearchInput}
          />
          <TransactionList
            key={page}
            transactions={transactions}
            total={total}
            page={page}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            loading={loading || importState.active}
            isDeleting={deleteMutation.isPending}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDeleteSelected={handleDeleteSelected}
          />
        </div>
      </div>
    </>
  );
}
