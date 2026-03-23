'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login } from './actions';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';

function VibeLedgerLogo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <img
        src="/images/logo_w.jpg"
        alt="VibeLedger Logo"
        className="h-30 w-auto"
      />
    </div>
  );
}

function GeometricBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Top right decorations */}
      <div className="absolute -top-10 right-20 w-40 h-40 bg-yellow-400 rotate-45 opacity-90" />
      <div
        className="absolute top-20 right-0 w-32 h-32 bg-coral-500 rotate-12"
        style={{ backgroundColor: '#F97354' }}
      />
      <div className="absolute top-10 right-40 w-24 h-24 bg-slate-900 rotate-45" />
      <div className="absolute top-40 right-10 w-20 h-20 bg-yellow-400 -rotate-12" />

      {/* Bottom left decorations */}
      <div className="absolute bottom-20 -left-10 w-36 h-36 bg-yellow-400 rotate-45" />
      <div
        className="absolute bottom-40 left-20 w-28 h-28 rotate-12"
        style={{ backgroundColor: '#F97354' }}
      />
      <div className="absolute bottom-10 left-40 w-20 h-20 bg-slate-900 rotate-45" />

      {/* Scattered squares and shapes */}
      <div className="absolute top-1/4 left-10 w-8 h-8 border-2 border-slate-600 rotate-45 opacity-30" />
      <div className="absolute top-1/3 left-32 w-6 h-6 border-2 border-slate-600 rotate-12 opacity-30" />
      <div className="absolute top-1/2 left-20 w-10 h-10 border-2 border-slate-600 -rotate-12 opacity-30" />
      <div className="absolute bottom-1/3 right-1/4 w-8 h-8 border-2 border-slate-600 rotate-45 opacity-30" />
      <div className="absolute top-1/4 right-1/3 w-6 h-6 border-2 border-slate-600 rotate-12 opacity-30" />
      <div className="absolute bottom-1/4 right-20 w-4 h-4 bg-slate-600 rotate-45 opacity-40" />
      <div className="absolute bottom-10 right-1/3 w-6 h-6 border-2 border-slate-600 -rotate-6 opacity-30" />
    </div>
  );
}

function SocialButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-gray-300 text-slate-800"
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

      if (!result.success) {
        setServerError(result.message || '로그인에 실패했습니다.');
        // 실패 시 비밀번호만 초기화
        reset({ ...data, password: '' });
      }
      // 성공 시 서버 액션에서 리다이렉트 처리
    } catch (error) {
      console.error('Login submission error:', error);
      setServerError('서버 오류가 발생했습니다. 다시 시도해주세요.');
      reset({ ...data, password: '' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-800 flex items-center justify-center p-4 relative"
      style={{ backgroundColor: '#1e293b' }}
    >
      <GeometricBackground />

      <div className="bg-white rounded-2xl shadow-2xl px-8 pb-8 w-full max-w-md z-10">
        {/* Logo */}
        <div className="mb-6">
          <VibeLedgerLogo />
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-700">{serverError}</span>
          </div>
        )}
        {/* 환영 메시지 */}
        <p className="text-slate-800">바이브레저에 오신 것을 환영합니다!</p>
        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          {/* Email Field */}
          <div>
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-slate-700">
                이메일
              </label>
              <div className="relative border rounded">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="email"
                  {...register('email')}
                  className={`pl-10 h-12 border-yellow-400 focus:border-yellow-500 focus:ring-yellow-500 ${
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
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                비밀번호
              </label>
              <div className="relative border rounded">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`pl-10 pr-10 h-12 border-yellow-400 focus:border-yellow-500 focus:ring-yellow-500 ${
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
            className="w-full h-12 text-white font-medium rounded-lg"
            style={{ backgroundColor: '#F97354' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                로그인 중...
              </div>
            ) : (
              '로그인'
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center py-4">
          <div className="flex-1 border-t border-gray-300" />
          <span className="px-4 text-sm text-gray-500">or sign in with</span>
          <div className="flex-1 border-t border-gray-300" />
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <SocialButton
            icon={
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
            }
            label="Google"
          />
          <SocialButton
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            }
            label="GitHub"
          />
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            계정이 없으신가요?{' '}
            <a
              href="/signup"
              className="text-[#F97354] hover:text-[#ea580c] font-medium"
            >
              회원가입
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
