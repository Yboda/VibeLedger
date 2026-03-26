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
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm">이번 달 수입</p>
            <p className="text-2xl font-bold text-slate-800">+$2,293.31</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <ArrowDownRight className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <p className="text-xs text-green-600 mt-2">지난 달 대비 +12.5%</p>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm">이번 달 지출</p>
            <p className="text-2xl font-bold text-slate-800">-$617.79</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <p className="text-xs text-red-600 mt-2">지난 달 대비 +8.3%</p>
      </div>

      <div className="bg-[#F97354] rounded-xl p-5 shadow-sm text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">순 잔액</p>
            <p className="text-2xl font-bold">+$1,675.52</p>
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
function FilterBar() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedFilter === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setSelectedFilter('income')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedFilter === 'income'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
            }`}
          >
            수입
          </button>
          <button
            onClick={() => setSelectedFilter('expense')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedFilter === 'expense'
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
function CategoryIcon({ category }: { category: string }) {
  const iconConfig: Record<string, { icon: React.ElementType; bg: string }> = {
    food: { icon: Utensils, bg: '#FBBF24' },
    housing: { icon: Home, bg: '#F97354' },
    shopping: { icon: ShoppingBag, bg: '#8B5CF6' },
    transport: { icon: Car, bg: '#3B82F6' },
    electronics: { icon: Smartphone, bg: '#1e3a5f' },
    cafe: { icon: Coffee, bg: '#A16207' },
    salary: { icon: ArrowDownRight, bg: '#10B981' },
    freelance: { icon: ArrowDownRight, bg: '#06B6D4' },
  };

  const config = iconConfig[category] || {
    icon: MoreHorizontal,
    bg: '#6B7280',
  };
  const Icon = config.icon;

  return (
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center"
      style={{ backgroundColor: config.bg }}
    >
      <Icon className="w-5 h-5 text-white" />
    </div>
  );
}

// Transaction List
function TransactionList() {
  const transactions = [
    {
      id: 1,
      date: '2023-12-13',
      description: '월급',
      category: 'salary',
      categoryLabel: '급여',
      amount: 2000.0,
      type: 'income',
    },
    {
      id: 2,
      date: '2023-12-13',
      description: '프리랜서 수입',
      category: 'freelance',
      categoryLabel: '부수입',
      amount: 293.31,
      type: 'income',
    },
    {
      id: 3,
      date: '2023-12-12',
      description: '스타벅스',
      category: 'cafe',
      categoryLabel: '카페',
      amount: -5.5,
      type: 'expense',
    },
    {
      id: 4,
      date: '2023-12-12',
      description: '배달의민족',
      category: 'food',
      categoryLabel: '식비',
      amount: -22.0,
      type: 'expense',
    },
    {
      id: 5,
      date: '2023-12-11',
      description: '월세',
      category: 'housing',
      categoryLabel: '주거',
      amount: -350.0,
      type: 'expense',
    },
    {
      id: 6,
      date: '2023-12-11',
      description: '쿠팡 온라인쇼핑',
      category: 'shopping',
      categoryLabel: '쇼핑',
      amount: -45.9,
      type: 'expense',
    },
    {
      id: 7,
      date: '2023-12-10',
      description: '지하철 충전',
      category: 'transport',
      categoryLabel: '교통',
      amount: -30.0,
      type: 'expense',
    },
    {
      id: 8,
      date: '2023-12-10',
      description: '점심 식사',
      category: 'food',
      categoryLabel: '식비',
      amount: -12.0,
      type: 'expense',
    },
    {
      id: 9,
      date: '2023-12-09',
      description: '아이폰 케이스',
      category: 'electronics',
      categoryLabel: '전자기기',
      amount: -25.0,
      type: 'expense',
    },
    {
      id: 10,
      date: '2023-12-08',
      description: '마트 장보기',
      category: 'food',
      categoryLabel: '식비',
      amount: -67.39,
      type: 'expense',
    },
  ];

  const groupedTransactions = transactions.reduce(
    (acc, tx) => {
      const date = tx.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(tx);
      return acc;
    },
    {} as Record<string, typeof transactions>
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {Object.entries(groupedTransactions).map(([date, txs]) => (
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
                <CategoryIcon category={tx.category} />
                <div>
                  <p className="font-medium text-slate-800">{tx.description}</p>
                  <p className="text-sm text-slate-500">{tx.categoryLabel}</p>
                </div>
              </div>
              <p
                className={`font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-slate-800'}`}
              >
                {tx.type === 'income' ? '+' : ''}
                {tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      ))}

      {/* Pagination */}
      <div className="px-5 py-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">총 128개 거래 중 1-10 표시</p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            이전
          </Button>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded bg-slate-800 text-white text-sm font-medium">
              1
            </button>
            <button className="w-8 h-8 rounded hover:bg-gray-100 text-slate-600 text-sm">
              2
            </button>
            <button className="w-8 h-8 rounded hover:bg-gray-100 text-slate-600 text-sm">
              3
            </button>
            <span className="text-slate-400 px-1">...</span>
            <button className="w-8 h-8 rounded hover:bg-gray-100 text-slate-600 text-sm">
              13
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            다음
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main Transactions Page
export default function TransactionsPage() {
  return (
    <>
      <Header />
      <SummaryCards />
      <FilterBar />
      <TransactionList />
    </>
  );
}
