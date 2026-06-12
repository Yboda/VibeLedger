'use client';

import VibeLedgerLogo from '@/components/common/VibeLedgerLogo';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  BarChart3,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { useTransactionModal } from '../_providers/transaction-modal-context';
import { useNavigation, useNavActive } from '../_providers/navigation-context';

const NAV_ITEMS = [
  { href: '/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/transactions', label: '거래 내역', icon: ArrowLeftRight },
  { href: '/budgets', label: '예산', icon: PiggyBank },
  { href: '/analytics', label: '분석', icon: BarChart3 },
] as const;

function NavItem({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
}) {
  const active = useNavActive(href);
  const { setPendingPath } = useNavigation();

  return (
    <Link
      href={href}
      prefetch
      onClick={() => setPendingPath(href)}
      aria-current={active ? 'page' : undefined}
      className={`mx-3 flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 ${
        active
          ? 'bg-[#F97354] text-white'
          : 'text-white hover:bg-slate-700 transition-colors'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function SidebarDecoration() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden">
      <div className="absolute bottom-8 left-4 h-20 w-20 rotate-12 rounded-sm bg-yellow-400" />
      <div className="absolute bottom-20 right-4 h-16 w-16 rounded-full bg-[#F97354]" />
      <div className="absolute bottom-4 right-8 h-12 w-12 -rotate-12 rounded-sm bg-slate-900" />
      <div className="absolute bottom-16 left-8 flex flex-col items-center">
        <div className="h-6 w-6 rounded-full bg-yellow-400" />
        <div className="mt-1 h-8 w-10 rounded-t-full bg-yellow-400" />
      </div>
    </div>
  );
}

export function Sidebar() {
  const { openModal } = useTransactionModal();

  return (
    <div className="relative flex min-h-screen w-56 flex-col bg-slate-800">
      <div className="py-4 pr-1">
        <VibeLedgerLogo variant="dark" height="h-26" />
      </div>
      <nav className="mt-4 flex flex-col gap-1">
        {NAV_ITEMS.map(item => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      <div className="mt-6 px-3">
        <button
          type="button"
          onClick={() => openModal()}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F97354] py-3 font-medium text-white transition-colors hover:bg-[#e86344]"
        >
          <Plus className="h-5 w-5" />
          <span>지출 등록</span>
        </button>
      </div>

      <SidebarDecoration />
    </div>
  );
}
