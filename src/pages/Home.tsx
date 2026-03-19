// src/pages/Home.tsx
import React, { useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { useModal } from '../hooks/useModal';
import { Layout } from '../components/layout/Layout';
import { StatsCard } from '../components/cards/StatsCard';
import { TransactionCard } from '../components/cards/TransactionCard';

export const Home: React.FC = () => {
  const { accounts, selectedAccount, selectAccountById } = useAccounts();
  const { queuedTransactions, historyTransactions, pendingCount, clearAll } =
    useTransactions(selectedAccount?.id);
  const { openNewTransaction } = useModal();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!selectedAccount) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">No account selected</div>
      </div>
    );
  }

  const handleReset = () => {
    clearAll();
    setShowResetConfirm(false);
  };

  return (
    <Layout
      selectedAccount={selectedAccount}
      accounts={accounts}
      onAccountSelect={selectAccountById}
      onNewTransaction={openNewTransaction}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          label="Balance"
          value={`${selectedAccount.balance} MTK`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          label="Network"
          value={selectedAccount.network.toUpperCase()}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          }
        />
        <StatsCard
          label="Threshold"
          value={`${selectedAccount.threshold} / ${selectedAccount.owners.length}`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />
        <StatsCard
          label="Owners"
          value={selectedAccount.owners.length}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
      </div>

      {/* Token address bar */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-3 mb-6
                      flex items-center gap-3">
        <span className="text-gray-500 text-sm shrink-0">ERC-20 Token Address</span>
        <span className="text-[#7FFFD4] text-sm font-mono truncate flex-1">
          {selectedAccount.tokenAddress}
        </span>
        <a
          href={`https://sepolia.etherscan.io/address/${selectedAccount.tokenAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-gray-600 hover:text-gray-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Transaction Queue — live, from store */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-white text-xl font-semibold">Transaction Queue</h2>
            {/* Live badge — updates in real time */}
            {pendingCount > 0 && (
              <span className="text-sm font-bold px-2 py-0.5 rounded-full
                               bg-yellow-400/20 text-yellow-400 border border-yellow-400/20">
                {pendingCount} pending
              </span>
            )}
          </div>
          <a
            href="/new-transaction"
            className="text-[#7FFFD4] text-sm hover:underline transition-colors"
          >
            + New
          </a>
        </div>

        <div className="space-y-3">
          {queuedTransactions.length === 0 ? (
            <div className="text-center py-10">
              <svg className="w-12 h-12 text-gray-700 mx-auto mb-3" fill="none"
                   stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-sm">No pending transactions</p>
              <a
                href="/new-transaction"
                className="mt-3 inline-block bg-[#7FFFD4] text-black text-sm font-semibold
                           px-4 py-2 rounded-lg hover:bg-[#5eefc4] transition-colors"
              >
                Create Transaction
              </a>
            </div>
          ) : (
            <>
              {queuedTransactions.slice(0, 3).map((tx) => (
                <TransactionCard key={tx.id} transaction={tx} />
              ))}
              {queuedTransactions.length > 3 && (
                <a
                  href="/transactions"
                  className="block w-full text-center text-[#7FFFD4] hover:underline
                             text-sm py-2"
                >
                  View all {queuedTransactions.length} pending transactions
                </a>
              )}
            </>
          )}
        </div>
      </div>

      {/* Recent History — last 3 executed/cancelled */}
      {historyTransactions.length > 0 && (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-semibold">Recent History</h2>
            <a href="/transactions" className="text-[#7FFFD4] text-sm hover:underline">
              View all
            </a>
          </div>
          <div className="space-y-3">
            {historyTransactions.slice(0, 3).map((tx) => (
              <TransactionCard key={tx.id} transaction={tx} />
            ))}
          </div>
        </div>
      )}

      {/* Dev utility — reset simulation data */}
      <div className="border border-gray-800 rounded-xl p-4 flex items-center
                      justify-between gap-4">
        <div>
          <p className="text-gray-500 text-sm font-medium">Dev Utility</p>
          <p className="text-gray-700 text-sm mt-0.5">
            Clear all cached transaction data and reset to mock defaults
          </p>
        </div>
        {showResetConfirm ? (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1.5 border border-gray-700 text-gray-400 rounded-lg
                         hover:border-gray-500 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-red-500/80 text-white rounded-lg
                         hover:bg-red-500 transition-colors text-sm font-medium"
            >
              Confirm Reset
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="shrink-0 px-3 py-1.5 border border-gray-800 text-gray-600
                       rounded-lg hover:border-red-500/30 hover:text-red-400
                       transition-colors text-sm"
          >
            Reset Data
          </button>
        )}
      </div>
    </Layout>
  );
};