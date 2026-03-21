"use client"

import { useState } from "react"
import { Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function VibeLedgerLogo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <img 
        src="/images/logo_w.jpg" 
        alt="VibeLedger Logo" 
        className="h-30 w-auto"
      />
    </div>
  )
}

function GeometricBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Top right decorations */}
      <div className="absolute -top-10 right-20 w-40 h-40 bg-yellow-400 rotate-45 opacity-90" />
      <div className="absolute top-20 right-0 w-32 h-32 bg-coral-500 rotate-12" style={{ backgroundColor: '#F97354' }} />
      <div className="absolute top-10 right-40 w-24 h-24 bg-slate-900 rotate-45" />
      <div className="absolute top-40 right-10 w-20 h-20 bg-yellow-400 -rotate-12" />
      
      {/* Bottom left decorations */}
      <div className="absolute bottom-20 -left-10 w-36 h-36 bg-yellow-400 rotate-45" />
      <div className="absolute bottom-40 left-20 w-28 h-28 rotate-12" style={{ backgroundColor: '#F97354' }} />
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
  )
}

function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-gray-300 text-slate-800"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Button>
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4 relative" style={{ backgroundColor: '#1e293b' }}>
      <GeometricBackground />
      
      <div className="bg-white rounded-2xl shadow-2xl px-8 pb-8 w-full max-w-md z-10">
        {/* Logo */}
        <div className="mb-6">
          <VibeLedgerLogo />
        </div>

        {/* Welcome Text */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">환영합니다!</h1>
          <p className="text-slate-600 text-sm">VibeLedger</p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">이메일</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 border-yellow-400 focus:border-yellow-500 focus:ring-yellow-500"
                placeholder=""
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">비밀번호</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12 border-yellow-400 focus:border-yellow-500 focus:ring-yellow-500"
                placeholder=""
              />
            </div>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full h-12 text-white font-medium rounded-lg"
            style={{ backgroundColor: '#F97354' }}
          >
            로그인
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300" />
          <span className="px-4 text-sm text-gray-500">or sign in with</span>
          <div className="flex-1 border-t border-gray-300" />
        </div>

        {/* Social Login */}
        <div className="flex justify-center gap-3">
          <SocialButton
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
              </svg>
            }
            label="Apple"
          />
          <SocialButton
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            }
            label="Google"
          />
          <SocialButton
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            }
            label="GitHub"
          />
        </div>

        {/* Footer Links */}
        <div className="flex justify-between mt-6 text-sm">
          <a href="#" className="text-slate-700 hover:text-slate-900 font-medium">
            비밀번호를 잊으셨나요?
          </a>
          <div className="text-slate-600">
            계정이 없으신가요?{" "}
            <a href="#" className="text-slate-800 font-bold hover:text-slate-900">
              회원가입
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
