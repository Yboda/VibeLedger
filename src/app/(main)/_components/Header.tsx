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

export function Header() {
  const config = useHeaderConfig();

  const hasContent =
    config.title ||
    config.titleHighlight ||
    config.subtitle ||
    config.description;

  if (!hasContent && !config.action && !config.showDate) return null;

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div>
        {config.subtitle && (
          <p className="text-slate-500 text-sm">{config.subtitle}</p>
        )}
        {(config.title || config.titleHighlight) && (
          <h1 className="text-2xl font-bold text-slate-800">
            {config.titleHighlight && (
              <span className="text-[#F97354]">{config.titleHighlight}</span>
            )}
            {config.titleSuffix ?? config.title}
          </h1>
        )}
        {config.description && (
          <p className="text-slate-500 text-sm">{config.description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {config.action}
        {config.showDate && <DateDisplay />}
      </div>
    </header>
  );
}
