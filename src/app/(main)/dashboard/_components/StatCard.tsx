import { type ReactNode } from 'react';

export function StatCard({
  title,
  value,
  chart,
}: {
  title: string;
  value: string;
  chart?: ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-slate-600 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {chart && <div className="mt-2">{chart}</div>}
    </div>
  );
}
