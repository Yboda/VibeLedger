import type { GenerateInsightsResult } from '@/actions/llm';

const PREFIX = 'vibe-ledger:ai-insights:';

export function readAiInsightsCache(
  key: string
): GenerateInsightsResult | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = sessionStorage.getItem(PREFIX + key);
    if (!raw) return undefined;
    return JSON.parse(raw) as GenerateInsightsResult;
  } catch {
    return undefined;
  }
}

export function writeAiInsightsCache(
  key: string,
  result: GenerateInsightsResult
): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(result));
  } catch {
    // storage quota 등 — 무시
  }
}
