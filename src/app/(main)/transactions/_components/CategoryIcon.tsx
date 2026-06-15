import { CategoryIconGlyph } from '@/lib/category-icons';
import { type Transaction } from '@/lib/api/transactions';

export function CategoryIcon({
  category,
}: {
  category: Transaction['categories'];
}) {
  const bg = category?.color ?? '#6B7280';

  return (
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center"
      style={{ backgroundColor: bg }}
    >
      <CategoryIconGlyph icon={category?.icon} className="w-5 h-5 text-white" />
    </div>
  );
}
