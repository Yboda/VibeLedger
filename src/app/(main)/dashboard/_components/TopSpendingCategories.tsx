import { Bookmark, Home, Utensils } from 'lucide-react';

export function TopSpendingCategories() {
  const categories = [
    { name: 'seaving', color: 'var(--color-brand-coral)', icon: Bookmark },
    { name: 'housing', color: 'var(--color-brand-navy)', icon: Home },
    { name: 'food', color: 'var(--color-brand-yellow)', icon: Utensils },
  ];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">
          Top Spending Categories
        </h3>
        <button className="text-brand-coral text-sm font-medium">
          See all
        </button>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative h-40">
            <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-xs text-slate-500">
              <span>₩250</span>
              <span>₩200</span>
              <span>₩150</span>
              <span>₩100</span>
              <span>₩50</span>
              <span>0</span>
            </div>
            <div className="ml-10 h-32 flex items-end gap-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, idx) => (
                <div key={month} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col gap-0.5">
                    <div
                      className="w-full bg-brand-yellow"
                      style={{ height: `${20 + idx * 5}px` }}
                    />
                    <div
                      className="w-full bg-brand-navy"
                      style={{ height: `${30 + idx * 8}px` }}
                    />
                    <div
                      className="w-full bg-brand-coral"
                      style={{ height: `${15 + idx * 3}px` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 mt-2">{month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 justify-center">
          {categories.map(cat => (
            <div key={cat.name} className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: cat.color }}
              >
                <cat.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-slate-700">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
