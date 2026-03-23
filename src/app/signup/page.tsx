'use client';

import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import VibeLedgerLogo from '@/components/common/VibeLedgerLogo';

function GeometricBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Top right decorations */}
      <div className="absolute -top-10 right-20 w-40 h-40 bg-brand-yellow rotate-45 opacity-90" />
      <div className="absolute top-20 right-0 w-32 h-32 bg-brand-coral rotate-12" />
      <div className="absolute top-10 right-40 w-24 h-24 bg-brand-yellow rotate-45" />
      <div className="absolute top-40 right-10 w-20 h-20 bg-brand-yellow -rotate-12" />

      {/* Bottom left decorations */}
      <div className="absolute bottom-20 -left-10 w-36 h-36 bg-brand-yellow rotate-45" />
      <div className="absolute bottom-40 left-20 w-28 h-28 bg-brand-coral rotate-12" />
      <div className="absolute bottom-10 left-40 w-20 h-20 bg-brand-yellow rotate-45" />

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

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div
      className="min-h-screen bg-slate-800 flex items-center justify-center p-4 relative"
      style={{ backgroundColor: '#1e293b' }}
    >
      <GeometricBackground />

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md z-10">
        {/* Logo */}
        <div className="mb-6">
          <VibeLedgerLogo />
        </div>

        {/* Welcome Text */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">회원가입</h1>
          <p className="text-slate-600 text-sm">
            VibeLedger와 함께 재정 관리를 시작하세요
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              이름
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="pl-10 h-12 border-brand-yellow focus:border-brand-yellow focus:ring-brand-yellow"
                placeholder="홍길동"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pl-10 h-12 border-brand-yellow focus:border-brand-yellow focus:ring-brand-yellow"
                placeholder="example@email.com"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pl-10 h-12 border-brand-yellow focus:border-brand-yellow focus:ring-brand-yellow"
                placeholder="8자 이상 입력해주세요"
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              비밀번호 확인
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="pl-10 h-12 border-brand-yellow focus:border-brand-yellow focus:ring-brand-yellow"
                placeholder="비밀번호를 다시 입력해주세요"
              />
            </div>
          </div>

          {/* Signup Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-brand-coral text-white font-medium rounded-lg hover:bg-brand-coral/90"
          >
            가입하기
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300" />
          <span className="px-4 text-sm text-gray-500">or sign up with</span>
          <div className="flex-1 border-t border-gray-300" />
        </div>

        {/* Social Login */}
        <div className="flex justify-center gap-3">
          {/* Google */}
          <Button
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-gray-300 text-slate-800"
          >
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
            <span className="font-medium">Google</span>
          </Button>
          {/* Naver */}
          <Button
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 bg-[#03C75A] hover:bg-[#02b351] border-[#03C75A] text-white"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z" />
            </svg>
            <span className="font-medium">Naver</span>
          </Button>
          {/* Kakao */}
          <Button
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 bg-[#FEE500] hover:bg-[#f5dc00] border-[#FEE500] text-[#391B1B]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.726 1.8 5.117 4.5 6.473-.2.742-.724 2.684-.83 3.104-.13.524.192.516.404.376.166-.11 2.644-1.792 3.717-2.522.71.1 1.448.151 2.209.151 5.523 0 10-3.463 10-7.691C22 6.463 17.523 3 12 3z" />
            </svg>
            <span className="font-medium">Kakao</span>
          </Button>
        </div>

        {/* Footer Links */}
        <div className="flex justify-center mt-6 text-sm">
          <div className="text-slate-600">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/"
              className="text-slate-800 font-bold hover:text-slate-900"
            >
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
