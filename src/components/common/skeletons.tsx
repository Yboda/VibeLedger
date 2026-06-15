const MONTH_LABELS = 12;

export function StatValueSkeleton({
  large = false,
  className,
}: {
  large?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded bg-slate-100 ${large ? 'h-9 w-36' : 'h-8 w-28'} ${className ?? ''}`}
    />
  );
}

export function StatCardsRowSkeleton({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={`grid gap-4 ${className ?? ''}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
              <StatValueSkeleton />
            </div>
            <div className="h-12 w-12 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MonthlyTrendChartSkeleton() {
  const barHeights = [42, 68, 51, 82, 58, 74, 48, 88, 62, 76, 54, 70];

  return (
    <div className="flex h-full flex-col px-1 pb-1 pt-2">
      <div className="relative flex flex-1 items-end justify-between gap-1 border-b border-slate-100 pl-8 pr-1">
        <div className="absolute bottom-0 left-0 top-0 flex w-7 flex-col justify-between py-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-2.5 w-5 animate-pulse rounded bg-slate-100"
            />
          ))}
        </div>
        {barHeights.map((height, index) => (
          <div key={index} className="flex flex-1 items-end justify-center">
            <div
              className="w-full max-w-[28px] animate-pulse rounded-t bg-slate-100"
              style={{ height: `${height}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between gap-1 pl-8 pr-1">
        {Array.from({ length: MONTH_LABELS }).map((_, index) => (
          <div
            key={index}
            className="h-2.5 flex-1 animate-pulse rounded bg-slate-50"
          />
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-4">
        <div className="h-3 w-10 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-10 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}

export function PairedBarChartSkeleton({
  bars = 6,
  height = 192,
}: {
  bars?: number;
  height?: number;
}) {
  const barHeights = [55, 72, 48, 85, 60, 78, 52, 68, 44, 80, 58, 66];

  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {Array.from({ length: bars }).map((_, index) => (
        <div key={index} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="flex w-full items-end gap-1"
            style={{ height: height - 24 }}
          >
            <div
              className="flex-1 animate-pulse rounded-t bg-slate-100"
              style={{ height: `${barHeights[index % barHeights.length]}%` }}
            />
            <div
              className="flex-1 animate-pulse rounded-t bg-slate-200"
              style={{
                height: `${barHeights[(index + 2) % barHeights.length]}%`,
              }}
            />
          </div>
          <div className="h-2.5 w-6 animate-pulse rounded bg-slate-50" />
        </div>
      ))}
    </div>
  );
}

export function HorizontalBarChartSkeleton({ rows = 5 }: { rows?: number }) {
  const widths = [88, 72, 58, 45, 36];

  return (
    <div className="flex h-full flex-col justify-center gap-4 px-1">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="h-3.5 w-14 shrink-0 animate-pulse rounded bg-slate-100" />
          <div className="h-5 flex-1 overflow-hidden rounded bg-slate-50">
            <div
              className="h-full animate-pulse rounded bg-slate-100"
              style={{ width: `${widths[index] ?? 30}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TransactionTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="h-full [scrollbar-gutter:stable]">
      <div className="flex border-b border-gray-100 pb-2 text-sm">
        <div className="h-4 w-10 animate-pulse rounded bg-slate-100" />
        <div className="ml-auto flex gap-6 pr-3">
          <div className="h-4 w-10 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-14 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-12 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center py-2.5 pr-3">
            <div className="h-4 w-14 animate-pulse rounded bg-slate-100" />
            <div className="ml-6 h-4 w-24 animate-pulse rounded bg-slate-100" />
            <div className="ml-auto flex items-center gap-6">
              <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TransactionListSkeleton({ groups = 3 }: { groups?: number }) {
  return (
    <div>
      {Array.from({ length: groups }).map((_, groupIndex) => (
        <div key={groupIndex}>
          <div className="border-b border-gray-100 bg-gray-50 px-5 py-3">
            <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
          </div>
          {Array.from({ length: 2 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="flex items-center justify-between border-b border-gray-100 px-5 py-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100" />
                <div className="space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
              <div className="h-5 w-24 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function BudgetListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex h-full flex-col justify-between">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index}>
          <div className="mb-1 flex justify-between">
            <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="h-2 animate-pulse rounded-full bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

export function BudgetSummarySkeleton() {
  return (
    <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
          <StatValueSkeleton large />
        </div>
        <div className="space-y-2 text-right">
          <div className="ml-auto h-4 w-16 animate-pulse rounded bg-slate-100" />
          <div className="ml-auto h-8 w-32 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
      <div className="mb-2 h-4 animate-pulse rounded-full bg-slate-100" />
      <div className="flex justify-between">
        <div className="h-4 w-36 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}

export function BudgetCardsGridSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: cards }).map((_, index) => (
        <div key={index} className="rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="mb-3 h-7 w-28 animate-pulse rounded bg-slate-100" />
          <div className="mb-2 h-2 animate-pulse rounded-full bg-slate-100" />
          <div className="flex justify-between">
            <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-12 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DonutChartSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex h-full flex-col">
      <div
        className="relative mx-auto shrink-0"
        style={{ height: 160, width: 160 }}
      >
        <div className="absolute inset-4 animate-pulse rounded-full bg-slate-100" />
        <div className="absolute inset-12 rounded-full bg-white" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="mb-1 h-5 w-16 animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-10 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="h-7 w-7 shrink-0 animate-pulse rounded-lg bg-slate-100" />
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between">
                <div className="h-3.5 w-16 animate-pulse rounded bg-slate-100" />
                <div className="h-3.5 w-14 animate-pulse rounded bg-slate-100" />
              </div>
              <div className="h-1.5 animate-pulse rounded-full bg-slate-100" />
            </div>
            <div className="h-3 w-8 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function InsightCardsSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {Array.from({ length: cards }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border-l-4 border-slate-100 bg-slate-50 p-4"
        >
          <div className="mb-2 flex items-center gap-2">
            <div className="h-5 w-5 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-[80%] animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HeatmapSkeleton({
  weeks = 5,
  days = 7,
}: {
  weeks?: number;
  days?: number;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-2 pt-6">
        {Array.from({ length: weeks }).map((_, index) => (
          <div key={index} className="flex h-10 items-center">
            <div className="h-3 w-10 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
      <div className="flex-1">
        <div className="mb-2 flex gap-2">
          {Array.from({ length: days }).map((_, index) => (
            <div key={index} className="flex-1 flex justify-center">
              <div className="h-3 w-4 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {Array.from({ length: weeks }).map((_, weekIndex) => (
            <div key={weekIndex} className="flex gap-2">
              {Array.from({ length: days }).map((_, dayIndex) => (
                <div
                  key={dayIndex}
                  className="h-10 flex-1 animate-pulse rounded-lg bg-slate-100"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
