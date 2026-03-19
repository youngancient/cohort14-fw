import { motion, AnimatePresence } from "framer-motion";
import { Transaction, TxnStatus, truncateAddress, formatAmount, STATUS_LABELS, STATUS_CLASSES } from "@/lib/multisig-types";
import { MOCK_THRESHOLD, MOCK_TOKEN_SYMBOL, MOCK_TXN_SIGNERS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ThresholdTracker } from "./ThresholdTracker";
import { X, CheckCircle2 } from "lucide-react";

interface TxnDetailPanelProps {
  txn: Transaction | null;
  onClose: () => void;
  onInitialize?: () => void;
  onAuthorize?: () => void;
  onCancel?: () => void;
  connectedAccount?: string | null;
}

export function TxnDetailPanel({ txn, onClose, onInitialize, onAuthorize, onCancel, connectedAccount }: TxnDetailPanelProps) {
  if (!txn) return null;

  const signers = MOCK_TXN_SIGNERS.filter((s) => s.txnId === txn.id);
  const approvers = txn.approvers || [];
  const hasApproved = connectedAccount ? approvers.includes(connectedAccount) : false;
  const isInitiator = connectedAccount ? txn.txnInitiator.toLowerCase() === connectedAccount.toLowerCase() : false;

  return (
    <AnimatePresence>
      <motion.div
        key={txn.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-card border border-border rounded-lg p-6 space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium tracking-display">
            Transaction <span className="font-mono text-primary">#{txn.id}</span>
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <span className="btn-label text-muted-foreground block mb-1">Status</span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_CLASSES[txn.status]}`}>
              {STATUS_LABELS[txn.status]}
            </span>
          </div>

          <div>
            <span className="btn-label text-muted-foreground block mb-1">Amount</span>
            <span className="text-3xl font-medium tracking-display">{formatAmount(txn.amount)}</span>
            <span className="text-sm text-muted-foreground font-mono ml-2">{MOCK_TOKEN_SYMBOL}</span>
          </div>

          <div>
            <span className="btn-label text-muted-foreground block mb-1">Recipient</span>
            <span className="font-mono text-sm text-foreground/80">{txn.to}</span>
          </div>

          <div>
            <span className="btn-label text-muted-foreground block mb-1">Initiator</span>
            <span className="font-mono text-sm text-foreground/80">{truncateAddress(txn.txnInitiator)}</span>
          </div>

          <div>
            <span className="btn-label text-muted-foreground block mb-1">Signer Progress</span>
            <ThresholdTracker
              approvals={txn.approvals}
              threshold={MOCK_THRESHOLD}
              maxSigners={5}
              signerAddresses={signers.map((s) => s.signerAddress)}
            />
            <span className="font-mono text-xs text-muted-foreground mt-1 block">
              {txn.approvals} of {MOCK_THRESHOLD} required
            </span>
            {txn.status === TxnStatus.pending && txn.approvals >= MOCK_THRESHOLD && (
              <span className="text-xs text-success mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Ready for execution
              </span>
            )}
          </div>

          {approvers.length > 0 && (
            <div>
              <span className="btn-label text-muted-foreground block mb-2">Approvers</span>
              <div className="space-y-2">
                {approvers.map((addr, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-2 py-1.5 bg-muted/50 rounded-md border border-border"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary glow-dot" />
                    <span className="font-mono text-xs text-foreground/70">{truncateAddress(addr)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {txn.executedTime > 0 && (
            <div>
              <span className="btn-label text-muted-foreground block mb-1">Executed</span>
              <span className="text-sm text-foreground/70">
                {new Date(txn.executedTime * 1000).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Contextual actions */}
        {(txn.status === TxnStatus.pending || txn.status === TxnStatus.approved) && (
          <div className="flex gap-3 pt-4 border-t border-border">
            {!txn.initiatorApproved && isInitiator && (
              <Button variant="action" onClick={onInitialize} className="flex-1">
                Initialize
              </Button>
            )}
            {txn.initiatorApproved && txn.approvals < MOCK_THRESHOLD && !hasApproved && (
              <Button variant="authorize" onClick={onAuthorize} className="flex-1">
                Authorize
              </Button>
            )}
            {txn.initiatorApproved && txn.approvals < MOCK_THRESHOLD && hasApproved && (
              <Button variant="outline" disabled className="flex-1">
                Already Approved
              </Button>
            )}
            {isInitiator && !txn.executed && (txn.status === TxnStatus.pending || txn.status === TxnStatus.approved) && (
              <Button variant="surface" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}