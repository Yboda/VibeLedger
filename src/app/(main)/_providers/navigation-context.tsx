'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export function isNavActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') {
    return pathname === '/dashboard';
  }

  return pathname.startsWith(href);
}

type NavigationContextValue = {
  pendingPath: string | null;
  setPendingPath: (path: string | null) => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [pendingTarget, setPendingTarget] = useState<string | null>(null);
  const [pendingOrigin, setPendingOrigin] = useState<string | null>(null);

  const setPendingPath = (path: string | null) => {
    if (path === null) {
      setPendingTarget(null);
      setPendingOrigin(null);
      return;
    }

    setPendingTarget(path);
    setPendingOrigin(pathname);
  };

  const pendingPath =
    pendingTarget !== null &&
    pendingOrigin === pathname &&
    !isNavActive(pathname, pendingTarget)
      ? pendingTarget
      : null;

  return (
    <NavigationContext.Provider value={{ pendingPath, setPendingPath }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}

function useOptimisticPath(): string {
  const pathname = usePathname();
  const { pendingPath } = useNavigation();

  if (pendingPath && !isNavActive(pathname, pendingPath)) {
    return pendingPath;
  }

  return pathname;
}

export function useNavActive(href: string): boolean {
  return isNavActive(useOptimisticPath(), href);
}

export function useIsRouteTransitioning(): boolean {
  const pathname = usePathname();
  const { pendingPath } = useNavigation();
  return pendingPath !== null && !isNavActive(pathname, pendingPath);
}
