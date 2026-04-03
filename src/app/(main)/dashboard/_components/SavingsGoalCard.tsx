export function SavingsGoalCard() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-slate-600 text-sm mb-1">Savings Goal Status</p>
      <p className="text-2xl font-bold text-slate-800">80.7%</p>
      <div className="mt-2">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-coral rounded-full"
            style={{ width: '80.7%' }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">Savings Goal: ₩1,000</p>
      </div>
    </div>
  );
}
