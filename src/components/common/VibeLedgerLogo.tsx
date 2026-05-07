import Image from 'next/image';

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
      <Image
        src={src}
        alt="VibeLedger Logo"
        width={220}
        height={140}
        priority
        className={`${height} w-auto${className ? ` ${className}` : ''}`}
      />
    </div>
  );
}
