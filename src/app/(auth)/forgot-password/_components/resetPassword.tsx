'use client';

import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { toast } from 'sonner';
import { resetPassword } from '@/actions/auth';

interface ResetPasswordProps {
  onSuccess: (email: string) => void;
}

export default function ResetPassword({ onSuccess }: ResetPasswordProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await resetPassword(email);

    if (result.success) {
      onSuccess(email);
    } else {
      toast.error(result.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Back Link */}
      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        로그인으로 돌아가기
      </Link>

      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold text-slate-800 mb-2">
          비밀번호를 잊으셨나요?
        </h1>
        <p className="text-sm text-slate-500">
          가입하신 이메일 주소를 입력해주세요.
          <br />
          비밀번호 재설정 링크를 보내드립니다.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            이메일
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="pl-10 h-12 border-2 border-[#FBBF24] focus:border-[#F97354] focus:ring-[#F97354] rounded-lg"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-[#F97354] hover:bg-[#e86344] text-white font-semibold rounded-lg transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              전송 중...
            </span>
          ) : (
            '재설정 링크 보내기'
          )}
        </Button>
      </form>
    </>
  );
}
