'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LoginFormData } from '@/lib/validations/auth'
import { z } from 'zod'

export async function login(data: LoginFormData) {
  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      console.error('Login error:', error)
      
      // 사용자에게 보여줄 에러 메시지
      let errorMessage = '로그인에 실패했습니다.'
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = '이메일 또는 비밀번호가 잘못되었습니다.'
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = '이메일 인증이 필요합니다. 이메일을 확인해주세요.'
      } else if (error.message.includes('Too many requests')) {
        errorMessage = '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.'
      }

      return { success: false, message: errorMessage }
    }

    // 로그인 성공 시 루트 페이지로 이동
    redirect('/')
  } catch (error) {
    console.error('Unexpected login error:', error)
    return { success: false, message: '서버 오류가 발생했습니다. 다시 시도해주세요.' }
  }
}