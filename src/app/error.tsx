'use client';

import { Button } from '@/components/ui/button';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-[#F97354]">오류가 발생했어요</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-800">
          잠시 후 다시 시도해주세요
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          네트워크나 서버 상태가 불안정할 수 있습니다. 문제가 계속되면 설정값과
          Supabase 연결을 확인해주세요.
        </p>
        <Button className="mt-6" onClick={reset}>
          다시 시도
        </Button>
      </div>
    </div>
  );
}
