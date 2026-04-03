export function MiniLineChart({
  color = 'var(--color-brand-coral)',
}: {
  color?: string;
}) {
  return (
    <svg
      width="100%"
      height="30"
      viewBox="0 0 120 30"
      preserveAspectRatio="none"
    >
      <path
        d="M0 25 Q20 20 30 15 T60 20 T90 10 T120 15"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M0 25 Q20 20 30 15 T60 20 T90 10 T120 15 L120 30 L0 30 Z"
        fill={color}
        fillOpacity="0.1"
      />
    </svg>
  );
}
