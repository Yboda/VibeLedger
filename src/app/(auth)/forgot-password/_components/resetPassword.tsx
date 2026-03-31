'use client';

import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { toast } from 'sonner';
import { resetPassword } from '@/actions/auth';
import Spinner from '@/components/common/Spinner';

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
              <Spinner size="sm" />
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
