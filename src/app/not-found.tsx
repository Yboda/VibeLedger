import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-[#F97354]">404</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-800">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          주소가 변경되었거나 접근할 수 없는 페이지입니다.
        </p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">대시보드로 이동</Link>
        </Button>
      </div>
    </div>
  );
}
