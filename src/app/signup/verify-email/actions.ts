'use server';

import { createClient } from '@/lib/supabase/server';

export async function resendVerificationEmail(email: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      console.error('Resend error:', error);

      let errorMessage = '이메일 재전송에 실패했습니다.';

      if (error.message.includes('Too many requests')) {
        errorMessage =
          '너무 많은 요청이 있었습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.message.includes('Email not found')) {
        errorMessage = '등록되지 않은 이메일입니다.';
      }

      return { success: false, message: errorMessage };
    }

    return { success: true, message: '인증 메일이 다시 전송되었습니다.' };
  } catch (error) {
    console.error('Unexpected resend error:', error);
    return {
      success: false,
      message: '서버 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }
}
