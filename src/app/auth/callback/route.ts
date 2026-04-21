import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // next가 절대경로일 경우 origin을 붙여 리다이렉트
      const redirectUrl = next.startsWith('/')
        ? `${origin}${next}`
        : `${origin}/dashboard`;
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 코드 없거나 교환 실패 시 로그인으로 리다이렉트
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
