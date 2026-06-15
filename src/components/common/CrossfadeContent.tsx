'use client';

import { cn } from '@/lib/utils';

type CrossfadeContentProps = {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function CrossfadeContent({
  isLoading,
  skeleton,
  children,
  className,
}: CrossfadeContentProps) {
  return (
    <div className={cn('relative min-h-0', className)}>
      <div
        aria-hidden={!isLoading}
        className={cn(
          'absolute inset-0 z-10 min-h-0 transition-opacity duration-300',
          isLoading ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        {skeleton}
      </div>
      <div
        className={cn(
          'h-full min-h-0 transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      >
        {!isLoading && children}
      </div>
    </div>
  );
}
