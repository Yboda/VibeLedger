import { Sidebar } from './_components/sidebar';
import { Header } from './_components/Header';
import { MainContent } from './_components/MainContent';
import { MainLayoutHydrator } from './_components/MainLayoutHydrator';
import { HeaderProvider } from './_providers/header-context';
import { NavigationProvider } from './_providers/navigation-context';
import { TransactionModalProvider } from './_providers/transaction-modal-context';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayoutHydrator>
      <HeaderProvider>
        <TransactionModalProvider>
          <NavigationProvider>
            <div className="flex h-screen bg-gray-100">
              <Sidebar />
              <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <Header />
                <MainContent>{children}</MainContent>
              </div>
            </div>
          </NavigationProvider>
        </TransactionModalProvider>
      </HeaderProvider>
    </MainLayoutHydrator>
  );
}
