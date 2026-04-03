import { Coffee, TrendingUp, Utensils } from 'lucide-react';

export function Insights() {
  const insights = [
    {
      type: 'positive',
      title: '저축률 증가',
      description: '이번 달 저축률이 72.3%로 지난 달보다 8% 상승했습니다.',
      icon: TrendingUp,
    },
    {
      type: 'warning',
      title: '식비 예산 주의',
      description:
        '식비 예산의 58%를 이미 사용했습니다. 남은 기간 지출에 주의하세요.',
      icon: Utensils,
    },
    {
      type: 'info',
      title: '새로운 패턴 발견',
      description: '주말에 카페 지출이 평일보다 2.5배 높습니다.',
      icon: Coffee,
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">AI 인사이트</h3>
      <div className="grid grid-cols-3 gap-4">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border-l-4 ${
              insight.type === 'positive'
                ? 'bg-green-50 border-green-500'
                : insight.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-500'
                  : 'bg-blue-50 border-blue-500'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <insight.icon
                className={`w-5 h-5 ${
                  insight.type === 'positive'
                    ? 'text-green-600'
                    : insight.type === 'warning'
                      ? 'text-yellow-600'
                      : 'text-blue-600'
                }`}
              />
              <h4 className="font-semibold text-slate-800">{insight.title}</h4>
            </div>
            <p className="text-sm text-slate-600">{insight.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
