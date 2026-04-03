export function MonthlySpendingTrend() {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Dec',
  ];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm col-span-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">Monthly Spending Trend</h3>
        <button className="text-brand-coral text-sm font-medium">
          View all
        </button>
      </div>
      <div className="relative h-48">
        <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-slate-500">
          <span>200</span>
          <span>150</span>
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>
        <div className="ml-10 h-40 relative">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 160"
            preserveAspectRatio="none"
          >
            <path
              d="M0 140 Q40 120 80 100 T160 80 T240 60 T320 80 T400 100 L400 160 L0 160 Z"
              fill="var(--color-brand-coral)"
              fillOpacity="0.8"
            />
            <path
              d="M0 160 Q40 140 80 120 T160 100 T240 80 T320 100 T400 120 L400 160 L0 160 Z"
              fill="var(--color-brand-yellow)"
              fillOpacity="0.9"
            />
            <rect
              x="20"
              y="90"
              width="20"
              height="70"
              fill="var(--color-brand-navy)"
            />
            <rect
              x="60"
              y="100"
              width="20"
              height="60"
              fill="var(--color-brand-navy)"
            />
            <rect
              x="100"
              y="80"
              width="20"
              height="80"
              fill="var(--color-brand-navy)"
            />
            <rect
              x="140"
              y="70"
              width="20"
              height="90"
              fill="var(--color-brand-navy)"
            />
            <rect
              x="180"
              y="60"
              width="20"
              height="100"
              fill="var(--color-brand-navy)"
            />
            <rect
              x="220"
              y="50"
              width="20"
              height="110"
              fill="var(--color-brand-navy)"
            />
            <rect
              x="260"
              y="70"
              width="20"
              height="90"
              fill="var(--color-brand-navy)"
            />
            <rect
              x="300"
              y="90"
              width="20"
              height="70"
              fill="var(--color-brand-navy)"
            />
            <rect
              x="340"
              y="80"
              width="20"
              height="80"
              fill="var(--color-brand-navy)"
            />
            <rect
              x="380"
              y="100"
              width="20"
              height="60"
              fill="var(--color-brand-navy)"
            />
          </svg>
        </div>
        <div className="ml-10 flex justify-between text-xs text-slate-500 mt-2">
          {months.map(month => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
