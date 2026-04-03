export function TotalBalanceCard() {
  return (
    <div className="bg-brand-coral rounded-xl p-5 text-white relative overflow-hidden col-span-2">
      <div className="relative z-10">
        <p className="text-white/90 text-sm mb-1">Total Balance</p>
        <p className="text-3xl font-bold">₩1,675.52</p>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <svg width="100" height="60" viewBox="0 0 100 60" fill="none">
          <path
            d="M10 50 L30 30 L50 40 L70 20 L90 10"
            stroke="var(--color-brand-yellow)"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M70 20 L90 10 L90 20 L70 20"
            fill="var(--color-brand-yellow)"
          />
          <rect
            x="60"
            y="35"
            width="8"
            height="25"
            fill="var(--color-brand-navy)"
          />
          <rect
            x="72"
            y="25"
            width="8"
            height="35"
            fill="var(--color-brand-yellow)"
          />
          <rect
            x="84"
            y="30"
            width="8"
            height="30"
            fill="var(--color-brand-navy)"
          />
        </svg>
      </div>
    </div>
  );
}
