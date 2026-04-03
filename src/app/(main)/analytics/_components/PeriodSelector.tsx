'use client';

import { useState } from 'react';

export function PeriodSelector() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  return (
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
  );
}
