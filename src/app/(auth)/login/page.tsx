'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login, signInWithGoogle } from '@/actions/auth';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import Link from 'next/link';
import { toast } from 'sonner';
import Spinner from '@/components/common/Spinner';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const result = await login(data);

      if (result.success) {
        toast.success('로그인에 성공했습니다.');
        router.push('/');
      } else {
        if ('redirectTo' in result && result.redirectTo) {
          router.push(result.redirectTo as string);
          return;
        }
        setServerError(result.message || '로그인에 실패했습니다.');
        // 실패 시 비밀번호만 초기화
        reset({ ...data, password: '' });
      }
    } catch (error) {
      console.error('Login submission error:', error);
      setServerError('서버 오류가 발생했습니다. 다시 시도해주세요.');
      reset({ ...data, password: '' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setServerError(null);

    const result = await signInWithGoogle();
    if (result.success) {
      window.location.href = result.url;
      return;
    }

    setServerError(result.message);
    setIsGoogleLoading(false);
  };

  return (
    <>
      {/* Server Error */}
      {serverError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-700">{serverError}</span>
        </div>
      )}
      {/* 환영 메시지 */}
      <div className="mb-6 text-center">
        <p className="text-sm font-medium text-slate-500 mb-1">
          똑똑한 재정관리의 시작
        </p>
        <h1 className="text-xl font-bold text-slate-800">
          바이브레저에 오신 것을 환영합니다!
        </h1>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-slate-700">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="email"
                {...register('email')}
                className={`pl-10 h-12 border-brand-yellow focus:border-brand-yellow focus:ring-brand-yellow ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : ''
                }`}
                placeholder="이메일을 입력해주세요"
                disabled={isLoading}
              />
            </div>
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-slate-700">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`pl-10 pr-10 h-12 border-brand-yellow focus:border-brand-yellow focus:ring-brand-yellow ${
                  errors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : ''
                }`}
                placeholder="비밀번호를 입력해주세요"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-brand-coral text-white font-medium rounded-lg hover:bg-brand-coral/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" />
              로그인 중...
            </span>
          ) : (
            '로그인'
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-300" />
        <span className="px-4 text-sm text-gray-500">또는</span>
        <div className="flex-1 border-t border-gray-300" />
      </div>

      {/* Social Login */}
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => void handleGoogleLogin()}
          disabled={isLoading || isGoogleLoading}
          className="flex h-12 w-full items-center gap-2 bg-white text-slate-800 hover:bg-gray-50 border-gray-300"
        >
          {isGoogleLoading ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" />
              Google로 이동 중...
            </span>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-medium">Google로 로그인</span>
            </>
          )}
        </Button>
      </div>

      {/* Footer Links */}
      <div className="flex justify-between mt-6 text-sm">
        <Link
          href="/forgot-password"
          className="text-slate-700 hover:text-slate-900 font-medium"
        >
          비밀번호를 잊으셨나요?
        </Link>
        <div className="text-slate-600">
          계정이 없으신가요?{' '}
          <Link
            href="/signup"
            className="text-slate-800 font-bold hover:text-slate-900"
          >
            회원가입
          </Link>
        </div>
      </div>
    </>
  );
}
