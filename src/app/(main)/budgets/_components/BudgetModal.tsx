'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchCategories } from '@/lib/api/transactions';
import { BudgetWithSpending, BudgetRow } from '@/lib/api/budgets';

type AllocationRow = {
  categoryId: number;
  amount: string;
};

function parseAmountInput(value: string): string {
  return value.replace(/[^0-9]/g, '');
}

function formatAmountInput(value: string): string {
  if (!value) return '';
  return Number(value).toLocaleString('ko-KR');
}

interface BudgetModalProps {
  open: boolean;
  onClose: () => void;
  month: number;
  year: number;
  existingBudgets: BudgetWithSpending[];
  onSave: (rows: BudgetRow[]) => void;
  isSaving: boolean;
}

export function BudgetModal({
  open,
  onClose,
  month,
  year,
  existingBudgets,
  onSave,
  isSaving,
}: BudgetModalProps) {
  const { data: allCategories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const expenseCategories = allCategories.filter(c => c.type === 'EXPENSE');

  const [totalBudget, setTotalBudget] = useState<string>(() =>
    existingBudgets.length > 0
      ? String(existingBudgets.reduce((s, b) => s + b.budget_amount, 0))
      : ''
  );
  const [allocations, setAllocations] = useState<AllocationRow[]>(() =>
    existingBudgets.length > 0
      ? existingBudgets.map(b => ({
          categoryId: b.category_id,
          amount: String(b.budget_amount),
        }))
      : [{ categoryId: 0, amount: '' }]
  );

  const totalAllocated = allocations.reduce(
    (s, a) => s + (Number(a.amount) || 0),
    0
  );
  const totalBudgetNum = Number(totalBudget) || 0;
  const remaining = totalBudgetNum - totalAllocated;
  const allocationPct =
    totalBudgetNum > 0
      ? Math.min((totalAllocated / totalBudgetNum) * 100, 100)
      : 0;
  const isOver = remaining < 0;

  const usedIds = new Set(allocations.map(a => a.categoryId));

  const addRow = () => {
    const next = expenseCategories.find(c => !usedIds.has(c.id));
    if (next) setAllocations(p => [...p, { categoryId: next.id, amount: '' }]);
  };

  const removeRow = (idx: number) =>
    setAllocations(p => p.filter((_, i) => i !== idx));

  const updateCategory = (idx: number, val: string) =>
    setAllocations(p =>
      p.map((r, i) => (i === idx ? { ...r, categoryId: Number(val) } : r))
    );

  const updateAmount = (idx: number, val: string) =>
    setAllocations(p =>
      p.map((r, i) => (i === idx ? { ...r, amount: parseAmountInput(val) } : r))
    );

  const handleSave = () => {
    const rows: BudgetRow[] = allocations
      .filter(a => a.categoryId > 0 && Number(a.amount) > 0)
      .map(a => ({
        category_id: a.categoryId,
        amount: Number(a.amount),
        month,
        year,
      }));
    if (rows.length === 0) return;
    onSave(rows);
  };

  const canAddMore = expenseCategories.some(c => !usedIds.has(c.id));
  const canSave = allocations.some(
    a => a.categoryId > 0 && Number(a.amount) > 0
  );

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent
        className="max-w-lg"
        onInteractOutside={event => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {year}년 {month}월 예산 설정
          </DialogTitle>
          <DialogDescription>카테고리별 예산을 설정해주세요.</DialogDescription>
        </DialogHeader>

        {/* 총 예산 (참고용) */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            총 예산{' '}
            <span className="text-slate-400 font-normal">(배분 참고용)</span>
          </label>
          <div className="relative">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="예: 2,000,000"
              value={formatAmountInput(totalBudget)}
              onChange={e => setTotalBudget(parseAmountInput(e.target.value))}
              className="pr-7"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              원
            </span>
          </div>
        </div>

        {/* 배분 진행률 */}
        {totalBudgetNum > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-500">
              <span>배분: {totalAllocated.toLocaleString('ko-KR')}원</span>
              <span className={isOver ? 'text-red-500 font-medium' : ''}>
                {isOver
                  ? `${Math.abs(remaining).toLocaleString('ko-KR')}원 초과`
                  : `${remaining.toLocaleString('ko-KR')}원 남음`}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${isOver ? 'bg-red-500' : 'bg-[#F97354]'}`}
                style={{ width: `${allocationPct}%` }}
              />
            </div>
          </div>
        )}

        {/* 카테고리별 배분 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            카테고리별 배분
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {allocations.map((row, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Select
                  value={row.categoryId > 0 ? String(row.categoryId) : ''}
                  onValueChange={val => updateCategory(idx, val)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map(c => (
                      <SelectItem
                        key={c.id}
                        value={String(c.id)}
                        disabled={usedIds.has(c.id) && c.id !== row.categoryId}
                      >
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative w-36">
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="예: 300,000"
                    value={formatAmountInput(row.amount)}
                    onChange={e => updateAmount(idx, e.target.value)}
                    className="pr-6"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    원
                  </span>
                </div>

                <button
                  onClick={() => removeRow(idx)}
                  className="p-1.5 rounded-md text-slate-400 hover:bg-gray-100 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {canAddMore && (
          <button
            onClick={addRow}
            className="flex items-center gap-1.5 text-sm text-[#F97354] hover:underline"
          >
            <Plus className="w-4 h-4" />
            카테고리 추가
          </button>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button
            className="bg-[#F97354] hover:bg-[#e86344] text-white"
            onClick={handleSave}
            disabled={isSaving || !canSave}
          >
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
