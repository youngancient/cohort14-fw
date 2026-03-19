import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, AlertCircle } from "lucide-react";
import { MOCK_TOKEN_SYMBOL } from "@/lib/mock-data";
import { ConfirmTxnModal } from "./ConfirmTxnModal";

interface CreateTxnPanelProps {
  open: boolean;
  onClose: () => void;
  onCreateTransaction: (recipient: string, amount: number) => void;
}

// Validate Ethereum address format
function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function CreateTxnPanel({ open, onClose, onCreateTransaction }: CreateTxnPanelProps) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<{ recipient?: string; amount?: string }>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { recipient?: string; amount?: string } = {};

    // Validate recipient address
    if (!recipient.trim()) {
      newErrors.recipient = "Recipient address is required";
    } else if (!isValidAddress(recipient)) {
      newErrors.recipient = "Invalid Ethereum address format";
    }

    // Validate amount
    if (!amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    } else if (isNaN(parseFloat(amount))) {
      newErrors.amount = "Amount must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirm = () => {
    onCreateTransaction(recipient, parseFloat(amount));
    setShowConfirmModal(false);
    onClose();
    setRecipient("");
    setAmount("");
    setErrors({});
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-medium tracking-display">Create Transaction</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 p-6 flex flex-col gap-6">
              <div className="space-y-2">
                <Label className="btn-label text-muted-foreground">Recipient Address</Label>
                <Input
                  placeholder="0x..."
                  value={recipient}
                  onChange={(e) => {
                    setRecipient(e.target.value);
                    if (errors.recipient) setErrors({ ...errors, recipient: undefined });
                  }}
                  className={`font-mono bg-surface focus:border-primary ${
                    errors.recipient ? "border-destructive" : "border-border"
                  }`}
                />
                {errors.recipient && (
                  <div className="flex items-center gap-2 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.recipient}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="btn-label text-muted-foreground">Amount ({MOCK_TOKEN_SYMBOL})</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errors.amount) setErrors({ ...errors, amount: undefined });
                  }}
                  className={`font-mono text-lg bg-surface focus:border-primary ${
                    errors.amount ? "border-destructive" : "border-border"
                  }`}
                />
                {errors.amount && (
                  <div className="flex items-center gap-2 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.amount}</span>
                  </div>
                )}
              </div>

              <div className="mt-auto">
                <Button type="submit" variant="action" className="w-full h-12">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Transaction
                </Button>
              </div>
            </form>

            <ConfirmTxnModal
              open={showConfirmModal}
              onOpenChange={setShowConfirmModal}
              onConfirm={handleConfirm}
              recipient={recipient}
              amount={amount ? parseFloat(amount) : 0}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}