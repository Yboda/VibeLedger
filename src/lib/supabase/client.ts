import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // 콜백 페이지에서 code 교환을 한 번만 제어하기 위해 자동 교환 비활성화
        detectSessionInUrl: false,
      },
    }
  );
}
