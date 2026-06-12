'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { exchangeAuthCodeOnce } from '@/lib/auth/callback-exchange';
import { getSafeNextPath } from '@/lib/security/redirect';
import Spinner from '@/components/common/Spinner';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message] = useState('로그인 처리 중...');

  useEffect(() => {
    let cancelled = false;

    const handleCallback = async () => {
      const oauthError = searchParams.get('error');
      const code = searchParams.get('code');
      const next = getSafeNextPath(searchParams.get('next'));

      if (oauthError || !code) {
        if (!cancelled) {
          router.replace('/login?error=auth_callback_failed');
        }
        return;
      }

      const supabase = createClient();
      const waitForSession = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        return !!session;
      };

      const { error } = await exchangeAuthCodeOnce(
        code,
        () => supabase.auth.exchangeCodeForSession(code),
        waitForSession
      );

      if (cancelled) return;

      if (error) {
        console.error('Auth callback exchange error:', error);

        if (await waitForSession()) {
          router.replace(next);
          return;
        }

        router.replace('/login?error=auth_callback_failed');
        return;
      }

      router.replace(next);
    };

    void handleCallback();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50">
      <Spinner size="lg" />
      <p className="text-sm text-slate-600">{message}</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <Spinner size="lg" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
