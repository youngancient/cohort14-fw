import { motion, AnimatePresence } from "framer-motion";
import { Transaction, TxnStatus, truncateAddress, formatAmount, STATUS_LABELS, STATUS_CLASSES } from "@/lib/multisig-types";
import { MOCK_THRESHOLD, MOCK_TOKEN_SYMBOL, MOCK_TXN_SIGNERS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ThresholdTracker } from "./ThresholdTracker";
import { X } from "lucide-react";

interface TxnDetailPanelProps {
  txn: Transaction | null;
  onClose: () => void;
}

export function TxnDetailPanel({ txn, onClose }: TxnDetailPanelProps) {
  if (!txn) return null;

  const signers = MOCK_TXN_SIGNERS.filter((s) => s.txnId === txn.id);

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
          </div>

          {signers.length > 0 && (
            <div>
              <span className="btn-label text-muted-foreground block mb-2">Signers</span>
              <div className="space-y-2">
                {signers.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-2 py-1.5 bg-muted/50 rounded-md border border-border"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary glow-dot" />
                    <span className="font-mono text-xs text-foreground/70">{truncateAddress(s.signerAddress)}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      {new Date(s.timeSigned * 1000).toLocaleDateString()}
                    </span>
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
        {txn.status === TxnStatus.pending && (
          <div className="flex gap-3 pt-4 border-t border-border">
            {!txn.initiatorApproved && (
              <Button variant="action" className="flex-1">Initialize</Button>
            )}
            {txn.initiatorApproved && txn.approvals < MOCK_THRESHOLD && (
              <Button variant="authorize" className="flex-1">Authorize</Button>
            )}
            <Button variant="surface" className="flex-1">Cancel</Button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}