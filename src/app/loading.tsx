import Spinner from '@/components/common/Spinner';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <Spinner size="lg" />
        <p className="text-sm">화면을 불러오는 중입니다...</p>
      </div>
    </div>
  );
}
