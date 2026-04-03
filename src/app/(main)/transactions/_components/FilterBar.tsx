import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type TransactionType } from '@/lib/api/transactions';

export function FilterBar({
  filter,
  onFilterChange,
  search,
  onSearchChange,
}: {
  filter: 'all' | TransactionType;
  onFilterChange: (filter: 'all' | TransactionType) => void;
  search: string;
  onSearchChange: (search: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => onFilterChange('INCOME')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'INCOME'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
            }`}
          >
            수입
          </button>
          <button
            onClick={() => onFilterChange('EXPENSE')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'EXPENSE'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
            }`}
          >
            지출
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="거래 내역 검색..."
              className="pl-9 w-64 bg-gray-50 border-gray-200"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            필터
          </Button>
        </div>
      </div>
    </div>
  );
}
