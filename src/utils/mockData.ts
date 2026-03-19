// src/utils/mockData.ts
// Mock ACCOUNTS and OWNERS only — no mock transactions.
// Transactions are created by users and persisted in localStorage via
// transactionStore. They survive page refreshes until explicitly cleared.

import { type Account, type Owner } from '../types/IMultisig';
import { multisigService } from '../services/MultisigService';

// ---------------------------------------------------------------------------
// Owners
// ---------------------------------------------------------------------------
export const mockOwners: Owner[] = [
  {
    address: '0xA1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0',
    name: 'Henry P',
    addedAt: new Date().toISOString(),
    isActive: true,
  },
  {
    address: '0xB2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1',
    name: 'Signer 22',
    addedAt: new Date().toISOString(),
    isActive: true,
  },
  {
    address: '0xC3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0C1d2',
    name: 'Signer 8',
    addedAt: new Date().toISOString(),
    isActive: true,
  },
  {
    address: '0xD4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1D2e3',
    name: 'Alice K',
    addedAt: new Date().toISOString(),
    isActive: true,
  },
];

// ---------------------------------------------------------------------------
// Accounts
// ---------------------------------------------------------------------------
export const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'gigman-vault',
    address: '0xAaaa1111Bbbb2222Cccc3333Dddd4444Eeee5555',
    balance: '100,000',
    threshold: 2,
    owners: [mockOwners[0], mockOwners[1], mockOwners[2], mockOwners[3]],
    network: 'sepolia',
    tokenAddress: '0xF1f2f3f4f5f6f7f8f9f0a1a2a3a4a5a6a7a8a9b0',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'trenches-vault',
    address: '0xBbbb2222Cccc3333Dddd4444Eeee5555Ffff6666',
    balance: '100,000',
    threshold: 2,
    owners: [mockOwners[0], mockOwners[1], mockOwners[2]],
    network: 'sepolia',
    tokenAddress: '0xF1f2f3f4f5f6f7f8f9f0a1a2a3a4a5a6a7a8a9b0',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: "investor's vault",
    address: '0xCccc3333Dddd4444Eeee5555Ffff6666Aaaa7777',
    balance: '100,000',
    threshold: 3,
    owners: [mockOwners[0], mockOwners[1], mockOwners[2], mockOwners[3]],
    network: 'sepolia',
    tokenAddress: '0xF1f2f3f4f5f6f7f8f9f0a1a2a3a4a5a6a7a8a9b0',
    createdAt: new Date().toISOString(),
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export const truncateAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// ---------------------------------------------------------------------------
// seedMockData — only seeds accounts into the service.
// Transactions are NOT seeded here — they live entirely in localStorage
// via transactionStore and are created by real user actions only.
// ---------------------------------------------------------------------------
export const seedMockData = () => {
  mockAccounts.forEach((acc) => {
    if (!multisigService.getAccount(acc.id)) {
      multisigService.initializeAccount(acc);
    }
  });
};