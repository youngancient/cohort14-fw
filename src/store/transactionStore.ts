// src/store/transactionStore.ts
// localStorage is the single source of truth for transactions.
//
// Flow:
//   Boot      → load from localStorage into memory
//   Create    → add() → save to localStorage → notify subscribers
//   Approve   → update() → save to localStorage → notify subscribers
//   Cancel    → update() → save to localStorage → notify subscribers
//   Refresh   → loads from localStorage, exact state restored
//   Clear     → wipes localStorage → empty state
//
// When going live: replace with on-chain event listeners / subgraph queries.

import { type Transaction } from '../types/IMultisig';

type Listener = () => void;

const STORAGE_KEY = 'multisig_transactions_v1';

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------
const loadFromStorage = (): Map<string, Transaction> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Map();
    const arr: Transaction[] = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Map();
    return new Map(arr.map((tx) => [tx.id, tx]));
  } catch {
    return new Map();
  }
};

const saveToStorage = (map: Map<string, Transaction>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(map.values())));
  } catch {
    // Quota exceeded or unavailable — fail silently
  }
};

// ---------------------------------------------------------------------------
class TransactionStore {
  // Hydrate from localStorage immediately on module load
  private transactions: Map<string, Transaction> = loadFromStorage();
  private listeners: Set<Listener> = new Set();

  // ---------------------------------------------------------------------------
  // Pub/sub
  // ---------------------------------------------------------------------------
  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    saveToStorage(this.transactions);
    this.listeners.forEach((fn) => fn());
  }

  // ---------------------------------------------------------------------------
  // Writes — every write persists to localStorage and notifies all subscribers
  // ---------------------------------------------------------------------------
  add(tx: Transaction) {
    this.transactions.set(tx.id, { ...tx });
    this.notify();
  }

  update(txId: string, patch: Partial<Transaction>) {
    const existing = this.transactions.get(txId);
    if (!existing) return;
    this.transactions.set(txId, { ...existing, ...patch });
    this.notify();
  }

  // Wipe everything — triggered by the Reset button on Home page
  clearAll() {
    this.transactions.clear();
    localStorage.removeItem(STORAGE_KEY);
    this.notify();
  }

  // ---------------------------------------------------------------------------
  // Reads
  // ---------------------------------------------------------------------------
  getAll(): Transaction[] {
    return Array.from(this.transactions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getByAccount(accountId: string): Transaction[] {
    return this.getAll().filter((tx) => tx.accountId === accountId);
  }

  getById(txId: string): Transaction | undefined {
    return this.transactions.get(txId);
  }

  getPending(accountId: string): Transaction[] {
    return this.getByAccount(accountId).filter((tx) => tx.status === 'pending');
  }

  getHistory(accountId: string): Transaction[] {
    return this.getByAccount(accountId).filter((tx) => tx.status !== 'pending');
  }

  // How many transactions are currently in memory (for debugging)
  size(): number {
    return this.transactions.size;
  }
}

export const transactionStore = new TransactionStore();