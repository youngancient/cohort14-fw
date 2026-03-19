// src/pages/ApproveTransaction.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { useModal } from '../hooks/useModal';
import { useConnectedWallet } from '../context/WalletContext';
import { multisigService } from '../services/MultisigService';
import { Layout } from '../components/layout/Layout';
import { type Transaction } from '../types/IMultisig';

type ActionState = 'idle' | 'loading' | 'success' | 'error';

// ---------------------------------------------------------------------------
// Single tx card
// ---------------------------------------------------------------------------
const TxApproveCard: React.FC<{
  tx: Transaction;
  connectedAddress: string;
  threshold: number;
  isHighlighted: boolean;
}> = ({ tx, connectedAddress, threshold, isHighlighted }) => {
  const [actionState, setActionState] = useState<ActionState>('idle');
  const [feedback, setFeedback] = useState('');
  const [txHash, setTxHash] = useState('');

  const addr = connectedAddress.toLowerCase();
  const isInitiator = tx.initiator.toLowerCase() === addr;
  const initiatorApproved = tx.confirmations.some(
    (c) => c.owner.toLowerCase() === tx.initiator.toLowerCase()
  );
  const iHaveApproved = tx.confirmations.some((c) => c.owner.toLowerCase() === addr);
  const confirmCount = tx.confirmations.length;
  const progress = Math.min((confirmCount / threshold) * 100, 100);

  const statusStyle: Record<string, string> = {
    pending:   'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    executed:  'text-[#7FFFD4] bg-[#7FFFD4]/10 border-[#7FFFD4]/20',
    cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
  };

  const doApproveAsInitiator = async () => {
    setActionState('loading');
    const res = await multisigService.approveAsInitiator(tx.id, connectedAddress);
    if (res.success) {
      setTxHash(res.txHash ?? '');
      setFeedback('Initiator approval confirmed. Other signers can now approve.');
      setActionState('success');
    } else {
      setFeedback(res.error ?? 'Error');
      setActionState('error');
    }
  };

  const doApproveAsSigner = async () => {
    setActionState('loading');
    const res = await multisigService.approveAsSignerAndExecute(tx.id, connectedAddress);
    if (res.success) {
      setTxHash(res.txHash ?? '');
      setFeedback(
        confirmCount + 1 >= threshold
          ? '🎉 Threshold reached — transaction executed!'
          : 'Approval recorded. Waiting for more signers.'
      );
      setActionState('success');
    } else {
      setFeedback(res.error ?? 'Error');
      setActionState('error');
    }
  };

  const doCancel = async () => {
    setActionState('loading');
    const res = await multisigService.cancelTransaction(tx.id, connectedAddress);
    if (res.success) {
      setFeedback('Transaction cancelled.');
      setActionState('success');
    } else {
      setFeedback(res.error ?? 'Error');
      setActionState('error');
    }
  };

  return (
    <div className={`rounded-xl border p-5 space-y-4 transition-all duration-300
      ${isHighlighted
        ? 'border-[#7FFFD4] bg-[#7FFFD4]/5 shadow-lg shadow-[#7FFFD4]/5'
        : 'border-gray-800 bg-[#1a1a1a]'}`}>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white text-sm font-mono font-medium">{tx.id}</span>
            <span className={`text-sm px-2 py-0.5 rounded-full border font-medium
                              ${statusStyle[tx.status]}`}>
              {tx.status}
            </span>
            {isInitiator && (
              <span className="text-sm px-2 py-0.5 rounded-full border
                               border-blue-400/20 bg-blue-400/10 text-blue-400">
                You initiated
              </span>
            )}
            {isHighlighted && (
              <span className="text-sm px-2 py-0.5 rounded-full border
                               border-[#7FFFD4]/30 bg-[#7FFFD4]/10 text-[#7FFFD4]">
                Just created
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-1 font-mono truncate">To: {tx.to}</p>
          <p className="text-gray-600 text-sm font-mono truncate">
            Initiator: {tx.initiator.slice(0, 14)}…
          </p>
          <p className="text-gray-600 text-sm">
            {new Date(tx.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-white font-semibold">{tx.value}</p>
          <p className="text-gray-600 text-sm">TOKEN</p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-sm text-gray-500 mb-1.5">
          <span>Confirmations</span>
          <span className={confirmCount >= threshold ? 'text-[#7FFFD4]' : ''}>
            {confirmCount} / {threshold} required
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div className="bg-[#7FFFD4] h-1.5 rounded-full transition-all duration-700"
               style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Confirmations list */}
      {tx.confirmations.length > 0 && (
        <div className="space-y-1.5">
          {tx.confirmations.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-[#7FFFD4] shrink-0" fill="currentColor"
                   viewBox="0 0 20 20">
                <path fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd" />
              </svg>
              <span className="text-gray-400 text-sm font-mono truncate flex-1">{c.owner}</span>
              {c.owner.toLowerCase() === tx.initiator.toLowerCase() && (
                <span className="text-gray-600 text-sm shrink-0">(initiator)</span>
              )}
              {c.owner.toLowerCase() === addr && (
                <span className="text-[#7FFFD4] text-sm shrink-0">(you)</span>
              )}
              <span className="text-gray-700 text-sm shrink-0">
                {new Date(c.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Feedback */}
      {actionState === 'loading' && (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="w-3 h-3 rounded-full border border-[#7FFFD4]
                          border-t-transparent animate-spin shrink-0" />
          Processing…
        </div>
      )}
      {actionState === 'success' && (
        <div className="text-[#7FFFD4] text-sm flex items-start gap-2">
          <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor"
               viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M5 13l4 4L19 7" />
          </svg>
          <span className="flex-1">{feedback}</span>
          {txHash && (
            <span className="text-gray-600 font-mono text-sm shrink-0">
              {txHash.slice(0, 14)}…
            </span>
          )}
        </div>
      )}
      {actionState === 'error' && (
        <div className="text-red-400 text-sm flex items-center gap-2">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor"
               viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M6 18L18 6M6 6l12 12" />
          </svg>
          {feedback}
          <button onClick={() => setActionState('idle')}
            className="ml-auto text-gray-500 hover:text-gray-300 underline">
            retry
          </button>
        </div>
      )}

      {/* Action buttons */}
      {tx.status === 'pending' && actionState !== 'loading' && (
        <div className="flex gap-2 flex-wrap pt-1 border-t border-gray-800">
          {/* Step 1: initiator approves */}
          {isInitiator && !initiatorApproved && (
            <button onClick={doApproveAsInitiator}
              className="flex-1 bg-[#7FFFD4] text-black font-semibold py-2 rounded-lg
                         hover:bg-[#5eefc4] transition-colors text-sm">
              Approve as Initiator
            </button>
          )}

          {/* Step 2: other signers approve (only after initiator) */}
          {!isInitiator && !iHaveApproved && initiatorApproved && (
            <button onClick={doApproveAsSigner}
              className="flex-1 bg-[#7FFFD4] text-black font-semibold py-2 rounded-lg
                         hover:bg-[#5eefc4] transition-colors text-sm">
              Approve
            </button>
          )}

          {/* Cancel — initiator only */}
          {isInitiator && (
            <button onClick={doCancel}
              className="px-4 border border-red-500/30 text-red-400 py-2 rounded-lg
                         hover:bg-red-500/10 transition-colors text-sm">
              Cancel
            </button>
          )}

          {/* Status messages */}
          {isInitiator && initiatorApproved && (
            <p className="text-gray-500 text-sm py-2 flex-1">
              ✓ You approved. Waiting for{' '}
              {threshold - confirmCount} more signer
              {threshold - confirmCount !== 1 ? 's' : ''}.
            </p>
          )}
          {!isInitiator && iHaveApproved && (
            <p className="text-[#7FFFD4] text-sm py-2">✓ You approved this transaction.</p>
          )}
          {!isInitiator && !iHaveApproved && !initiatorApproved && (
            <p className="text-gray-500 text-sm py-2">
              ⏳ Waiting for initiator to approve first.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export const ApproveTransaction: React.FC = () => {
  const [searchParams] = useSearchParams();
  const highlightTxId = searchParams.get('txId');
  const role = searchParams.get('role');

  const { accounts, selectedAccount, selectAccountById } = useAccounts();
  const { openNewTransaction } = useModal();
  const { connectedAddress } = useConnectedWallet();
  const { transactions, queuedTransactions } = useTransactions(selectedAccount?.id);

  const [tab, setTab] = useState<'pending' | 'all'>('pending');

  useEffect(() => { if (highlightTxId) setTab('pending'); }, [highlightTxId]);

  useEffect(() => {
    if (highlightTxId) {
      setTimeout(() => {
        document.getElementById(`tx-${highlightTxId}`)?.scrollIntoView({
          behavior: 'smooth', block: 'center',
        });
      }, 300);
    }
  }, [highlightTxId, transactions]);

  if (!selectedAccount) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">No account selected</p>
      </div>
    );
  }

  // Check if current address is a signer
  const isSigner = selectedAccount.owners.some(
    (o) => o.address.toLowerCase() === connectedAddress.toLowerCase()
  );

  const displayed = tab === 'pending' ? queuedTransactions : transactions;

  return (
    <Layout
      selectedAccount={selectedAccount}
      accounts={accounts}
      onAccountSelect={selectAccountById}
      onNewTransaction={openNewTransaction}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-white text-2xl font-semibold">Approve Transactions</h1>
          <p className="text-gray-400 text-sm mt-1">
            Threshold:{' '}
            <span className="text-[#7FFFD4]">
              {selectedAccount.threshold} of {selectedAccount.owners.length}
            </span>{' '}
            confirmations required
          </p>
        </div>

        <div className="flex bg-[#111] border border-gray-800 rounded-lg overflow-hidden">
          {(['pending', 'all'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors
                ${tab === t ? 'bg-[#7FFFD4] text-black' : 'text-gray-400 hover:text-white'}`}>
              {t}
              {t === 'pending' && queuedTransactions.length > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-sm font-bold
                  ${tab === 'pending' ? 'bg-black/20 text-black' : 'bg-yellow-400/20 text-yellow-400'}`}>
                  {queuedTransactions.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Acting as banner */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border mb-6
        ${isSigner
          ? 'bg-[#111] border-gray-800'
          : 'bg-red-500/5 border-red-500/20'}`}>
        <div className={`w-2 h-2 rounded-full shrink-0
          ${isSigner ? 'bg-[#7FFFD4] animate-pulse' : 'bg-red-400'}`} />
        <div className="min-w-0 flex-1">
          <p className="text-gray-500 text-sm">Acting as</p>
          <p className="text-white text-sm font-mono truncate">{connectedAddress}</p>
        </div>
        {isSigner ? (
          <span className="text-[#7FFFD4] text-sm shrink-0">✓ valid signer</span>
        ) : (
          <span className="text-red-400 text-sm shrink-0">not a signer</span>
        )}
        {role === 'initiator' && (
          <span className="text-[#7FFFD4] text-sm shrink-0 ml-2">
            You just created a tx ↓
          </span>
        )}
      </div>

      {/* Not a signer notice */}
      {!isSigner && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-6">
          <p className="text-red-400 text-sm">
            Your connected address is not a signer on this account. Switch to a
            valid signer in the top-right dropdown to approve transactions.
          </p>
        </div>
      )}

      {/* Transaction list — ALL pending txns visible to any signer */}
      {displayed.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-12 text-center">
          <svg className="w-14 h-14 text-gray-700 mx-auto mb-4" fill="none"
               stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 text-sm">
            {tab === 'pending' ? 'No pending transactions.' : 'No transactions yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((tx) => (
            <div key={tx.id} id={`tx-${tx.id}`}>
              <TxApproveCard
                tx={tx}
                connectedAddress={connectedAddress}
                threshold={selectedAccount.threshold}
                isHighlighted={tx.id === highlightTxId}
              />
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};