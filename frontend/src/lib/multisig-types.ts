export enum TxnStatus {
  pending = 0,
  successful = 1,
  canceled = 2,
}

export interface Transaction {
  id: number;
  to: string;
  amount: number;
  approvals: number;
  initiatorApproved: boolean;
  executed: boolean;
  status: TxnStatus;
  txnInitiator: string;
  executedTime: number;
}

export interface Signer {
  signerAddress: string;
  txnId: number;
  timeSigned: number;
}

export const STATUS_LABELS: Record<TxnStatus, string> = {
  [TxnStatus.pending]: "Pending",
  [TxnStatus.successful]: "Executed",
  [TxnStatus.canceled]: "Canceled",
};

export const STATUS_CLASSES: Record<TxnStatus, string> = {
  [TxnStatus.pending]: "status-pending",
  [TxnStatus.successful]: "status-successful",
  [TxnStatus.canceled]: "status-canceled",
};

export function truncateAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
