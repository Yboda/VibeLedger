'use client';

import { useState } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { updatePassword } from '@/actions/auth';

function ValidationItem({ isValid, text }: { isValid: boolean; text: string }) {
  return (
    <li
      className={`flex items-center gap-2 text-xs ${isValid ? 'text-green-600' : 'text-slate-400'}`}
    >
      {isValid ? (
        <CheckCircle2 className="w-3.5 h-3.5" />
      ) : (
        <XCircle className="w-3.5 h-3.5" />
      )}
      {text}
    </li>
  );
}

export default function NewPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  // Password validation
  const validations = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    passwordsMatch: password === confirmPassword && password.length > 0,
  };

  const isValidPassword =
    validations.minLength &&
    validations.hasUppercase &&
    validations.hasLowercase &&
    validations.hasNumber;
  const canSubmit = isValidPassword && validations.passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);

    const result = await updatePassword(password);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      toast.error(result.message || '비밀번호 변경에 실패했습니다.');
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 mb-2">
          비밀번호가 변경되었습니다!
        </h1>
        <p className="text-sm text-slate-500 mb-4">
          새로운 비밀번호로 로그인할 수 있습니다.
          <br />
          잠시 후 로그인 페이지로 이동합니다.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
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
          로그인 페이지로 이동 중...
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold text-slate-800 mb-2">
          새 비밀번호 설정
        </h1>
        <p className="text-sm text-slate-500">
          안전한 새 비밀번호를 입력해주세요.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            새 비밀번호
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="새 비밀번호 입력"
              className="pl-10 pr-10 h-12 border-2 border-[#FBBF24] focus:border-[#F97354] focus:ring-[#F97354] rounded-lg"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        {password.length > 0 && (
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs font-medium text-slate-700 mb-2">
              비밀번호 요구사항
            </p>
            <ul className="space-y-1">
              <ValidationItem
                isValid={validations.minLength}
                text="최소 8자 이상"
              />
              <ValidationItem
                isValid={validations.hasUppercase}
                text="대문자 포함"
              />
              <ValidationItem
                isValid={validations.hasLowercase}
                text="소문자 포함"
              />
              <ValidationItem
                isValid={validations.hasNumber}
                text="숫자 포함"
              />
              <ValidationItem
                isValid={validations.hasSpecial}
                text="특수문자 포함 (선택)"
              />
            </ul>
          </div>
        )}

        {/* Confirm Password Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            비밀번호 확인
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 다시 입력"
              className={`pl-10 pr-10 h-12 border-2 rounded-lg ${
                confirmPassword.length > 0
                  ? validations.passwordsMatch
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-[#FBBF24] focus:border-[#F97354] focus:ring-[#F97354]'
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {confirmPassword.length > 0 && !validations.passwordsMatch && (
            <p className="mt-1 text-xs text-red-500">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!canSubmit || isLoading}
          className="w-full h-12 bg-[#F97354] hover:bg-[#e86344] disabled:bg-slate-300 text-white font-semibold rounded-lg transition-colors"
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
              변경 중...
            </span>
          ) : (
            '비밀번호 변경하기'
          )}
        </Button>
      </form>
    </>
  );
}
