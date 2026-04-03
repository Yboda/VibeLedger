import { ArrowLeftRight, Home, TrendingDown, TrendingUp } from 'lucide-react';

export function KeyMetrics() {
  const metrics = [
    {
      label: '평균 일일 지출',
      value: '₩27.45',
      change: '-12%',
      isPositive: true,
      icon: TrendingDown,
      description: '지난 달 대비',
    },
    {
      label: '가장 큰 지출',
      value: '₩350.00',
      subLabel: '주거비 (월세)',
      icon: Home,
      description: '이번 달',
    },
    {
      label: '저축률',
      value: '72.3%',
      change: '+8%',
      isPositive: true,
      icon: TrendingUp,
      description: '수입 대비 저축',
    },
    {
      label: '거래 건수',
      value: '47건',
      change: '-5건',
      isPositive: true,
      icon: ArrowLeftRight,
      description: '이번 달',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                index === 0
                  ? 'bg-green-100'
                  : index === 1
                    ? 'bg-red-100'
                    : index === 2
                      ? 'bg-yellow-100'
                      : 'bg-blue-100'
              }`}
            >
              <metric.icon
                className={`w-5 h-5 ${
                  index === 0
                    ? 'text-green-600'
                    : index === 1
                      ? 'text-red-600'
                      : index === 2
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                }`}
              />
            </div>
            {metric.change && (
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  metric.isPositive
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {metric.change}
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-slate-800">{metric.value}</p>
          <p className="text-sm text-slate-500">{metric.label}</p>
          {metric.subLabel && (
            <p className="text-xs text-slate-400 mt-1">{metric.subLabel}</p>
          )}
        </div>
      ))}
    </div>
  );
}
