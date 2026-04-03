export function MonthlyComparison() {
  const months = [
    { month: '9월', budget: 2000, spent: 1654 },
    { month: '10월', budget: 2000, spent: 1823 },
    { month: '11월', budget: 2000, spent: 1567 },
    { month: '12월', budget: 2000, spent: 847.79 },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        월별 예산 사용 추이
      </h3>
      <div className="flex items-end gap-4 h-48">
        {months.map((m, i) => {
          const percentage = (m.spent / m.budget) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gray-100 rounded-t-lg relative"
                style={{ height: '160px' }}
              >
                <div
                  className="absolute bottom-0 w-full rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${percentage}%`,
                    background: `linear-gradient(to top, #F97354, #FBBF24)`,
                  }}
                />
              </div>
              <p className="text-sm font-medium text-slate-700 mt-2">
                {m.month}
              </p>
              <p className="text-xs text-slate-500">
                ₩{m.spent.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
