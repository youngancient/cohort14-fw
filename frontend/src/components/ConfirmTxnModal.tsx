import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatAmount, truncateAddress } from "@/lib/multisig-types";
import { MOCK_TOKEN_SYMBOL } from "@/lib/mock-data";

interface ConfirmTxnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  recipient: string;
  amount: number;
}

export function ConfirmTxnModal({
  open,
  onOpenChange,
  onConfirm,
  recipient,
  amount,
}: ConfirmTxnModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="tracking-display">Confirm Transaction</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Please review the details before submitting this transaction.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-1">
            <span className="btn-label text-muted-foreground">Recipient</span>
            <div className="font-mono text-sm bg-surface border border-border rounded p-2 break-all">
              {recipient}
            </div>
            <span className="text-xs text-muted-foreground">
              Truncated: {truncateAddress(recipient)}
            </span>
          </div>

          <div className="space-y-1">
            <span className="btn-label text-muted-foreground">Amount</span>
            <div className="text-3xl font-medium tracking-display">
              {formatAmount(amount)}
              <span className="text-sm text-muted-foreground font-mono ml-2">
                {MOCK_TOKEN_SYMBOL}
              </span>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="btn-label">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-primary text-primary-foreground hover:bg-primary/85 btn-label"
          >
            Confirm & Submit
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
