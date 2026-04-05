'use client';

import Link from 'next/link';
import Spinner from '@/components/common/Spinner';
import { CategoryIcon } from '../../transactions/_components/CategoryIcon';
import { useRecentTransactionsQuery } from '../_api/useRecentTransactionsQuery';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export function RecentTransactions() {
  const { data: transactions = [], isLoading } = useRecentTransactionsQuery(5);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">최근 거래 내역</h3>
        <Link
          href="/transactions"
          className="text-[#F97354] text-sm font-medium hover:underline"
        >
          전체 보기
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[220px]">
          <Spinner size="sm" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex items-center justify-center h-[220px]">
          <p className="text-slate-400 text-sm">거래 내역이 없습니다.</p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-slate-500">
              <th className="pb-3 font-medium">날짜</th>
              <th className="pb-3 font-medium">내용</th>
              <th className="pb-3 font-medium">카테고리</th>
              <th className="pb-3 font-medium text-right">금액</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => {
              const isIncome = tx.categories?.type === 'INCOME';
              const amountStr = tx.amount.toLocaleString('ko-KR');
              return (
                <tr key={tx.id} className="border-t border-gray-100">
                  <td className="py-3 text-sm text-slate-500 whitespace-nowrap">
                    {formatDate(tx.date)}
                  </td>
                  <td className="py-3 text-sm text-slate-800">
                    {tx.description ?? tx.categories?.name ?? '미분류'}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="scale-75 origin-left">
                        <CategoryIcon category={tx.categories} />
                      </div>
                      <span className="text-sm text-slate-600">
                        {tx.categories?.name ?? '미분류'}
                      </span>
                    </div>
                  </td>
                  <td
                    className={`py-3 text-sm text-right font-semibold ${
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
      )}
    </div>
  );
}
