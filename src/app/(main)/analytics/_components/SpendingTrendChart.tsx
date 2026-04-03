export function SpendingTrendChart() {
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
