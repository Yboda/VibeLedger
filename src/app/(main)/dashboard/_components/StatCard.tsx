import { type ReactNode } from 'react';
import { StatValueSkeleton } from './dashboard-skeletons';

export function StatCard({
  title,
  value,
  chart,
  isLoading,
}: {
  title: string;
  value: string;
  chart?: ReactNode;
  isLoading?: boolean;
}) {
  return (
    <div className="flex h-full flex-col rounded-xl bg-white p-4 shadow-sm">
      <p className="mb-1 text-sm text-slate-600">{title}</p>
      <div className="mb-2 h-8">
        {isLoading ? (
          <StatValueSkeleton />
        ) : (
          <p className="text-2xl font-bold text-slate-800">{value}</p>
        )}
      </div>
      {chart && <div className="mt-auto">{chart}</div>}
    </div>
  );
}
