'use client';

import {
  useAnalyticsPeriod,
  type AnalyticsPeriod,
} from '../_providers/analytics-period-context';

const PERIODS: { value: AnalyticsPeriod; label: string }[] = [
  { value: 'week', label: '주간' },
  { value: 'month', label: '월간' },
  { value: 'year', label: '연간' },
];

export function PeriodSelector() {
  const { period, setPeriod } = useAnalyticsPeriod();

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
      {PERIODS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setPeriod(value)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            period === value
              ? 'bg-slate-800 text-white'
              : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
