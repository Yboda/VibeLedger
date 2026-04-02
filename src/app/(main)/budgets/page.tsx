'use client';

import {
  Plus,
  Utensils,
  Home,
  ShoppingBag,
  Car,
  Smartphone,
  Coffee,
  Film,
  Dumbbell,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// Header
function Header() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">예산 관리</h1>
        <p className="text-slate-500 text-sm">
          카테고리별 예산을 설정하고 지출을 관리하세요
        </p>
      </div>
      <Button className="bg-[#F97354] hover:bg-[#e86344] text-white flex items-center gap-2">
        <Plus className="w-4 h-4" />새 예산 추가
      </Button>
    </div>
  );
}

// Overall Budget Summary
function BudgetSummary() {
  const totalBudget = 2000;
  const totalSpent = 847.79;
  const remaining = totalBudget - totalSpent;
  const percentage = (totalSpent / totalBudget) * 100;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-slate-500 text-sm">이번 달 전체 예산</p>
          <p className="text-3xl font-bold text-slate-800">
            ${totalBudget.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-slate-500 text-sm">남은 예산</p>
          <p className="text-2xl font-bold text-green-600">
            ${remaining.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#F97354] to-[#FBBF24] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-slate-600">
          사용: ${totalSpent.toLocaleString()} ({percentage.toFixed(1)}%)
        </span>
        <span className="text-slate-500">
          목표까지 ${remaining.toLocaleString()} 남음
        </span>
      </div>
    </div>
  );
}

// Category Budget Card
function BudgetCard({
  icon: Icon,
  iconBg,
  category,
  budget,
  spent,
  color,
}: {
  icon: React.ElementType;
  iconBg: string;
  category: string;
  budget: number;
  spent: number;
  color: string;
}) {
  const percentage = Math.min((spent / budget) * 100, 100);
  const remaining = budget - spent;
  const isOverBudget = spent > budget;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: iconBg }}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{category}</h3>
            <p className="text-sm text-slate-500">월 예산</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Pencil className="w-4 h-4 text-slate-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-end mb-3">
        <div>
          <p className="text-2xl font-bold text-slate-800">
            ${spent.toFixed(2)}
          </p>
          <p className="text-sm text-slate-500">/ ${budget.toFixed(2)}</p>
        </div>
        <div
          className={`text-right ${isOverBudget ? 'text-red-500' : 'text-green-600'}`}
        >
          <p className="text-sm font-medium">
            {isOverBudget ? '초과' : '남음'}
          </p>
          <p className="font-semibold">${Math.abs(remaining).toFixed(2)}</p>
        </div>
      </div>

      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : ''}`}
          style={{
            width: `${percentage}%`,
            backgroundColor: isOverBudget ? undefined : color,
          }}
        />
      </div>

      <p className="text-xs text-slate-500 mt-2 text-right">
        {percentage.toFixed(0)}% 사용
      </p>
    </div>
  );
}

// Budget Cards Grid
function BudgetCardsGrid() {
  const budgets = [
    {
      icon: Utensils,
      iconBg: '#FBBF24',
      category: '식비',
      budget: 400,
      spent: 234.5,
      color: '#FBBF24',
    },
    {
      icon: Home,
      iconBg: '#F97354',
      category: '주거비',
      budget: 500,
      spent: 350.0,
      color: '#F97354',
    },
    {
      icon: Car,
      iconBg: '#3B82F6',
      category: '교통비',
      budget: 150,
      spent: 89.0,
      color: '#3B82F6',
    },
    {
      icon: ShoppingBag,
      iconBg: '#8B5CF6',
      category: '쇼핑',
      budget: 200,
      spent: 45.9,
      color: '#8B5CF6',
    },
    {
      icon: Coffee,
      iconBg: '#A16207',
      category: '카페/간식',
      budget: 100,
      spent: 78.39,
      color: '#A16207',
    },
    {
      icon: Film,
      iconBg: '#EC4899',
      category: '여가/문화',
      budget: 150,
      spent: 25.0,
      color: '#EC4899',
    },
    {
      icon: Dumbbell,
      iconBg: '#10B981',
      category: '건강/운동',
      budget: 100,
      spent: 25.0,
      color: '#10B981',
    },
    {
      icon: Smartphone,
      iconBg: '#1e3a5f',
      category: '통신비',
      budget: 80,
      spent: 0,
      color: '#1e3a5f',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {budgets.map((budget, index) => (
        <BudgetCard key={index} {...budget} />
      ))}
    </div>
  );
}

// Monthly Comparison
function MonthlyComparison() {
  const months = [
    { month: '9월', budget: 2000, spent: 1654 },
    { month: '10월', budget: 2000, spent: 1823 },
    { month: '11월', budget: 2000, spent: 1567 },
    { month: '12월', budget: 2000, spent: 847.79 },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        월별 예산 사용 추이
      </h3>
      <div className="flex items-end gap-4 h-48">
        {months.map((m, i) => {
          const percentage = (m.spent / m.budget) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gray-100 rounded-t-lg relative"
                style={{ height: '160px' }}
              >
                <div
                  className="absolute bottom-0 w-full rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${percentage}%`,
                    background: `linear-gradient(to top, #F97354, #FBBF24)`,
                  }}
                />
              </div>
              <p className="text-sm font-medium text-slate-700 mt-2">
                {m.month}
              </p>
              <p className="text-xs text-slate-500">
                ${m.spent.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Main Budgets Page
export default function BudgetsPage() {
  return (
    <>
      <Header />
      <BudgetSummary />
      <BudgetCardsGrid />
      <MonthlyComparison />
    </>
  );
}
