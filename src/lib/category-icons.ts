import { createElement, type SVGProps } from 'react';
import {
  BookOpen,
  Briefcase,
  Bus,
  Car,
  CircleEllipsis,
  CirclePlus,
  Coffee,
  Gift,
  Heart,
  HeartPulse,
  Home,
  MoreHorizontal,
  Music,
  ShoppingBag,
  Smartphone,
  Ticket,
  TrendingUp,
  Utensils,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

/** DB categories.icon 값 → Lucide 아이콘 (시드: scripts/category-seed-data.mjs) */
export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  utensils: Utensils,
  coffee: Coffee,
  bus: Bus,
  'shopping-bag': ShoppingBag,
  home: Home,
  'heart-pulse': HeartPulse,
  ticket: Ticket,
  'book-open': BookOpen,
  'circle-ellipsis': CircleEllipsis,
  'briefcase-business': Briefcase,
  wallet: Wallet,
  'trending-up': TrendingUp,
  'circle-plus': CirclePlus,
  // 이전 시드/수동 입력 호환
  car: Car,
  smartphone: Smartphone,
  heart: Heart,
  music: Music,
  briefcase: Briefcase,
  gift: Gift,
};

type CategoryIconGlyphProps = SVGProps<SVGSVGElement> & {
  icon: string | null | undefined;
};

/** 렌더 중 동적 컴포넌트 생성을 피하기 위해 createElement로 아이콘을 그립니다. */
export function CategoryIconGlyph({ icon, ...props }: CategoryIconGlyphProps) {
  const resolved = icon ? CATEGORY_ICON_MAP[icon] : undefined;
  return createElement(resolved ?? MoreHorizontal, props);
}
