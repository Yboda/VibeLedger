export function BudgetStatus() {
  const items = [
    { label: 'Budget Status', value: '100%', progress: 100, color: '#3B82F6' },
    {
      label: 'Budget Incom',
      value: '₩30.00',
      progress: 100,
      color: 'var(--color-brand-yellow)',
    },
    {
      label: 'Total Expenses',
      value: '₩17.00',
      progress: 60,
      color: 'var(--color-brand-coral)',
    },
    { label: 'Savings Goal', value: '100%', progress: 100, color: '#3B82F6' },
  ];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">Budget Status</h3>
        <button className="text-brand-coral text-sm font-medium">
          View all
        </button>
      </div>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">{item.label}</span>
              <span className="font-medium text-slate-800">{item.value}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${item.progress}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
