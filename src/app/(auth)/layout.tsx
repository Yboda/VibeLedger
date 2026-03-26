import VibeLedgerLogo from '@/components/common/VibeLedgerLogo';

function GeometricBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Top right shapes */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#FBBF24] rotate-45 opacity-90" />
      <div className="absolute top-20 right-20 w-48 h-48 bg-[#1e3a5f] rotate-12" />
      <div className="absolute top-40 right-10 w-32 h-32 bg-[#F97354] rotate-45" />

      {/* Bottom left shapes */}
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#F97354] rotate-12 opacity-90" />
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-[#FBBF24] rotate-45" />
      <div className="absolute bottom-40 left-40 w-24 h-24 bg-[#1e3a5f] rotate-12" />

      {/* Additional accent shapes */}
      <div className="absolute top-1/3 -left-10 w-20 h-20 bg-[#FBBF24] rotate-45 opacity-70" />
      <div className="absolute bottom-1/3 -right-10 w-28 h-28 bg-[#1e3a5f] rotate-12 opacity-80" />
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#1e293b] flex items-center justify-center p-4 relative overflow-hidden">
      <GeometricBackground />

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10">
        <div className="mb-6">
          <VibeLedgerLogo />
        </div>

        {children}
      </div>
    </div>
  );
}
