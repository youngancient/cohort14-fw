// src/pages/CreateTransaction.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '../hooks/useAccounts';
import { useModal } from '../hooks/useModal';
import { useConnectedWallet } from '../context/WalletContext';
import { multisigService } from '../services/MultisigService';
import { Layout } from '../components/layout/Layout';

type Step = 'form' | 'loading' | 'error';

export const CreateTransaction: React.FC = () => {
  const navigate = useNavigate();
  const { accounts, selectedAccount, selectAccountById } = useAccounts();
  const { openNewTransaction } = useModal();
  const { connectedAddress } = useConnectedWallet();

  const [step, setStep] = useState<Step>('form');
  const [to, setTo] = useState('');
  const [value, setValue] = useState('');
  const [data, setData] = useState('0x');
  const [errorMsg, setErrorMsg] = useState('');

  if (!selectedAccount) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">No account selected</p>
      </div>
    );
  }

  // Check if connected address is a valid signer on this account
  const isSigner = selectedAccount.owners.some(
    (o) => o.address.toLowerCase() === connectedAddress.toLowerCase()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !value) return;
    setStep('loading');

    const result = await multisigService.createTransaction(
      selectedAccount.id, to, value, data, connectedAddress
    );

    if (result.success && result.txId) {
      navigate(`/approve?txId=${result.txId}&role=initiator`);
    } else {
      setErrorMsg(result.error ?? 'Unknown error');
      setStep('error');
    }
  };

  return (
    <Layout
      selectedAccount={selectedAccount}
      accounts={accounts}
      onAccountSelect={selectAccountById}
      onNewTransaction={openNewTransaction}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-white text-2xl font-semibold">New Transaction</h1>
          <p className="text-gray-400 text-sm mt-1">
            Requires{' '}
            <span className="text-[#7FFFD4] font-medium">
              {selectedAccount.threshold} of {selectedAccount.owners.length}
            </span>{' '}
            confirmations to execute.
          </p>
        </div>

        {/* Not a signer warning */}
        {!isSigner && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6
                          flex items-start gap-3">
            <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none"
                 stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-400 text-sm">
              Your connected address is not a signer on this account. Switch to a
              valid signer address to create transactions.
            </p>
          </div>
        )}

        {/* Connected as */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border mb-6 text-sm
                        bg-[#111] border-gray-800">
          <div className="w-2 h-2 rounded-full bg-[#7FFFD4] shrink-0" />
          <span className="text-gray-400">Acting as</span>
          <span className="text-white font-mono truncate flex-1">{connectedAddress}</span>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  Recipient Address
                </label>
                <input
                  type="text" value={to} onChange={(e) => setTo(e.target.value)}
                  placeholder="0x..." required
                  className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3
                             text-white text-sm font-mono placeholder-gray-600
                             focus:outline-none focus:border-[#7FFFD4] transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number" value={value} onChange={(e) => setValue(e.target.value)}
                    placeholder="0.00" min="0" step="any" required
                    className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3
                               text-white text-sm placeholder-gray-600 pr-20
                               focus:outline-none focus:border-[#7FFFD4] transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-mono">
                    TOKEN
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Contract balance: {selectedAccount.balance} TOKEN
                </p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  Data <span className="text-gray-600 normal-case">(optional)</span>
                </label>
                <input
                  type="text" value={data} onChange={(e) => setData(e.target.value)}
                  className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3
                             text-white text-sm font-mono
                             focus:outline-none focus:border-[#7FFFD4] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={!isSigner}
                className="w-full bg-[#7FFFD4] text-black font-semibold py-3 rounded-lg
                           hover:bg-[#5eefc4] transition-colors text-sm
                           disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Create Transaction
              </button>
            </form>
          )}

          {step === 'loading' && (
            <div className="flex flex-col items-center py-12 gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#7FFFD4]
                              border-t-transparent animate-spin" />
              <p className="text-white font-medium">Creating transaction…</p>
            </div>
          )}

          {step === 'error' && (
            <div className="flex flex-col items-center py-8 gap-5 text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30
                              flex items-center justify-center">
                <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-white font-semibold">Failed</p>
              <p className="text-red-400 text-sm">{errorMsg}</p>
              <button onClick={() => setStep('form')}
                className="w-full border border-gray-700 text-gray-300 py-2.5 rounded-lg
                           hover:border-gray-500 transition-colors text-sm">
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};