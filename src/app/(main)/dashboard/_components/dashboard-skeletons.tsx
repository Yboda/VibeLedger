export {
  BudgetListSkeleton,
  HorizontalBarChartSkeleton,
  MonthlyTrendChartSkeleton,
  StatValueSkeleton,
  TransactionTableSkeleton,
} from '@/components/common/skeletons';

/** 대시보드 섹션별 고정 높이 */
export const DASHBOARD_LAYOUT = {
  statsRow: 132,
  chartsRow: 252,
  chartArea: 176,
} as const;

export const DASHBOARD_HEIGHTS = {
  trendChart: DASHBOARD_LAYOUT.chartArea,
  budgetList: DASHBOARD_LAYOUT.chartArea,
  statCard: DASHBOARD_LAYOUT.statsRow,
} as const;
