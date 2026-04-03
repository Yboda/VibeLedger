export function BudgetSummary() {
  const totalBudget = 2000;
  const totalSpent = 847.79;
  const remaining = totalBudget - totalSpent;
  const percentage = (totalSpent / totalBudget) * 100;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-slate-500 text-sm">이번 달 전체 예산</p>
          <p className="text-3xl font-bold text-slate-800">
            ₩{totalBudget.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-slate-500 text-sm">남은 예산</p>
          <p className="text-2xl font-bold text-green-600">
            ₩{remaining.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div
          className="absolute top-0 left-0 h-full bg-linear-to-r from-[#F97354] to-[#FBBF24] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-slate-600">
          사용: ₩{totalSpent.toLocaleString()} ({percentage.toFixed(1)}%)
        </span>
        <span className="text-slate-500">
          목표까지 ₩{remaining.toLocaleString()} 남음
        </span>
      </div>
    </div>
  );
}
