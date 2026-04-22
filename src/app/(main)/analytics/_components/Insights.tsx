'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import Spinner from '@/components/common/Spinner';
import { useTransactionsByRangeQuery } from '../_api/useAnalyticsQuery';
import { useAnalyticsPeriod } from '../_providers/analytics-period-context';
import { useBudgetsQuery } from '../../budgets/_api/useBudgetsQuery';
import {
  generateInsights,
  type InsightItem,
  type FinancialSummary,
} from '@/actions/llm';

const PERIOD_LABEL: Record<string, string> = {
  week: '이번 주',
  month: '이번 달',
  year: '올해',
};

function computeSummary(
  transactions: {
    date: string;
    amount: number;
    categories: { type: string; name: string } | null;
  }[],
  budgets: {
    category_name: string;
    budget_amount: number;
    spent_amount: number;
  }[],
  period: string,
  endDate: string
): FinancialSummary {
  const today = new Date().toISOString().slice(0, 10);
  const periodEnd = new Date(endDate).toISOString().slice(0, 10);

  const expenseTxs = transactions.filter(
    tx => tx.categories?.type === 'EXPENSE'
  );
  const incomeTxs = transactions.filter(tx => tx.categories?.type === 'INCOME');

  const totalExpense = expenseTxs.reduce((s, t) => s + t.amount, 0);
  const totalIncome = incomeTxs.reduce((s, t) => s + t.amount, 0);
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  const categoryMap = new Map<string, number>();
  for (const tx of expenseTxs) {
    const name = tx.categories?.name ?? '기타';
    categoryMap.set(name, (categoryMap.get(name) ?? 0) + tx.amount);
  }
  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  const overBudgetCategories = budgets
    .filter(b => b.spent_amount > b.budget_amount)
    .map(b => ({
      name: b.category_name,
      budget: b.budget_amount,
      spent: b.spent_amount,
    }));

  const weekendExpense = expenseTxs
    .filter(tx => {
      const d = new Date(tx.date).getDay();
      return d === 0 || d === 6;
    })
    .reduce((s, t) => s + t.amount, 0);
  const weekendExpenseRatio =
    totalExpense > 0 ? weekendExpense / totalExpense : 0;

  return {
    periodLabel: PERIOD_LABEL[period] ?? period,
    today,
    periodEnd,
    totalIncome,
    totalExpense,
    savingsRate,
    categoryBreakdown,
    overBudgetCategories,
    transactionCount: transactions.length,
    weekendExpenseRatio,
  };
}

function InsightIcon({ type }: { type: InsightItem['type'] }) {
  if (type === 'positive')
    return <TrendingUp className="w-5 h-5 text-green-600" />;
  if (type === 'warning')
    return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
  return <Lightbulb className="w-5 h-5 text-blue-600" />;
}

const TYPE_STYLE: Record<InsightItem['type'], string> = {
  positive: 'bg-green-50 border-green-400',
  warning: 'bg-yellow-50 border-yellow-400',
  info: 'bg-blue-50 border-blue-400',
};

export function Insights() {
  const { period, startDate, endDate } = useAnalyticsPeriod();
  const now = new Date();

  const { data: transactions = [], isLoading: txLoading } =
    useTransactionsByRangeQuery(startDate, endDate);
  const { data: budgets = [], isLoading: budgetLoading } = useBudgetsQuery(
    now.getMonth() + 1,
    now.getFullYear()
  );

  const dataLoading = txLoading || budgetLoading;

  const summary = useMemo(
    () => computeSummary(transactions, budgets, period, endDate),
    [transactions, budgets, period, endDate]
  );

  // TanStack Query로 AI 인사이트 관리 — effect 내 setState 문제 없음
  const fetchKey = `${period}_${startDate}_${endDate}`;
  const {
    data: insightsResult,
    isFetching: aiLoading,
    refetch,
  } = useQuery({
    queryKey: ['ai-insights', fetchKey],
    queryFn: () => generateInsights(summary),
    enabled: !dataLoading,
    staleTime: Infinity, // 같은 기간은 자동 재요청하지 않음
    retry: false,
    gcTime: 5 * 60 * 1000,
  });

  const aiInsights = insightsResult?.data ?? null;
  const aiError = insightsResult?.error ?? null;

  const handleRefresh = () => {
    void refetch();
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#F97354]" />
          <h3 className="text-lg font-semibold text-slate-800">AI 인사이트</h3>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {PERIOD_LABEL[period] ?? period}
          </span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={aiLoading || dataLoading}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#F97354] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`}
          />
          다시 분석
        </button>
      </div>

      {/* 콘텐츠 */}
      {dataLoading || aiLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Spinner size="sm" />
          <p className="text-xs text-slate-400">
            {dataLoading ? '데이터 불러오는 중...' : 'AI가 분석하는 중...'}
          </p>
        </div>
      ) : aiError ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
          <AlertTriangle className="w-6 h-6 text-yellow-400" />
          <p className="text-sm text-slate-500">{aiError}</p>
          <button
            onClick={handleRefresh}
            className="text-xs text-[#F97354] hover:underline"
          >
            다시 시도
          </button>
        </div>
      ) : !aiInsights || aiInsights.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-400 text-sm">
            인사이트를 생성하기에 데이터가 부족합니다.
          </p>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 gap-3 content-start">
          {aiInsights.map((insight, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border-l-4 ${TYPE_STYLE[insight.type]}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <InsightIcon type={insight.type} />
                <h4 className="font-semibold text-slate-800">
                  {insight.title}
                </h4>
              </div>
              <p className="text-sm text-slate-600">{insight.description}</p>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-300 mt-3 text-right shrink-0">
        Powered by Gemini
      </p>
    </div>
  );
}
