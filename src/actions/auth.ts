'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LoginFormData } from '@/lib/validations/auth';
import { SignupFormData } from '@/lib/validations/signup';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// 로그인
export async function login(data: LoginFormData) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      console.error('Login error:', error);

      let errorMessage = '로그인에 실패했습니다.';

      switch (error.code) {
        case 'invalid_credentials':
          // 보안을 위해 이메일 존재 여부와 비밀번호 틀림을 구분하지 않고 통일하는 것이 정석입니다.
          errorMessage = '이메일 또는 비밀번호가 일치하지 않습니다.';
          break;
        case 'email_not_confirmed':
          errorMessage =
            '이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.';
          break;
        case 'too_many_requests':
          errorMessage =
            '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.';
          break;
        case 'user_not_found':
          errorMessage = '존재하지 않는 계정입니다.';
          break;
        case 'user_banned':
          errorMessage = '관리자에 의해 정지된 계정입니다.';
          break;
        case 'request_timeout':
          errorMessage =
            '서버 연결 시간이 초과되었습니다. 네트워크를 확인해주세요.';
          break;
        default:
          errorMessage = error.message || '서버 오류가 발생했습니다.';
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('Unexpected login error:', error);
    return {
      success: false,
      message: '서버 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }

  return { success: true };
}

// 회원가입
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

// 이메일 재전송
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

      if (error.code === 'over_email_send_rate_limit') {
        errorMessage =
          '짧은 시간에 너무 많은 메일이 발송되었습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.code === 'email_address_invalid') {
        errorMessage = '유효하지 않은 이메일 주소입니다.';
      } else if (error.code === 'request_timeout') {
        errorMessage =
          '요청 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.';
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

// 비밀번호 재설정 메일 발송
export async function resetPassword(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // 이메일 링크 클릭 시 돌아올 콜백 경로
    redirectTo: `${baseUrl}/auth/callback?next=/update-password`,
  });

  if (error) {
    console.error('Password reset error:', error);
    return { success: false, message: '재설정 메일 발송에 실패했습니다.' };
  }

  return { success: true, message: '비밀번호 재설정 메일이 발송되었습니다.' };
}

// 비밀번호 재설정
export async function updatePassword(newPassword: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}
