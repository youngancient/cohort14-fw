// src/components/layout/Header.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { type Account } from '../../types/IMultisig';
import { AddressSwitcher } from '../wallet/AddressSwitcher';
import { truncateAddress } from '../../utils/mockData';

interface HeaderProps {
  selectedAccount: Account;
  accounts: Account[];
  onAccountSelect: (accountId: string) => void;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedAccount,
  accounts,
  onAccountSelect,
  onMenuClick,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 md:px-6 h-14 bg-[#111] gap-3">

      {/* LEFT */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-white
                     hover:bg-white/5 transition-colors lg:hidden shrink-0"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo — mobile only */}
        <div className="flex items-center gap-2 lg:hidden shrink-0">
          <div className="w-6 h-6 rounded-md bg-[#7FFFD4] flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-white font-bold text-sm">MultisigLabs</span>
        </div>

        {/* Desktop: contract address */}
        <a
          href={`https://sepolia.etherscan.io/address/${selectedAccount.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:flex items-center gap-1.5 text-gray-400 hover:text-white
                     transition-colors text-sm font-mono"
        >
          {truncateAddress(selectedAccount.address, 6)}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>

        {/* Multisig account switcher */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm
                       bg-[#1a1a1a] border border-gray-800 hover:border-gray-600
                       transition-colors text-gray-300"
          >
            <span className="truncate max-w-[100px] md:max-w-[140px]">
              {selectedAccount.name}
            </span>
            <svg className={`w-3 h-3 text-gray-500 shrink-0 transition-transform
                             ${dropdownOpen ? 'rotate-180' : ''}`}
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute left-0 top-full mt-2 w-60 z-20
                              bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl
                              overflow-hidden">
                <p className="px-3 py-2 text-gray-500 text-sm uppercase tracking-wider
                               border-b border-gray-800">
                  Switch Account
                </p>
                {accounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => { onAccountSelect(acc.id); setDropdownOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left
                                 transition-colors hover:bg-white/5
                                 ${acc.id === selectedAccount.id ? 'bg-[#7FFFD4]/5' : ''}`}
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br
                                    from-[#7FFFD4]/30 to-blue-500/20 border border-gray-700
                                    flex items-center justify-center text-sm font-bold
                                    text-gray-300 shrink-0">
                      {acc.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate">{acc.name}</p>
                      <p className="text-gray-500 text-sm font-mono truncate">
                        {truncateAddress(acc.address)}
                      </p>
                    </div>
                    {acc.id === selectedAccount.id && (
                      <svg className="w-4 h-4 text-[#7FFFD4] shrink-0" fill="none"
                           stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
                <div className="p-3 border-t border-gray-800">
                  <Link
                    to="/new-transaction"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 text-[#7FFFD4] text-sm hover:underline"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor"
                         viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 4v16m8-8H4" />
                    </svg>
                    New Transaction
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* RIGHT — address switcher */}
      <AddressSwitcher />
    </div>
  );
};