'use client';

import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type Transaction, type TransactionType } from '@/lib/api/transactions';
import { useCategoriesQuery } from '../_api/useCategoriesQuery';
import { useCreateTransactionMutation } from '../_api/useCreateTransactionMutation';
import { useUpdateTransactionMutation } from '../_api/useUpdateTransactionMutation';
import { parseTransactionText } from '@/actions/llm';
import { toast } from 'sonner';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  editing?: Transaction | null;
}

export function TransactionModal({
  open,
  onClose,
  editing,
}: TransactionModalProps) {
  const { data: categories = [], isError: categoriesError } =
    useCategoriesQuery();
  const createMutation = useCreateTransactionMutation();
  const updateMutation = useUpdateTransactionMutation();

  const initType = (editing?.categories?.type as TransactionType) ?? 'EXPENSE';
  const initCategoryId =
    editing?.category_id ??
    categories.find(c => c.type === initType)?.id ??
    null;

  const [type, setType] = useState<TransactionType>(initType);
  const [amount, setAmount] = useState(
    editing ? String(Math.round(editing.amount)) : ''
  );
  const [description, setDescription] = useState(editing?.description ?? '');
  const [date, setDate] = useState(
    editing ? editing.date.slice(0, 10) : new Date().toISOString().slice(0, 10)
  );
  const [categoryId, setCategoryId] = useState<number | null>(initCategoryId);
  const [errorMsg, setErrorMsg] = useState('');

  // AI 입력 상태
  const [aiText, setAiText] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const isEditing = !!editing;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const filteredCategories = categories.filter(c => c.type === type);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setAmount(raw);
  };

  const displayAmount = amount
    ? parseInt(amount, 10).toLocaleString('ko-KR')
    : '';

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (!isEditing) {
      const first = categories.find(c => c.type === newType);
      setCategoryId(first?.id ?? null);
    }
  };

  // AI 파싱 실행
  const handleAiParse = async () => {
    if (!aiText.trim()) return;
    setIsParsing(true);
    setErrorMsg('');

    try {
      const categoryNames = categories.map(c => c.name);
      const categoryTypes: Record<string, 'EXPENSE' | 'INCOME'> =
        Object.fromEntries(categories.map(c => [c.name, c.type]));

      const result = await parseTransactionText(
        aiText,
        categoryNames,
        categoryTypes
      );

      if (result.error || !result.data) {
        toast.error(result.error ?? 'AI 파싱에 실패했습니다.');
        return;
      }

      const parsed = result.data;

      // 파싱 결과를 폼 필드에 자동 입력
      setType(parsed.type);
      setAmount(String(parsed.amount));
      setDate(parsed.date);
      setDescription(parsed.description);

      // 카테고리 매칭 (이름 → id)
      const matched = categories.find(
        c => c.name === parsed.categoryName && c.type === parsed.type
      );
      if (matched) {
        setCategoryId(matched.id);
      } else {
        // 완전 일치 없을 경우 type이라도 맞는 첫 번째 선택
        const fallback = categories.find(c => c.type === parsed.type);
        setCategoryId(fallback?.id ?? null);
        toast.info(
          `"${parsed.categoryName}" 카테고리를 찾지 못해 자동 선택했습니다.`
        );
      }

      toast.success('AI가 내용을 자동으로 채웠습니다. 확인 후 저장해주세요.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg('올바른 금액을 입력하세요.');
      return;
    }
    if (!date) {
      setErrorMsg('날짜를 선택하세요.');
      return;
    }
    if (!categoryId) {
      setErrorMsg('카테고리를 선택하세요.');
      return;
    }

    const input = {
      amount: parsedAmount,
      description: description.trim() || null,
      date: new Date(date).toISOString(),
      category_id: categoryId,
    };

    if (isEditing) {
      const result = await updateMutation.mutateAsync({
        id: editing!.id,
        input,
      });
      if (result.error) {
        setErrorMsg(result.error);
        return;
      }
    } else {
      const result = await createMutation.mutateAsync(input);
      if (result.error) {
        setErrorMsg(result.error);
        return;
      }
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={isPending ? undefined : onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        {/* 저장 중 오버레이 */}
        {isPending && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-[2px] rounded-2xl">
            <div className="w-8 h-8 border-4 border-[#F97354]/30 border-t-[#F97354] rounded-full animate-spin" />
            <p className="text-sm font-medium text-slate-600">저장하는 중...</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">
            {isEditing ? '거래 수정' : '거래 추가'}
          </h2>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI 자연어 입력 (신규 추가, 수정 모드에서는 숨김) */}
        {!isEditing && (
          <div className="mb-5 p-4 bg-gradient-to-r from-slate-50 to-orange-50 rounded-xl border border-orange-100">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-[#F97354]" />
              <span className="text-sm font-medium text-slate-700">
                AI로 빠르게 입력
              </span>
              <span className="text-xs text-slate-400 ml-1">(선택사항)</span>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                value={aiText}
                onChange={e => setAiText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    void handleAiParse();
                  }
                }}
                placeholder="예: 어제 스타벅스 아메리카노 4500원"
                className="flex-1 text-sm"
                disabled={isParsing}
              />
              <Button
                type="button"
                onClick={() => void handleAiParse()}
                disabled={isParsing || !aiText.trim()}
                className="bg-[#F97354] hover:bg-[#e86344] text-white text-sm px-3 shrink-0"
              >
                {isParsing ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    파싱 중
                  </span>
                ) : (
                  '파싱하기'
                )}
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              Enter 또는 버튼을 누르면 AI가 아래 필드를 자동으로 채워줍니다
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 거래 유형 */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => handleTypeChange('EXPENSE')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                type === 'EXPENSE'
                  ? 'bg-white text-red-500 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              지출
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('INCOME')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                type === 'INCOME'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              수입
            </button>
          </div>

          {/* 금액 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              금액 (₩)
            </label>
            <Input
              type="text"
              inputMode="numeric"
              value={displayAmount}
              onChange={handleAmountChange}
              placeholder="0"
              className="text-right text-lg font-semibold"
            />
          </div>

          {/* 날짜 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              날짜
            </label>
            <Input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              카테고리 <span className="text-red-500">*</span>
            </label>
            {categoriesError ? (
              <p className="text-sm text-red-500 py-2">
                카테고리 목록을 불러오지 못했습니다. RLS 정책을 확인하세요.
              </p>
            ) : (
              <select
                value={categoryId ?? ''}
                onChange={e =>
                  setCategoryId(e.target.value ? Number(e.target.value) : null)
                }
                required
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="" disabled>
                  카테고리 선택
                </option>
                {filteredCategories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 메모 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              메모 (선택사항)
            </label>
            <Input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="거래 내용을 입력하세요"
            />
          </div>

          {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isPending}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#F97354] hover:bg-[#e86344] text-white"
              disabled={isPending}
            >
              {isPending ? '저장 중...' : isEditing ? '수정 완료' : '추가'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
