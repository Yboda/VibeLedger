'use client';

import type { ReactNode } from 'react';
import { useIsRouteTransitioning } from '../_providers/navigation-context';
import { PageContentLoader } from './PageContentLoader';

export function MainContent({ children }: { children: ReactNode }) {
  const isTransitioning = useIsRouteTransitioning();

  return (
    <main className="relative flex-1 overflow-y-auto p-6">
      {isTransitioning ? <PageContentLoader /> : children}
    </main>
  );
}
