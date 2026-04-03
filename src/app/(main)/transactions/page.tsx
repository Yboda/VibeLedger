'use client';

import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Home,
  Utensils,
  ShoppingBag,
  Car,
  Smartphone,
  Coffee,
  Film,
  Dumbbell,
  Gift,
  Plane,
  Wallet,
  CreditCard,
  Briefcase,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState, useEffect, type ElementType } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/common/Spinner';
import { type Transaction, type TransactionType } from '@/lib/api/transactions';
import { useMonthlySummaryQuery } from './_api/useMonthlySummaryQuery';
import { useTransactionsQuery } from './_api/useTransactionsQuery';

const ICON_MAP: Record<string, ElementType> = {
  Utensils,
  Home,
  ShoppingBag,
  Car,
  Smartphone,
  Coffee,
  Film,
  Dumbbell,
  Gift,
  Plane,
  Wallet,
  CreditCard,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
};

// Header
function Header() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">거래 내역</h1>
        <p className="text-slate-500 text-sm">
          모든 수입과 지출을 한눈에 확인하세요
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">
          {new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </span>
      </div>
    </div>
  );
}

// Summary Cards
function SummaryCards() {
  const { data, isLoading: loading } = useMonthlySummaryQuery();

  const summary = data ?? { totalIncome: 0, totalExpense: 0, netBalance: 0 };

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm">이번 달 수입</p>
            {loading ? (
              <Spinner className="mt-2" />
            ) : (
              <p className="text-2xl font-bold text-slate-800">
                +₩{summary.totalIncome.toLocaleString()}
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <ArrowDownRight className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm">이번 달 지출</p>
            {loading ? (
              <Spinner className="mt-2" />
            ) : (
              <p className="text-2xl font-bold text-slate-800">
                -₩{summary.totalExpense.toLocaleString()}
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-[#F97354] rounded-xl p-5 shadow-sm text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">순 잔액</p>
            {loading ? (
              <Spinner className="mt-2 text-white" />
            ) : (
              <p className="text-2xl font-bold">
                {summary.netBalance >= 0 ? '+' : ''}₩
                {summary.netBalance.toLocaleString()}
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowDownRight className="w-6 h-6 text-white" />
          </div>
        </div>
        <p className="text-xs text-white/80 mt-2">수입 - 지출</p>
      </div>
    </div>
  );
}

// Filter Bar
function FilterBar({
  filter,
  onFilterChange,
  search,
  onSearchChange,
}: {
  filter: 'all' | TransactionType;
  onFilterChange: (filter: 'all' | TransactionType) => void;
  search: string;
  onSearchChange: (search: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => onFilterChange('INCOME')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'INCOME'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
            }`}
          >
            수입
          </button>
          <button
            onClick={() => onFilterChange('EXPENSE')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'EXPENSE'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
            }`}
          >
            지출
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="거래 내역 검색..."
              className="pl-9 w-64 bg-gray-50 border-gray-200"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            필터
          </Button>
        </div>
      </div>
    </div>
  );
}

// Category Icon Component
function CategoryIcon({ category }: { category: Transaction['categories'] }) {
  const Icon =
    (category?.icon ? ICON_MAP[category.icon] : null) ?? MoreHorizontal;
  const bg = category?.color ?? '#6B7280';

  return (
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center"
      style={{ backgroundColor: bg }}
    >
      <Icon className="w-5 h-5 text-white" />
    </div>
  );
}

// Transaction List
function TransactionList({
  transactions,
  total,
  page,
  pageSize,
  onPageChange,
  loading,
}: {
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading: boolean;
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
                className="px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <CategoryIcon category={tx.categories} />
                  <div>
                    <p className="font-medium text-slate-800">
                      {tx.description ?? '(메모 없음)'}
                    </p>
                    <p className="text-sm text-slate-500">
                      {tx.categories?.name ?? '미분류'}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-semibold ${
                    tx.categories?.type === 'INCOME'
                      ? 'text-green-600'
                      : 'text-slate-800'
                  }`}
                >
                  {formatAmount(tx)}
                </p>
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

// Main Transactions Page
export default function TransactionsPage() {
  const [filter, setFilter] = useState<'all' | TransactionType>('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;

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
      <Header />
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
