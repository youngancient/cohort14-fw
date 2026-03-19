import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { MOCK_TOKEN_SYMBOL } from "@/lib/mock-data";

interface CreateTxnPanelProps {
  open: boolean;
  onClose: () => void;
}

export function CreateTxnPanel({ open, onClose }: CreateTxnPanelProps) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: just close
    onClose();
    setRecipient("");
    setAmount("");
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
                  onChange={(e) => setRecipient(e.target.value)}
                  className="font-mono bg-surface border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label className="btn-label text-muted-foreground">Amount ({MOCK_TOKEN_SYMBOL})</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="font-mono text-lg bg-surface border-border focus:border-primary"
                />
              </div>

              <div className="mt-auto">
                <Button type="submit" variant="action" className="w-full h-12">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Transaction
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}