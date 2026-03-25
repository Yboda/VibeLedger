'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SignupFormData } from '@/lib/validations/signup';

export async function signup(data: SignupFormData) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          display_name: data.name,
        },
      },
    });

    if (error) {
      console.error('Signup error:', error);

      let errorMessage = '회원가입에 실패했습니다.';

      switch (error.code) {
        case 'over_email_send_rate_limit':
          errorMessage =
            '짧은 시간에 너무 많은 메일이 발송되었습니다. 잠시 후 다시 시도해주세요.';
          break;
        case 'user_already_exists':
          errorMessage = '이미 가입된 이메일입니다.';
          break;
        case 'weak_password':
          errorMessage =
            '비밀번호가 너무 취약합니다. 더 복잡한 비밀번호를 입력해주세요.';
          break;
        case 'invalid_credentials':
          errorMessage = '이메일 또는 비밀번호 형식이 올바르지 않습니다.';
          break;
        case 'email_address_invalid':
          errorMessage = '유효하지 않은 이메일 주소입니다.';
          break;
        case 'request_timeout':
          errorMessage =
            '요청 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.';
          break;
        default:
          // 예상치 못한 에러일 경우 기존 메시지 유지 또는 상세 메시지 노출
          errorMessage = error.message || '서버 오류가 발생했습니다.';
      }

      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('Unexpected signup error:', error);
    return {
      success: false,
      message: '서버 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }

  redirect(
    `/signup/verify-email?email=${encodeURIComponent(data.email)}&from=signup`
  );
}
