'use client';

import { useEffect } from 'react';
import { AppShellLoader } from '@/components/common/AppShellLoader';
import { useNavigationStore } from '@/stores/navigationStore';

export function AppEntryOverlay() {
  const showAppEntryOverlay = useNavigationStore(
    state => state.showAppEntryOverlay
  );

  useEffect(() => {
    if (!showAppEntryOverlay) return;

    const timeoutId = window.setTimeout(() => {
      useNavigationStore.getState().setShowAppEntryOverlay(false);
    }, 8000);

    return () => window.clearTimeout(timeoutId);
  }, [showAppEntryOverlay]);

  if (!showAppEntryOverlay) return null;

  return (
    <div className="fixed inset-0 z-[600]">
      <AppShellLoader message="대시보드로 이동 중..." />
    </div>
  );
}
