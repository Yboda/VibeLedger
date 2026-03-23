interface VibeLedgerLogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export default function VibeLedgerLogo({
  variant = 'light',
  className = 'h-24 w-auto',
}: VibeLedgerLogoProps) {
  const src =
    variant === 'dark' ? '/images/logo_d_bg.jpg' : '/images/logo_w.jpg';

  return (
    <div className="flex items-center justify-center">
      <img src={src} alt="VibeLedger Logo" className={className} />
    </div>
  );
}
