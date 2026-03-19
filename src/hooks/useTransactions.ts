// src/hooks/useTransactions.ts
// Subscribes to transactionStore — re-renders on every create/approve/cancel.
// Data is already persisted by the store; this hook just reads + subscribes.

import { useState, useEffect, useCallback } from 'react';
import { transactionStore } from '../store/transactionStore';
import { type Transaction } from '../types/IMultisig';

interface UseTransactionsReturn {
  transactions: Transaction[];            // all txns for account (sorted newest first)
  queuedTransactions: Transaction[];      // pending only  → Transaction queue
  historyTransactions: Transaction[];     // executed + cancelled → History tab
  pendingCount: number;                   // for badge counters in nav / header
  isLoading: boolean;
  clearAll: () => void;                   // dev utility — resets storage
}

export const useTransactions = (accountId: string | undefined): UseTransactionsReturn => {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    accountId ? transactionStore.getByAccount(accountId) : []
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!accountId) {
      setTransactions([]);
      return;
    }

    // Sync immediately on accountId change
    setTransactions(transactionStore.getByAccount(accountId));

    // Subscribe to store mutations (create / approve / cancel all call notify())
    const unsubscribe = transactionStore.subscribe(() => {
      setTransactions(transactionStore.getByAccount(accountId));
    });

    return unsubscribe;
  }, [accountId]);

  const clearAll = useCallback(() => {
    transactionStore.clearAll();
  }, []);

  const queuedTransactions = transactions.filter((tx) => tx.status === 'pending');
  const historyTransactions = transactions.filter((tx) => tx.status !== 'pending');

  return {
    transactions,
    queuedTransactions,
    historyTransactions,
    pendingCount: queuedTransactions.length,
    isLoading,
    clearAll,
  };
};