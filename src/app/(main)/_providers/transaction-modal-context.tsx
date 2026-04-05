'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { type Transaction } from '@/lib/api/transactions';
import { TransactionModal } from '../transactions/_components/TransactionModal';

interface TransactionModalContextType {
  openModal: (editing?: Transaction | null) => void;
}

const TransactionModalContext = createContext<TransactionModalContextType>({
  openModal: () => {},
});

export function TransactionModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [modalKey, setModalKey] = useState(0);

  const openModal = useCallback((tx?: Transaction | null) => {
    setEditing(tx ?? null);
    setModalKey(k => k + 1);
    setOpen(true);
  }, []);

  return (
    <TransactionModalContext.Provider value={{ openModal }}>
      {children}
      <TransactionModal
        key={modalKey}
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        editing={editing}
      />
    </TransactionModalContext.Provider>
  );
}

export function useTransactionModal() {
  return useContext(TransactionModalContext);
}
