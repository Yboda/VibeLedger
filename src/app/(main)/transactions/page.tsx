'use client';

import { useState, useEffect, useRef } from 'react';
import { Download, Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  fetchTransactionsForExport,
  type Category,
  type Transaction,
  type TransactionType,
} from '@/lib/api/transactions';
import {
  parseTransactionsCsv,
  transactionsToCsv,
} from '@/lib/csv/transactions';
import { useTransactionsQuery } from './_api/useTransactionsQuery';
import { useDeleteTransactionMutation } from './_api/useDeleteTransactionMutation';
import { useCreateTransactionMutation } from './_api/useCreateTransactionMutation';
import { useCategoriesQuery } from './_api/useCategoriesQuery';
import { useSetHeader } from '../_providers/header-context';
import { useTransactionModal } from '../_providers/transaction-modal-context';
import { SummaryCards } from './_components/SummaryCards';
import { FilterBar } from './_components/FilterBar';
import { TransactionList } from './_components/TransactionList';
import { toast } from 'sonner';

export default function TransactionsPage() {
  const [filter, setFilter] = useState<'all' | TransactionType>('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filterRef = useRef(filter);
  const searchRef = useRef(search);
  const categoriesRef = useRef<Category[]>([]);

  const PAGE_SIZE = 10;

  const { openModal } = useTransactionModal();
  const deleteMutation = useDeleteTransactionMutation();
  const createMutation = useCreateTransactionMutation();
  const { data: categories = [] } = useCategoriesQuery();

  filterRef.current = filter;
  searchRef.current = search;
  categoriesRef.current = categories;

  const handleExport = async () => {
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
      link.download = `vibe-ledger-transactions-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`${exportData.length}건의 거래를 내보냈습니다.`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'CSV 내보내기에 실패했습니다.'
      );
    }
  };

  const handleImport = async (file: File) => {
    try {
      const rows = parseTransactionsCsv(await file.text());

      for (const row of rows) {
        const category = categoriesRef.current.find(
          c => c.name === row.categoryName && c.type === row.type
        );
        if (!category) {
          throw new Error(`"${row.categoryName}" 카테고리를 찾을 수 없습니다.`);
        }

        const result = await createMutation.mutateAsync({
          amount: row.amount,
          description: row.description,
          date: row.date,
          category_id: category.id,
        });
        if (result.error) throw new Error(result.error);
      }

      toast.success(`${rows.length}건의 거래를 가져왔습니다.`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'CSV 가져오기에 실패했습니다.'
      );
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const action = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={() => void handleExport()}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        CSV 내보내기
      </Button>
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        CSV 가져오기
      </Button>
      <Button
        onClick={() => openModal()}
        className="bg-[#F97354] hover:bg-[#e86344] text-white flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        거래 추가
      </Button>
    </div>
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
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={event => {
          const file = event.target.files?.[0];
          if (file) void handleImport(file);
        }}
      />
      <SummaryCards />
      <FilterBar
        filter={filter}
        onFilterChange={handleFilterChange}
        search={searchInput}
        onSearchChange={setSearchInput}
      />
      <TransactionList
        transactions={transactions}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  );
}
