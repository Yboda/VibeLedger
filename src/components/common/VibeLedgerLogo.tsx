import Image from 'next/image';
import { cn } from '@/lib/utils';

const LOGO_WIDTH = 1380;
const LOGO_HEIGHT = 752;

const SIZE_HEIGHT = {
  sm: 48,
  md: 72,
  lg: 96,
} as const;

interface VibeLedgerLogoProps {
  variant?: 'light' | 'dark';
  size?: keyof typeof SIZE_HEIGHT;
  fullWidth?: boolean;
  className?: string;
}

export default function VibeLedgerLogo({
  variant = 'light',
  size = 'md',
  fullWidth = false,
  className,
}: VibeLedgerLogoProps) {
  const src =
    variant === 'dark' ? '/images/logo_d_bg.jpg' : '/images/logo_w.jpg';

  if (fullWidth) {
    return (
      <div className={cn('w-full', className)}>
        <Image
          src={src}
          alt="VibeLedger Logo"
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          priority
          className="h-auto w-full"
        />
      </div>
    );
  }

  const displayHeight = SIZE_HEIGHT[size];
  const displayWidth = Math.round(displayHeight * (LOGO_WIDTH / LOGO_HEIGHT));

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Image
        src={src}
        alt="VibeLedger Logo"
        width={displayWidth}
        height={displayHeight}
        priority
        className="h-auto w-auto max-w-full"
      />
    </div>
  );
}
