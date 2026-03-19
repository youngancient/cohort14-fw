// src/pages/ChangeSigner.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '../hooks/useAccounts';
import { useModal } from '../hooks/useModal';
import { useConnectedWallet } from '../context/WalletContext';
import { multisigService } from '../services/MultisigService';
import { Layout } from '../components/layout/Layout';

type Step = 'form' | 'loading' | 'success' | 'error';

export const ChangeSigner: React.FC = () => {
  const navigate = useNavigate();
  const { accounts, selectedAccount, selectAccountById } = useAccounts();
  const { openNewTransaction } = useModal();
  const { connectedAddress } = useConnectedWallet();

  const [step, setStep] = useState<Step>('form');
  const [selectedOld, setSelectedOld] = useState('');
  const [newSigner, setNewSigner] = useState('');
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
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none"
                 stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-white font-semibold mb-2">Owner Only</p>
            <p className="text-red-400 text-sm mb-6">
              Only the contract owner can change signers. Switch to the owner
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

  const reset = () => {
    setStep('form');
    setSelectedOld('');
    setNewSigner('');
    setTxHash('');
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOld || !newSigner) return;
    setStep('loading');

    const result = await multisigService.changeSigner(
      selectedAccount.id, selectedOld, newSigner, connectedAddress
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
          <h1 className="text-white text-2xl font-semibold">Change Signer</h1>
          <p className="text-gray-400 text-sm mt-1">
            Replace an existing signer address with a new one.
          </p>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2
                                   uppercase tracking-wider">
                  Select Signer to Replace
                </label>
                <div className="space-y-2">
                  {selectedAccount.owners.map((owner) => (
                    <button
                      key={owner.address}
                      type="button"
                      onClick={() => setSelectedOld(owner.address)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border
                                   transition-all text-left
                        ${selectedOld === owner.address
                          ? 'border-[#7FFFD4] bg-[#7FFFD4]/5'
                          : 'border-gray-800 hover:border-gray-600 bg-[#111]'}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br
                                      from-[#7FFFD4]/20 to-blue-500/20 border border-gray-700
                                      flex items-center justify-center text-sm font-bold
                                      text-gray-300 shrink-0">
                        {owner.address.slice(2, 4).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        {owner.name && (
                          <p className="text-white text-sm font-medium">{owner.name}</p>
                        )}
                        <p className="text-gray-500 text-sm font-mono truncate">
                          {owner.address}
                        </p>
                      </div>
                      {selectedOld === owner.address && (
                        <svg className="w-4 h-4 text-[#7FFFD4] shrink-0" fill="none"
                             stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2
                                   uppercase tracking-wider">
                  New Signer Address
                </label>
                <input
                  type="text" value={newSigner}
                  onChange={(e) => setNewSigner(e.target.value)}
                  placeholder="0x..." required
                  className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3
                             text-white text-sm font-mono placeholder-gray-600
                             focus:outline-none focus:border-[#7FFFD4] transition-colors"
                />
              </div>

              <div className="bg-[#111] border border-yellow-500/20 rounded-lg p-4 flex gap-3">
                <svg className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" fill="none"
                     stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-yellow-400 text-sm">
                  The old signer will immediately lose all signing privileges.
                </p>
              </div>

              <button type="submit" disabled={!selectedOld || !newSigner}
                className="w-full bg-[#7FFFD4] text-black font-semibold py-3 rounded-lg
                           hover:bg-[#5eefc4] transition-colors text-sm
                           disabled:opacity-40 disabled:cursor-not-allowed">
                Change Signer
              </button>
            </form>
          )}

          {step === 'loading' && (
            <div className="flex flex-col items-center py-10 gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#7FFFD4]
                              border-t-transparent animate-spin" />
              <p className="text-white font-medium">Changing signer…</p>
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
              <p className="text-white font-semibold text-lg">Signer Updated</p>
              {txHash && (
                <div className="w-full bg-[#111] rounded-lg p-3 border border-gray-800">
                  <p className="text-gray-500 text-sm mb-1">Tx Hash</p>
                  <p className="text-[#7FFFD4] text-sm font-mono break-all">{txHash}</p>
                </div>
              )}
              <button onClick={reset}
                className="w-full border border-gray-700 text-gray-300 py-2.5 rounded-lg
                           hover:border-gray-500 transition-colors text-sm">
                Change Another
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