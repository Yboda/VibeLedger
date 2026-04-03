import { type ReactElement } from 'react';
import { Car, Coffee, Film, Home, ShoppingBag, Utensils } from 'lucide-react';

export function CategoryBreakdown() {
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
                { paths: [] as ReactElement[], offset: 0 }
              ).paths
            }
            <circle cx="50" cy="50" r="25" fill="white" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-slate-800">
              ₩{total.toFixed(0)}
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
                    ₩{cat.amount.toFixed(2)}
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
