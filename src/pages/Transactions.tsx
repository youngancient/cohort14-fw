// src/pages/Transactions.tsx
import React, { useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { useModal } from '../hooks/useModal';
import { Layout } from '../components/layout/Layout';
import { TransactionCard } from '../components/cards/TransactionCard';
import { type Transaction } from '../types/IMultisig';

// Format ISO createdAt into a readable date label for grouping
// e.g. "2023-09-14T12:53:00Z" → "Sep 14, 2023"
const toDateLabel = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

// Group transactions by formatted date label (newest date first)
const groupByDate = (txs: Transaction[]): [string, Transaction[]][] => {
  const map: Record<string, Transaction[]> = {};
  for (const tx of txs) {
    const label = toDateLabel(tx.createdAt);
    if (!map[label]) map[label] = [];
    map[label].push(tx);
  }
  // Sort groups newest-first using the first tx in each group
  return Object.entries(map).sort(
    ([, a], [, b]) =>
      new Date(b[0].createdAt).getTime() - new Date(a[0].createdAt).getTime()
  );
};

export const Transactions: React.FC = () => {
  const { accounts, selectedAccount, selectAccountById } = useAccounts();
  const { queuedTransactions, historyTransactions, pendingCount } = useTransactions(
    selectedAccount?.id
  );
  const { openNewTransaction } = useModal();
  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');

  if (!selectedAccount) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">No account selected</div>
      </div>
    );
  }

  const displayTransactions =
    activeTab === 'queue' ? queuedTransactions : historyTransactions;

  const grouped = groupByDate(displayTransactions);

  return (
    <Layout
      selectedAccount={selectedAccount}
      accounts={accounts}
      onAccountSelect={selectAccountById}
      onNewTransaction={openNewTransaction}
    >
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white text-3xl font-semibold">Transactions</h1>
          <a
            href="/new-transaction"
            className="bg-[#7FFFD4] text-black text-sm font-semibold px-4 py-2
                       rounded-lg hover:bg-[#5eefc4] transition-colors"
          >
            + New Transaction
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-800 mb-6">
          <button
            onClick={() => setActiveTab('queue')}
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === 'queue' ? 'text-white' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Queue
            {pendingCount > 0 && (
              <span className="ml-2 text-sm bg-yellow-400/20 text-yellow-400
                               border border-yellow-400/30 rounded-full px-1.5 py-0.5">
                {pendingCount}
              </span>
            )}
            {activeTab === 'queue' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7FFFD4]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === 'history' ? 'text-white' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            History
            {historyTransactions.length > 0 && (
              <span className="ml-2 text-sm bg-gray-700 text-gray-400
                               rounded-full px-1.5 py-0.5">
                {historyTransactions.length}
              </span>
            )}
            {activeTab === 'history' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7FFFD4]" />
            )}
          </button>
        </div>

        {/* Transaction list */}
        <div className="space-y-6">
          {displayTransactions.length === 0 ? (
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-12 text-center">
              <svg
                className="w-16 h-16 text-gray-700 mx-auto mb-4"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-400 text-lg mb-2">
                No {activeTab === 'queue' ? 'pending' : 'completed'} transactions
              </p>
              <p className="text-gray-500 text-sm mb-6">
                {activeTab === 'queue'
                  ? 'Create a new transaction to get started'
                  : 'Your transaction history will appear here'}
              </p>
              {activeTab === 'queue' && (
                <a
                  href="/new-transaction"
                  className="inline-block bg-[#7FFFD4] text-black text-sm font-semibold
                             px-5 py-2.5 rounded-lg hover:bg-[#5eefc4] transition-colors"
                >
                  Create Transaction
                </a>
              )}
            </div>
          ) : (
            grouped.map(([dateLabel, txs]) => (
              <div key={dateLabel}>
                {/* Formatted date label */}
                <h3 className="text-gray-500 text-sm font-medium mb-3
                                uppercase tracking-widest">
                  {dateLabel}
                </h3>
                <div className="space-y-3">
                  {txs.map((tx) => (
                    <TransactionCard key={tx.id} transaction={tx} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};