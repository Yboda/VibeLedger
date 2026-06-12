import Spinner from '@/components/common/Spinner';

export function PageContentLoader() {
  return (
    <div
      className="flex min-h-[320px] flex-col items-center justify-center gap-3 text-slate-500"
      aria-live="polite"
      aria-busy="true"
    >
      <Spinner size="lg" />
      <p className="text-sm">페이지를 불러오는 중입니다...</p>
    </div>
  );
}
