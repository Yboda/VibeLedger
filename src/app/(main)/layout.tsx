import { Sidebar } from './_components/sidebar';
import { Header } from './_components/Header';
import { HeaderProvider } from './_providers/header-context';
import { TransactionModalProvider } from './_providers/transaction-modal-context';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HeaderProvider>
      <TransactionModalProvider>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      </TransactionModalProvider>
    </HeaderProvider>
  );
}
