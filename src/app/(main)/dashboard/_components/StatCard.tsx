import { type ReactNode } from 'react';
import Spinner from '@/components/common/Spinner';

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
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-slate-600 text-sm mb-1">{title}</p>
      {isLoading ? (
        <div className="h-8 flex items-center">
          <Spinner size="sm" />
        </div>
      ) : (
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      )}
      {chart && <div className="mt-2">{chart}</div>}
    </div>
  );
}
