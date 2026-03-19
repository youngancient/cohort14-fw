// src/context/WalletContext.tsx
// Single source of truth for the simulated "connected wallet" address.
// Any page that calls useConnectedWallet() reads and writes the SAME state.
// When going live: replace the mock switcher with real wagmi useAccount().

import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockOwners } from '../utils/mockData';

interface WalletContextValue {
  connectedAddress: string;
  setConnectedAddress: (address: string) => void;
  // All available mock addresses to switch between
  availableAddresses: { address: string; name: string }[];
}

const WalletContext = createContext<WalletContextValue | null>(null);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to first owner (Henry P)
  const [connectedAddress, setConnectedAddress] = useState<string>(
    mockOwners[0].address
  );

  const availableAddresses = mockOwners.map((o) => ({
    address: o.address,
    name: o.name ?? o.address.slice(0, 10) + '…',
  }));

  const handleSet = useCallback((address: string) => {
    setConnectedAddress(address);
  }, []);

  return (
    <WalletContext.Provider
      value={{ connectedAddress, setConnectedAddress: handleSet, availableAddresses }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useConnectedWallet = (): WalletContextValue => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useConnectedWallet must be used inside WalletProvider');
  return ctx;
};