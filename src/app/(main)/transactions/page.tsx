'use client';

import { useState, useEffect } from 'react';
import { type TransactionType } from '@/lib/api/transactions';
import { useTransactionsQuery } from './_api/useTransactionsQuery';
import { useSetHeader } from '../_providers/header-context';
import { SummaryCards } from './_components/SummaryCards';
import { FilterBar } from './_components/FilterBar';
import { TransactionList } from './_components/TransactionList';

export default function TransactionsPage() {
  const [filter, setFilter] = useState<'all' | TransactionType>('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;

  useSetHeader({
    title: '거래 내역',
    description: '모든 수입과 지출을 한눈에 확인하세요',
    showDate: true,
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

  return (
    <>
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
      />
    </>
  );
}
