'use client';

import { useMemo } from 'react';
import {
  Coffee,
  TrendingUp,
  TrendingDown,
  Utensils,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { type ElementType } from 'react';
import Spinner from '@/components/common/Spinner';
import { useTransactionsByRangeQuery } from '../_api/useAnalyticsQuery';
import { useAnalyticsPeriod } from '../_providers/analytics-period-context';
import { useBudgetsQuery } from '../../budgets/_api/useBudgetsQuery';

interface Insight {
  type: 'positive' | 'warning' | 'info';
  title: string;
  description: string;
  icon: ElementType;
}

function buildInsights(
  transactions: {
    date: string;
    amount: number;
    categories: { type: string; name: string } | null;
  }[],
  budgets: {
    category_name: string;
    budget_amount: number;
    spent_amount: number;
  }[]
): Insight[] {
  const insights: Insight[] = [];

  const expenseTxs = transactions.filter(
    tx => tx.categories?.type === 'EXPENSE'
  );
  const incomeTxs = transactions.filter(tx => tx.categories?.type === 'INCOME');
  const totalExpense = expenseTxs.reduce((s, t) => s + t.amount, 0);
  const totalIncome = incomeTxs.reduce((s, t) => s + t.amount, 0);
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  // 1. 저축률 인사이트
  if (totalIncome > 0) {
    if (savingsRate >= 30) {
      insights.push({
        type: 'positive',
        title: '훌륭한 저축률',
        description: `이번 기간 저축률이 ${savingsRate.toFixed(1)}%입니다. 재정 목표에 잘 다가가고 있어요!`,
        icon: TrendingUp,
      });
    } else if (savingsRate < 0) {
      insights.push({
        type: 'warning',
        title: '지출이 수입 초과',
        description: `이번 기간 지출이 수입보다 ₩${Math.abs(totalIncome - totalExpense).toLocaleString('ko-KR')} 많습니다. 지출을 줄여보세요.`,
        icon: TrendingDown,
      });
    }
  }

  // 2. 예산 초과 카테고리 경고
  const overBudget = budgets.filter(b => b.spent_amount > b.budget_amount);
  if (overBudget.length > 0) {
    const names = overBudget.map(b => b.category_name).join(', ');
    insights.push({
      type: 'warning',
      title: '예산 초과 카테고리',
      description: `${names} 카테고리에서 예산을 초과했습니다. 다음 달 예산 조정을 고려해보세요.`,
      icon: AlertTriangle,
    });
  }

  // 3. 예산 카테고리 중 90% 이상 사용 경고
  const nearOverBudget = budgets.filter(
    b =>
      b.budget_amount > 0 &&
      b.spent_amount <= b.budget_amount &&
      b.spent_amount / b.budget_amount >= 0.9
  );
  if (nearOverBudget.length > 0 && overBudget.length === 0) {
    const names = nearOverBudget.map(b => b.category_name).join(', ');
    insights.push({
      type: 'warning',
      title: '예산 임박 카테고리',
      description: `${names} 카테고리가 예산의 90% 이상 사용되었습니다. 지출에 주의하세요.`,
      icon: Utensils,
    });
  }

  // 4. 주말 vs 평일 지출 패턴
  const weekdayExpense = expenseTxs
    .filter(tx => {
      const d = new Date(tx.date).getDay();
      return d >= 1 && d <= 5;
    })
    .reduce((s, t) => s + t.amount, 0);
  const weekendExpense = expenseTxs
    .filter(tx => {
      const d = new Date(tx.date).getDay();
      return d === 0 || d === 6;
    })
    .reduce((s, t) => s + t.amount, 0);

  const weekdayCount = expenseTxs.filter(tx => {
    const d = new Date(tx.date).getDay();
    return d >= 1 && d <= 5;
  }).length;
  const weekendCount = expenseTxs.filter(tx => {
    const d = new Date(tx.date).getDay();
    return d === 0 || d === 6;
  }).length;

  const avgWeekday = weekdayCount > 0 ? weekdayExpense / weekdayCount : 0;
  const avgWeekend = weekendCount > 0 ? weekendExpense / weekendCount : 0;

  if (avgWeekend > avgWeekday * 2 && weekendCount >= 2) {
    insights.push({
      type: 'info',
      title: '주말 지출 패턴',
      description: `주말 평균 지출이 평일보다 ${(avgWeekend / Math.max(avgWeekday, 1)).toFixed(1)}배 높습니다. 주말 지출 계획을 세워보세요.`,
      icon: Coffee,
    });
  }

  // 5. 지출 내역이 없는 경우
  if (expenseTxs.length === 0) {
    insights.push({
      type: 'positive',
      title: '지출 없음',
      description:
        '이번 기간에 지출 내역이 없습니다. 거래 내역을 추가해보세요.',
      icon: CheckCircle,
    });
  }

  return insights.slice(0, 3);
}

export function Insights() {
  const { startDate, endDate } = useAnalyticsPeriod();
  const now = new Date();

  const { data: transactions = [], isLoading: txLoading } =
    useTransactionsByRangeQuery(startDate, endDate);
  const { data: budgets = [], isLoading: budgetLoading } = useBudgetsQuery(
    now.getMonth() + 1,
    now.getFullYear()
  );

  const insights = useMemo(
    () => buildInsights(transactions, budgets),
    [transactions, budgets]
  );

  const isLoading = txLoading || budgetLoading;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">AI 인사이트</h3>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <Spinner size="sm" />
        </div>
      ) : insights.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-slate-400 text-sm">
            인사이트를 생성하기에 데이터가 부족합니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {insights.map((insight, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border-l-4 ${
                insight.type === 'positive'
                  ? 'bg-green-50 border-green-500'
                  : insight.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-blue-50 border-blue-500'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <insight.icon
                  className={`w-5 h-5 ${
                    insight.type === 'positive'
                      ? 'text-green-600'
                      : insight.type === 'warning'
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                  }`}
                />
                <h4 className="font-semibold text-slate-800">
                  {insight.title}
                </h4>
              </div>
              <p className="text-sm text-slate-600">{insight.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
