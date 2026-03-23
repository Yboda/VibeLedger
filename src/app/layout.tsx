import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { SupabaseProvider } from '@/providers/supabase-provider';

export const metadata: Metadata = {
  title: 'VibeLedger',
  description: '가계부 관리 애플리케이션',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <QueryProvider>
          <SupabaseProvider>{children}</SupabaseProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
