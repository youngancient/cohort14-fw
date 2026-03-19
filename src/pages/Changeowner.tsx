// src/pages/ChangeOwner.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '../hooks/useAccounts';
import { useModal } from '../hooks/useModal';
import { useConnectedWallet } from '../context/WalletContext';
import { multisigService } from '../services/MultisigService';
import { Layout } from '../components/layout/Layout';

type Step = 'form' | 'confirm' | 'loading' | 'success' | 'error';

export const ChangeOwner: React.FC = () => {
  const navigate = useNavigate();
  const { accounts, selectedAccount, selectAccountById } = useAccounts();
  const { openNewTransaction } = useModal();
  const { connectedAddress } = useConnectedWallet();

  const [step, setStep] = useState<Step>('form');
  const [newOwnerAddress, setNewOwnerAddress] = useState('');
  const [txHash, setTxHash] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!selectedAccount) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">No account selected</p>
      </div>
    );
  }

  const isOwner =
    selectedAccount.owners[0]?.address.toLowerCase() ===
    connectedAddress.toLowerCase();

  // Redirect non-owners away
  if (!isOwner) {
    return (
      <Layout
        selectedAccount={selectedAccount}
        accounts={accounts}
        onAccountSelect={selectAccountById}
        onNewTransaction={openNewTransaction}
      >
        <div className="max-w-xl border mx-auto">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none"
                 stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-white font-semibold mb-2">Owner Only</p>
            <p className="text-red-400 text-sm mb-6">
              Only the contract owner can transfer ownership. Switch to the owner
              address in the top-right dropdown.
            </p>
            <button onClick={() => navigate('/home')}
              className="border border-gray-700 text-gray-300 px-6 py-2 rounded-lg
                         hover:border-gray-500 transition-colors text-sm">
              Go Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const currentOwner = selectedAccount.owners[0];

  const reset = () => {
    setStep('form');
    setNewOwnerAddress('');
    setTxHash('');
    setErrorMsg('');
  };

  const handleConfirm = async () => {
    setStep('loading');
    const result = await multisigService.changeOwner(
      selectedAccount.id, newOwnerAddress, connectedAddress
    );
    if (result.success) {
      setTxHash(result.txHash ?? '');
      setStep('success');
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
          <h1 className="text-white text-2xl font-semibold">Transfer Ownership</h1>
          <p className="text-gray-400 text-sm mt-1">
            Transfers the contract owner role.{' '}
            <span className="text-red-400">This is irreversible.</span>
          </p>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
          {step === 'form' && (
            <div className="space-y-5">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2
                                   uppercase tracking-wider">
                  Current Owner
                </label>
                <div className="bg-[#111] border border-gray-800 rounded-lg p-3
                                flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br
                                  from-[#7FFFD4]/30 to-blue-500/20 border border-[#7FFFD4]/20
                                  flex items-center justify-center text-sm font-bold
                                  text-[#7FFFD4] shrink-0">
                    {currentOwner?.address.slice(2, 4).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    {currentOwner?.name && (
                      <p className="text-white text-sm font-medium">{currentOwner.name}</p>
                    )}
                    <p className="text-gray-500 text-sm font-mono truncate">
                      {currentOwner?.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#111] border border-gray-800
                                flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor"
                       viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2
                                   uppercase tracking-wider">
                  New Owner Address
                </label>
                <input
                  type="text" value={newOwnerAddress}
                  onChange={(e) => setNewOwnerAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3
                             text-white text-sm font-mono placeholder-gray-600
                             focus:outline-none focus:border-[#7FFFD4] transition-colors"
                />
              </div>

              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-1">
                <p className="text-red-400 text-sm font-semibold">⚠ Danger Zone</p>
                <p className="text-gray-500 text-sm">You will immediately lose owner privileges.</p>
                <p className="text-gray-500 text-sm">Only the new owner can call changeSigner or changeOwner.</p>
                <p className="text-gray-500 text-sm">This action cannot be undone.</p>
              </div>

              <button
                onClick={() => setStep('confirm')}
                disabled={!newOwnerAddress || newOwnerAddress.length < 10}
                className="w-full bg-red-500/80 text-white font-semibold py-3 rounded-lg
                           hover:bg-red-500 transition-colors text-sm
                           disabled:opacity-40 disabled:cursor-not-allowed">
                Transfer Ownership
              </button>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30
                                flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor"
                       viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-white font-semibold text-lg">Are you sure?</p>
                <p className="text-gray-400 text-sm mt-1">Ownership will transfer to:</p>
              </div>
              <div className="bg-[#111] border border-gray-800 rounded-lg p-3 text-center">
                <p className="text-[#7FFFD4] text-sm font-mono break-all">{newOwnerAddress}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep('form')}
                  className="flex-1 border border-gray-700 text-gray-300 py-2.5 rounded-lg
                             hover:border-gray-500 transition-colors text-sm">
                  Go Back
                </button>
                <button onClick={handleConfirm}
                  className="flex-1 bg-red-500 text-white font-semibold py-2.5 rounded-lg
                             hover:bg-red-600 transition-colors text-sm">
                  Confirm Transfer
                </button>
              </div>
            </div>
          )}

          {step === 'loading' && (
            <div className="flex flex-col items-center py-10 gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#7FFFD4]
                              border-t-transparent animate-spin" />
              <p className="text-white font-medium">Transferring ownership…</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center py-8 gap-5 text-center">
              <div className="w-14 h-14 rounded-full bg-[#7FFFD4]/10 border border-[#7FFFD4]/30
                              flex items-center justify-center">
                <svg className="w-7 h-7 text-[#7FFFD4]" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white font-semibold text-lg">Ownership Transferred</p>
              {txHash && (
                <div className="w-full bg-[#111] rounded-lg p-3 border border-gray-800">
                  <p className="text-gray-500 text-sm mb-1">Tx Hash</p>
                  <p className="text-[#7FFFD4] text-sm font-mono break-all">{txHash}</p>
                </div>
              )}
              <button onClick={reset}
                className="w-full border border-gray-700 text-gray-300 py-2.5 rounded-lg
                           hover:border-gray-500 transition-colors text-sm">
                Done
              </button>
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
              <button onClick={reset}
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