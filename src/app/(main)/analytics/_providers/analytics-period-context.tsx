'use client';

import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from 'react';

export type AnalyticsPeriod = 'week' | 'month' | 'year';

interface PeriodRange {
  startDate: string; // ISO string
  endDate: string; // ISO string
}

interface AnalyticsPeriodContextValue {
  period: AnalyticsPeriod;
  setPeriod: (p: AnalyticsPeriod) => void;
  startDate: string;
  endDate: string;
}

function getPeriodRange(period: AnalyticsPeriod): PeriodRange {
  const now = new Date();

  if (period === 'week') {
    // 이번 주 월요일 ~ 일요일
    const day = now.getDay(); // 0(일)~6(토)
    const diff = day === 0 ? -6 : 1 - day; // 월요일까지의 차이
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return { startDate: monday.toISOString(), endDate: sunday.toISOString() };
  }

  if (period === 'year') {
    const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  }

  // month (기본)
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
  return { startDate: start.toISOString(), endDate: end.toISOString() };
}

const AnalyticsPeriodContext =
  createContext<AnalyticsPeriodContextValue | null>(null);

export function AnalyticsPeriodProvider({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState<AnalyticsPeriod>('month');

  const value = useMemo(() => {
    const { startDate, endDate } = getPeriodRange(period);
    return { period, setPeriod, startDate, endDate };
  }, [period]);

  return (
    <AnalyticsPeriodContext.Provider value={value}>
      {children}
    </AnalyticsPeriodContext.Provider>
  );
}

export function useAnalyticsPeriod() {
  const ctx = useContext(AnalyticsPeriodContext);
  if (!ctx) {
    throw new Error(
      'useAnalyticsPeriod는 AnalyticsPeriodProvider 내부에서 사용해야 합니다.'
    );
  }
  return ctx;
}
