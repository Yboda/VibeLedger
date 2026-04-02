'use client';

import {
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Utensils,
  Home,
  ShoppingBag,
  Car,
  Coffee,
  Film,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// Header
function Header() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">분석 리포트</h1>
        <p className="text-slate-500 text-sm">
          지출 패턴을 분석하고 재정 목표를 달성하세요
        </p>
      </div>
      <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
        {['week', 'month', 'year'].map(period => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedPeriod === period
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:bg-gray-100'
            }`}
          >
            {period === 'week' ? '주간' : period === 'month' ? '월간' : '연간'}
          </button>
        ))}
      </div>
    </div>
  );
}

// Key Metrics Cards
function KeyMetrics() {
  const metrics = [
    {
      label: '평균 일일 지출',
      value: '$27.45',
      change: '-12%',
      isPositive: true,
      icon: TrendingDown,
      description: '지난 달 대비',
    },
    {
      label: '가장 큰 지출',
      value: '$350.00',
      subLabel: '주거비 (월세)',
      icon: Home,
      description: '이번 달',
    },
    {
      label: '저축률',
      value: '72.3%',
      change: '+8%',
      isPositive: true,
      icon: TrendingUp,
      description: '수입 대비 저축',
    },
    {
      label: '거래 건수',
      value: '47건',
      change: '-5건',
      isPositive: true,
      icon: ArrowLeftRight,
      description: '이번 달',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                index === 0
                  ? 'bg-green-100'
                  : index === 1
                    ? 'bg-red-100'
                    : index === 2
                      ? 'bg-yellow-100'
                      : 'bg-blue-100'
              }`}
            >
              <metric.icon
                className={`w-5 h-5 ${
                  index === 0
                    ? 'text-green-600'
                    : index === 1
                      ? 'text-red-600'
                      : index === 2
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                }`}
              />
            </div>
            {metric.change && (
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  metric.isPositive
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {metric.change}
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-slate-800">{metric.value}</p>
          <p className="text-sm text-slate-500">{metric.label}</p>
          {metric.subLabel && (
            <p className="text-xs text-slate-400 mt-1">{metric.subLabel}</p>
          )}
        </div>
      ))}
    </div>
  );
}

// Spending Trend Chart
function SpendingTrendChart() {
  const data = [
    { month: '1월', income: 2100, expense: 1450 },
    { month: '2월', income: 2200, expense: 1380 },
    { month: '3월', income: 2150, expense: 1620 },
    { month: '4월', income: 2300, expense: 1550 },
    { month: '5월', income: 2250, expense: 1480 },
    { month: '6월', income: 2400, expense: 1720 },
    { month: '7월', income: 2350, expense: 1590 },
    { month: '8월', income: 2500, expense: 1680 },
    { month: '9월', income: 2450, expense: 1654 },
    { month: '10월', income: 2300, expense: 1823 },
    { month: '11월', income: 2400, expense: 1567 },
    { month: '12월', income: 2293, expense: 618 },
  ];

  const maxValue = Math.max(...data.flatMap(d => [d.income, d.expense]));

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">
          수입 vs 지출 추이
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FBBF24]" />
            <span className="text-sm text-slate-600">수입</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#F97354]" />
            <span className="text-sm text-slate-600">지출</span>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-2 h-64">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full flex gap-1 items-end"
              style={{ height: '220px' }}
            >
              <div
                className="flex-1 bg-[#FBBF24] rounded-t transition-all duration-300 hover:opacity-80"
                style={{ height: `${(d.income / maxValue) * 100}%` }}
              />
              <div
                className="flex-1 bg-[#F97354] rounded-t transition-all duration-300 hover:opacity-80"
                style={{ height: `${(d.expense / maxValue) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">{d.month}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Category Breakdown
function CategoryBreakdown() {
  const categories = [
    {
      name: '식비',
      amount: 234.5,
      percentage: 38,
      icon: Utensils,
      color: '#FBBF24',
    },
    {
      name: '주거비',
      amount: 350.0,
      percentage: 56,
      icon: Home,
      color: '#F97354',
    },
    {
      name: '교통비',
      amount: 89.0,
      percentage: 14,
      icon: Car,
      color: '#3B82F6',
    },
    {
      name: '쇼핑',
      amount: 45.9,
      percentage: 7,
      icon: ShoppingBag,
      color: '#8B5CF6',
    },
    {
      name: '카페/간식',
      amount: 78.39,
      percentage: 13,
      icon: Coffee,
      color: '#A16207',
    },
    {
      name: '여가/문화',
      amount: 25.0,
      percentage: 4,
      icon: Film,
      color: '#EC4899',
    },
  ];

  const total = categories.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        카테고리별 지출
      </h3>

      {/* Donut Chart Visualization */}
      <div className="flex items-center gap-8">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {
              categories.reduce(
                (acc, cat, i) => {
                  const startAngle = acc.offset;
                  const angle = (cat.amount / total) * 360;
                  const endAngle = startAngle + angle;

                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;

                  const x1 = 50 + 40 * Math.cos(startRad);
                  const y1 = 50 + 40 * Math.sin(startRad);
                  const x2 = 50 + 40 * Math.cos(endRad);
                  const y2 = 50 + 40 * Math.sin(endRad);

                  const largeArc = angle > 180 ? 1 : 0;

                  acc.paths.push(
                    <path
                      key={i}
                      d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={cat.color}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  );

                  acc.offset = endAngle;
                  return acc;
                },
                { paths: [] as JSX.Element[], offset: 0 }
              ).paths
            }
            <circle cx="50" cy="50" r="25" fill="white" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-slate-800">
              ${total.toFixed(0)}
            </p>
            <p className="text-xs text-slate-500">총 지출</p>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {categories.map((cat, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: cat.color }}
              >
                <cat.icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-700">
                    {cat.name}
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    ${cat.amount.toFixed(2)}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Insights Section
function Insights() {
  const insights = [
    {
      type: 'positive',
      title: '저축률 증가',
      description: '이번 달 저축률이 72.3%로 지난 달보다 8% 상승했습니다.',
      icon: TrendingUp,
    },
    {
      type: 'warning',
      title: '식비 예산 주의',
      description:
        '식비 예산의 58%를 이미 사용했습니다. 남은 기간 지출에 주의하세요.',
      icon: Utensils,
    },
    {
      type: 'info',
      title: '새로운 패턴 발견',
      description: '주말에 카페 지출이 평일보다 2.5배 높습니다.',
      icon: Coffee,
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">AI 인사이트</h3>
      <div className="grid grid-cols-3 gap-4">
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
            <div className="flex items-center gap-2 mb-2">
              <insight.icon
                className={`w-5 h-5 ${
                  insight.type === 'positive'
                    ? 'text-green-600'
                    : insight.type === 'warning'
                      ? 'text-yellow-600'
                      : 'text-blue-600'
                }`}
              />
              <h4 className="font-semibold text-slate-800">{insight.title}</h4>
            </div>
            <p className="text-sm text-slate-600">{insight.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Weekly Heatmap
function WeeklyHeatmap() {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const weeks = [
    [12, 25, 18, 45, 32, 78, 56],
    [15, 22, 38, 28, 42, 95, 68],
    [8, 35, 25, 52, 38, 110, 82],
    [18, 28, 42, 35, 48, 88, 65],
  ];

  const getIntensity = (value: number) => {
    if (value < 20) return 'bg-green-100';
    if (value < 40) return 'bg-green-200';
    if (value < 60) return 'bg-yellow-200';
    if (value < 80) return 'bg-orange-200';
    return 'bg-red-300';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        요일별 지출 패턴
      </h3>
      <div className="flex gap-4">
        <div className="flex flex-col gap-2 pt-6">
          {['1주차', '2주차', '3주차', '4주차'].map((week, i) => (
            <div
              key={i}
              className="h-10 flex items-center text-xs text-slate-500"
            >
              {week}
            </div>
          ))}
        </div>
        <div className="flex-1">
          <div className="flex gap-2 mb-2">
            {days.map((day, i) => (
              <div
                key={i}
                className="flex-1 text-center text-xs text-slate-500 font-medium"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex gap-2">
                {week.map((value, di) => (
                  <div
                    key={di}
                    className={`flex-1 h-10 rounded-lg ${getIntensity(value)} flex items-center justify-center text-xs font-medium text-slate-700 hover:ring-2 hover:ring-slate-400 transition-all cursor-pointer`}
                  >
                    ${value}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 mt-4">
        <span className="text-xs text-slate-500">적음</span>
        <div className="flex gap-1">
          {[
            'bg-green-100',
            'bg-green-200',
            'bg-yellow-200',
            'bg-orange-200',
            'bg-red-300',
          ].map((bg, i) => (
            <div key={i} className={`w-4 h-4 rounded ${bg}`} />
          ))}
        </div>
        <span className="text-xs text-slate-500">많음</span>
      </div>
    </div>
  );
}

// Main Analytics Page
export default function AnalyticsPage() {
  return (
    <>
      <Header />
      <KeyMetrics />
      <SpendingTrendChart />
      <div className="grid grid-cols-2 gap-6">
        <CategoryBreakdown />
        <Insights />
      </div>
      <WeeklyHeatmap />
    </>
  );
}
