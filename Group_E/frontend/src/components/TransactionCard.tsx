import { motion } from "framer-motion";
import { TxnStatus, STATUS_LABELS, STATUS_CLASSES, truncateAddress, formatAmount, type Transaction } from "@/lib/multisig-types";
import { MOCK_THRESHOLD, MOCK_MAX_SIGNERS, MOCK_TOKEN_SYMBOL } from "@/lib/mock-data";
import { ThresholdTracker } from "./ThresholdTracker";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

interface TransactionCardProps {
  txn: Transaction;
  signerAddresses?: string[];
  onSelect?: (id: number) => void;
  selected?: boolean;
}

const StatusIcon = ({ status }: { status: TxnStatus }) => {
  switch (status) {
    case TxnStatus.pending:
      return <Clock className="h-4 w-4 text-warning animate-pulse-dot" />;
    case TxnStatus.successful:
      return <CheckCircle2 className="h-4 w-4 text-success" />;
    case TxnStatus.canceled:
      return <XCircle className="h-4 w-4 text-destructive" />;
  }
};

export function TransactionCard({ txn, signerAddresses = [], onSelect, selected }: TransactionCardProps) {
  const handleSelect = () => onSelect?.(txn.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={handleSelect}
      className={`
        bg-surface border rounded-2xl p-6 cursor-pointer transition-colors duration-200 min-h-[140px] sm:min-h-0
        ${selected ? "border-primary/60" : "border-border hover:border-primary/30"}
      `}
      style={{ touchAction: "manipulation" }}
    >
      <div className="grid gap-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        {/* Col 1: ID + Status */}
        <div className="flex flex-col items-center gap-2 min-w-[60px]">
          <span className="font-mono text-xs text-muted-foreground">#{txn.id}</span>
          <StatusIcon status={txn.status} />
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${STATUS_CLASSES[txn.status]}`}>
            {STATUS_LABELS[txn.status]}
          </span>
          {txn.status === TxnStatus.pending && txn.approvals >= MOCK_THRESHOLD && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border bg-success/10 border-success/30 text-success">
              Ready
            </span>
          )}
        </div>

        {/* Col 2: Recipient + Amount */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-widest uppercase text-muted-foreground font-medium">Recipient</span>
          </div>
          <span className="font-mono text-sm text-foreground/80">{truncateAddress(txn.to)}</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-medium tracking-display text-foreground">
              {formatAmount(txn.amount)}
            </span>
            <span className="text-xs text-muted-foreground font-mono">{MOCK_TOKEN_SYMBOL}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-muted-foreground">Initiated by</span>
            <span className="font-mono text-[11px] text-foreground/60">{truncateAddress(txn.txnInitiator)}</span>
            {!txn.initiatorApproved && (
              <span className="text-[10px] text-warning border border-warning/30 rounded px-1.5 py-0.5">
                Awaiting initialization
              </span>
            )}
          </div>
        </div>

        {/* Col 3: Threshold progress */}
        <div className="flex flex-col items-end gap-2">
          <span className="text-[10px] tracking-widest uppercase text-muted-foreground font-medium">Signatures</span>
          <ThresholdTracker
            approvals={txn.approvals}
            threshold={MOCK_THRESHOLD}
            maxSigners={MOCK_MAX_SIGNERS}
            signerAddresses={signerAddresses}
          />
          <span className="font-mono text-xs text-muted-foreground">
            {txn.approvals} / {MOCK_THRESHOLD}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
