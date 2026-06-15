'use client';

import { useEffect, type ReactNode } from 'react';
import { useNavigationStore } from '@/stores/navigationStore';

export function MainLayoutHydrator({ children }: { children: ReactNode }) {
  useEffect(() => {
    useNavigationStore.getState().setShowAppEntryOverlay(false);
  }, []);

  return children;
}
