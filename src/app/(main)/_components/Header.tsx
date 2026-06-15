'use client';

import { useHeaderConfig } from '../_providers/header-context';

function DateDisplay() {
  return (
    <span className="text-sm text-slate-500">
      {new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      })}
    </span>
  );
}

function HeaderSkeleton() {
  return (
    <>
      <div className="flex min-h-[52px] flex-col justify-center gap-1.5">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
        <div className="h-8 w-56 max-w-[50vw] animate-pulse rounded bg-slate-100" />
      </div>
      <div className="h-4 w-40 shrink-0 animate-pulse rounded bg-slate-100" />
    </>
  );
}

export function Header() {
  const config = useHeaderConfig();

  const hasTitleLine = Boolean(
    config.title || config.titleHighlight || config.titleSuffix
  );
  const hasContent = hasTitleLine || config.subtitle || config.description;
  const isReady = hasContent || config.action || config.showDate;

  return (
    <header className="flex h-[84px] shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
      {!isReady ? (
        <HeaderSkeleton />
      ) : (
        <>
          <div className="flex min-h-[52px] flex-col justify-center">
            {config.subtitle ? (
              <p className="text-sm leading-5 text-slate-500">
                {config.subtitle}
              </p>
            ) : null}
            {config.titleLoading ? (
              <div
                className="h-8 w-48 max-w-[50vw] animate-pulse rounded bg-slate-100"
                aria-hidden
              />
            ) : hasTitleLine ? (
              <h1 className="min-h-8 text-2xl font-bold leading-8 text-slate-800">
                {config.titleHighlight ? (
                  <span className="text-[#F97354]">
                    {config.titleHighlight}
                  </span>
                ) : null}
                {config.titleSuffix ?? config.title}
              </h1>
            ) : null}
            {config.description ? (
              <p className="text-sm leading-5 text-slate-500">
                {config.description}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {config.action}
            {config.showDate ? <DateDisplay /> : null}
          </div>
        </>
      )}
    </header>
  );
}
