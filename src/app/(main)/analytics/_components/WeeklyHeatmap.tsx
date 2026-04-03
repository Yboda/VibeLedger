export function WeeklyHeatmap() {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const weeks = [
    [12, 25, 18, 45, 32, 78, 56],
    [15, 22, 38, 28, 42, 95, 68],
    [8, 35, 25, 52, 38, 110, 82],
    [18, 28, 42, 35, 48, 88, 65],
  ];

  const getIntensity = (value: number) => {
    if (value < 20) return 'bg-green-100';
    if (value < 40) return 'bg-green-200';
    if (value < 60) return 'bg-yellow-200';
    if (value < 80) return 'bg-orange-200';
    return 'bg-red-300';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        요일별 지출 패턴
      </h3>
      <div className="flex gap-4">
        <div className="flex flex-col gap-2 pt-6">
          {['1주차', '2주차', '3주차', '4주차'].map((week, i) => (
            <div
              key={i}
              className="h-10 flex items-center text-xs text-slate-500"
            >
              {week}
            </div>
          ))}
        </div>
        <div className="flex-1">
          <div className="flex gap-2 mb-2">
            {days.map((day, i) => (
              <div
                key={i}
                className="flex-1 text-center text-xs text-slate-500 font-medium"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex gap-2">
                {week.map((value, di) => (
                  <div
                    key={di}
                    className={`flex-1 h-10 rounded-lg ${getIntensity(value)} flex items-center justify-center text-xs font-medium text-slate-700 hover:ring-2 hover:ring-slate-400 transition-all cursor-pointer`}
                  >
                    ₩{value}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 mt-4">
        <span className="text-xs text-slate-500">적음</span>
        <div className="flex gap-1">
          {[
            'bg-green-100',
            'bg-green-200',
            'bg-yellow-200',
            'bg-orange-200',
            'bg-red-300',
          ].map((bg, i) => (
            <div key={i} className={`w-4 h-4 rounded ${bg}`} />
          ))}
        </div>
        <span className="text-xs text-slate-500">많음</span>
      </div>
    </div>
  );
}
