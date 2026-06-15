'use client';

import Spinner from '@/components/common/Spinner';

export function CsvImportOverlay({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const progress = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-slate-900/45 backdrop-blur-[2px]"
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <Spinner size="lg" className="text-[#F97354]" />
          <p className="mt-4 text-base font-semibold text-slate-800">
            거래 내역 가져오는 중
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {current} / {total}건 처리 중…
          </p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#F97354] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">{progress}%</p>
        </div>
      </div>
    </div>
  );
}
