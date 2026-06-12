import { createClient } from '@/lib/supabase/client';

export type SocialProvider = 'google' | 'kakao';

const SOCIAL_PROVIDER_LABEL: Record<SocialProvider, string> = {
  google: 'Google',
  kakao: 'Kakao',
};

export async function signInWithSocialProvider(
  provider: SocialProvider
): Promise<{ success: true } | { success: false; message: string }> {
  const supabase = createClient();
  const providerLabel = SOCIAL_PROVIDER_LABEL[provider];

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      queryParams:
        provider === 'google'
          ? {
              access_type: 'offline',
              prompt: 'consent',
            }
          : undefined,
      scopes: provider === 'kakao' ? 'profile_nickname' : undefined,
    },
  });

  if (error) {
    console.error(`${providerLabel} OAuth error:`, error);
    return {
      success: false,
      message: `${providerLabel} 로그인에 실패했습니다. 다시 시도해주세요.`,
    };
  }

  return { success: true };
}
