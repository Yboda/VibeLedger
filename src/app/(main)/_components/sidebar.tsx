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
import { usePathname } from 'next/navigation';

// Sidebar Navigation Item
function NavItem({
  icon: Icon,
  label,
  active = false,
  href = '#',
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 mx-3 rounded-lg cursor-pointer transition-colors ${
        active ? 'bg-[#F97354] text-white' : 'text-white hover:bg-slate-700'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

// Sidebar Decorative Shapes
function SidebarDecoration() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden">
      <div className="absolute bottom-8 left-4 w-20 h-20 bg-yellow-400 rounded-sm rotate-12" />
      <div className="absolute bottom-20 right-4 w-16 h-16 bg-[#F97354] rounded-full" />
      <div className="absolute bottom-4 right-8 w-12 h-12 bg-slate-900 rounded-sm -rotate-12" />
      <div className="absolute bottom-16 left-8 flex flex-col items-center">
        <div className="w-6 h-6 bg-yellow-400 rounded-full" />
        <div className="w-10 h-8 bg-yellow-400 rounded-t-full mt-1" />
      </div>
    </div>
  );
}

// Sidebar Component
export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-56 bg-slate-800 min-h-screen relative flex flex-col">
      <div className="py-4 pr-1">
        <VibeLedgerLogo variant="dark" height="h-26" />
      </div>
      <nav className="flex flex-col gap-1 mt-4">
        <NavItem
          icon={LayoutDashboard}
          label="Dashboard"
          href="/dashboard"
          active={pathname === '/dashboard'}
        />
        <NavItem
          icon={ArrowLeftRight}
          label="Transactions"
          href="/transactions"
          active={pathname.startsWith('/transactions')}
        />
        <NavItem
          icon={PiggyBank}
          label="Budgets"
          href="/budgets"
          active={pathname.startsWith('/budgets')}
        />
        <NavItem
          icon={BarChart3}
          label="Analytics"
          href="/analytics"
          active={pathname.startsWith('/analytics')}
        />
      </nav>

      {/* Add Transaction Button */}
      <div className="px-3 mt-6">
        <Link
          href="/dashboard/transactions/new"
          className="flex items-center justify-center gap-2 w-full py-3 bg-[#F97354] hover:bg-[#e86344] text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>지출 등록</span>
        </Link>
      </div>

      <SidebarDecoration />
    </div>
  );
}
