interface VibeLedgerLogoProps {
  variant?: 'light' | 'dark';
  height?: string;
  className?: string;
}

export default function VibeLedgerLogo({
  variant = 'light',
  height = 'h-35',
  className,
}: VibeLedgerLogoProps) {
  const src =
    variant === 'dark' ? '/images/logo_d_bg.jpg' : '/images/logo_w.jpg';

  return (
    <div className="flex items-center justify-center">
      <img
        src={src}
        alt="VibeLedger Logo"
        className={`${height} w-auto${className ? ` ${className}` : ''}`}
      />
    </div>
  );
}
