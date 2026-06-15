import Spinner from '@/components/common/Spinner';

export function AppShellLoader({
  message = '화면을 불러오는 중입니다...',
}: {
  message?: string;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-56 flex-shrink-0 bg-slate-800" aria-hidden="true" />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div
          className="border-b border-gray-100 bg-white px-6 py-4"
          aria-hidden="true"
        >
          <div className="h-4 w-24 rounded bg-slate-100" />
          <div className="mt-2 h-7 w-48 rounded bg-slate-100" />
        </div>
        <div
          className="flex flex-1 flex-col items-center justify-center gap-3 text-slate-500"
          aria-live="polite"
          aria-busy="true"
        >
          <Spinner size="lg" />
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}
