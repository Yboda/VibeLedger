'use client';

import { useState } from 'react';
import { Mail, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { resetPassword } from '@/actions/auth';

interface CheckEmailProps {
  email: string;
}

export default function CheckEmail({ email }: CheckEmailProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    setResendSuccess(false);

    const result = await resetPassword(email);

    if (result.success) {
      setResendSuccess(true);
    } else {
      toast.error(result.message);
    }

    setIsResending(false);
  };

  return (
    <>
      {/* Mail Icon */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 bg-[#FEF3C7] rounded-full flex items-center justify-center">
            <Mail className="w-10 h-10 text-[#F97354]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold text-slate-800 mb-2">
          이메일을 확인해주세요
        </h1>
        <p className="text-sm text-slate-500">
          비밀번호 재설정 링크를 아래 주소로 보냈습니다.
        </p>
        <p className="text-sm font-semibold text-[#F97354] mt-2">{email}</p>
      </div>

      {/* Instructions */}
      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          이메일 확인 방법
        </h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-[#FBBF24] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              1
            </span>
            <span>받은 편지함에서 VibeLedger 메일을 찾아주세요.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-[#FBBF24] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              2
            </span>
            <span>
              메일 내 <strong>&quot;비밀번호 재설정&quot;</strong> 버튼을
              클릭하세요.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-[#FBBF24] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              3
            </span>
            <span>새로운 비밀번호를 설정하세요.</span>
          </li>
        </ul>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-xs text-amber-800">
          <strong>메일이 보이지 않나요?</strong>
          <br />
          스팸 또는 프로모션 폴더를 확인해주세요. 메일이 도착하기까지 몇 분 정도
          걸릴 수 있습니다.
        </p>
      </div>

      {/* Success Message */}
      {resendSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-sm text-green-700 font-medium">
            재설정 링크를 다시 보냈습니다!
          </p>
        </div>
      )}

      {/* Resend Button */}
      <Button
        onClick={handleResend}
        disabled={isResending}
        variant="outline"
        className="w-full h-12 border-2 border-[#F97354] text-[#F97354] hover:bg-[#F97354] hover:text-white font-semibold rounded-lg transition-colors"
      >
        {isResending ? (
          <span className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            전송 중...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            재설정 링크 다시 보내기
          </span>
        )}
      </Button>

      {/* Back to Login */}
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          로그인으로 돌아가기
        </Link>
      </div>
    </>
  );
}
