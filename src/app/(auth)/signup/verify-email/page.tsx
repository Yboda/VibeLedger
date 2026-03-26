'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { resendVerificationEmail } from '@/actions/auth';

const VALID_SOURCES = ['signup', 'login'] as const;

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userEmail = searchParams.get('email') ?? '';
  const from = searchParams.get('from');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (
      !from ||
      !VALID_SOURCES.includes(from as (typeof VALID_SOURCES)[number])
    ) {
      router.replace('/');
    }
  }, [from, router]);

  const handleResend = async () => {
    if (!userEmail) {
      toast.error(
        '이메일 주소를 찾을 수 없습니다. 회원가입을 다시 시도해주세요.'
      );
      return;
    }

    setIsResending(true);

    const result = await resendVerificationEmail(userEmail);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }

    setIsResending(false);
  };

  return (
    <>
      {/* Email Icon */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center">
            <Mail className="w-12 h-12 text-brand-coral" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-brand-coral flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          이메일을 확인해주세요
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          회원가입을 완료하려면 이메일에서
          <br />
          인증 링크를 클릭해주세요.
        </p>
      </div>

      {/* Email Display */}
      <div className="rounded-lg p-4 mb-6 text-center bg-slate-50">
        <p className="text-sm text-slate-500 mb-1">발송된 이메일 주소</p>
        <p className="font-semibold text-slate-800">
          {userEmail || '이메일 주소를 불러올 수 없습니다.'}
        </p>
      </div>

      {/* Tips Section */}
      <div className="rounded-lg p-4 mb-6 border-l-4 bg-amber-50 border-brand-yellow">
        <p className="text-sm font-medium text-slate-700 mb-2">
          이메일이 보이지 않나요?
        </p>
        <ul className="text-sm text-slate-600 space-y-1">
          <li className="flex items-start gap-2">
            <span className="text-brand-yellow mt-0.5">•</span>
            <span>스팸 또는 정크 메일함을 확인해주세요.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-yellow mt-0.5">•</span>
            <span>이메일 도착까지 몇 분이 걸릴 수 있습니다.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-yellow mt-0.5">•</span>
            <span>이메일 주소가 정확한지 확인해주세요.</span>
          </li>
        </ul>
      </div>

      {/* Resend Button */}
      <Button
        onClick={handleResend}
        disabled={isResending}
        variant="outline"
        className="w-full h-12 font-medium rounded-lg border-2 border-brand-coral text-brand-coral hover:bg-brand-coral/5 mb-3 flex items-center justify-center gap-2 disabled:text-slate-400 disabled:border-slate-300"
      >
        {isResending ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            전송 중...
          </>
        ) : (
          <>
            <Mail className="w-4 h-4" />
            인증 메일 다시 보내기
          </>
        )}
      </Button>

      {/* Login Button */}
      <Button
        asChild
        className="w-full h-12 bg-brand-coral text-white font-medium rounded-lg hover:bg-brand-coral/90"
      >
        <Link href="/login">로그인 페이지로 이동</Link>
      </Button>

      {/* Back to Signup */}
      <div className="flex justify-center mt-6">
        <Link
          href="/signup"
          className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          이메일 주소 변경하기
        </Link>
      </div>
    </>
  );
}
