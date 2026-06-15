'use client';

import Link from 'next/link';
import { CategoryIcon } from '../../transactions/_components/CategoryIcon';
import { useRecentTransactionsQuery } from '../_api/useRecentTransactionsQuery';
import { CrossfadeContent } from '@/components/common/CrossfadeContent';
import { TransactionTableSkeleton } from './dashboard-skeletons';

const ROW_COUNT = 5;

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export function RecentTransactions() {
  const { data: transactions = [], isLoading } =
    useRecentTransactionsQuery(ROW_COUNT);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <h3 className="font-semibold text-slate-800">최근 거래 내역</h3>
        <Link
          href="/transactions"
          className="text-sm font-medium text-[#F97354] hover:underline"
        >
          전체 보기
        </Link>
      </div>

      <CrossfadeContent
        isLoading={isLoading}
        className="min-h-0 w-full flex-1"
        skeleton={<TransactionTableSkeleton rows={ROW_COUNT} />}
      >
        {transactions.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-400">거래 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="h-full min-h-0 overflow-y-auto [scrollbar-gutter:stable]">
            <table className="w-full table-fixed">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="text-left text-sm text-slate-500">
                  <th className="w-[18%] pb-2 font-medium">날짜</th>
                  <th className="w-[32%] pb-2 font-medium">내용</th>
                  <th className="w-[26%] pb-2 font-medium">카테고리</th>
                  <th className="w-[24%] pb-2 pr-3 text-right font-medium">
                    금액
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => {
                  const isIncome = tx.categories?.type === 'INCOME';
                  const amountStr = tx.amount.toLocaleString('ko-KR');

                  return (
                    <tr key={tx.id} className="border-t border-gray-100">
                      <td className="whitespace-nowrap py-2.5 text-sm text-slate-500">
                        {formatDate(tx.date)}
                      </td>
                      <td className="truncate py-2.5 text-sm text-slate-800">
                        {tx.description ?? tx.categories?.name ?? '미분류'}
                      </td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <div className="origin-left scale-75">
                            <CategoryIcon category={tx.categories} />
                          </div>
                          <span className="truncate text-sm text-slate-600">
                            {tx.categories?.name ?? '미분류'}
                          </span>
                        </div>
                      </td>
                      <td
                        className={`py-2.5 pr-3 text-right text-sm font-semibold ${
                          isIncome ? 'text-green-600' : 'text-slate-800'
                        }`}
                      >
                        {isIncome ? '+' : '-'}₩{amountStr}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CrossfadeContent>
    </div>
  );
}
