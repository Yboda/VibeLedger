'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useIsRouteTransitioning } from '../_providers/navigation-context';
import { PageContentLoader } from './PageContentLoader';

export function MainContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isTransitioning = useIsRouteTransitioning();
  const isDashboard = pathname === '/dashboard';

  return (
    <main
      className={cn(
        'relative min-h-0 flex-1 p-6',
        isDashboard ? 'flex flex-col overflow-hidden' : 'overflow-y-auto'
      )}
    >
      {isTransitioning ? (
        <PageContentLoader />
      ) : isDashboard ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
      ) : (
        children
      )}
    </main>
  );
}
