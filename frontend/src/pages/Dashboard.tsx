import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { VaultSidebar } from "@/components/VaultSidebar";
import { TransactionCard } from "@/components/TransactionCard";
import { TxnDetailPanel } from "@/components/TxnDetailPanel";
import { CreateTxnPanel } from "@/components/CreateTxnPanel";
import { MOCK_TRANSACTIONS, MOCK_TXN_SIGNERS, MOCK_THRESHOLD, MOCK_SIGNERS } from "@/lib/mock-data";
import { TxnStatus, type Transaction } from "@/lib/multisig-types";
import { Plus, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";

type FilterType = "all" | "pending" | "successful" | "canceled";

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  // { label: "Approved by Me", value: "approved" },
  { label: "Executed", value: "successful" },
  { label: "Canceled", value: "canceled" },
];

const FILTER_MAP = {
  all: null,
  pending: TxnStatus.pending,
  approved: (t: Transaction, account: string | null) => {
    if (!account) return false;
    if (t.status !== TxnStatus.approved) return false;
    // Case-insensitive address comparison
    return t.approvers?.some(a => a.toLowerCase() === account.toLowerCase()) || false;
  },
  successful: TxnStatus.successful,
  canceled: TxnStatus.canceled,
};

export default function Dashboard() {
  const [selectedTxnId, setSelectedTxnId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const { account, connectWallet } = useWallet();

  // Initialize transactions from localStorage or use mock data
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("multisig_transactions");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MOCK_TRANSACTIONS;
      }
    }
    return MOCK_TRANSACTIONS;
  });

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("multisig_transactions", JSON.stringify(transactions));
  }, [transactions]);

  const handleCreateTransaction = (recipient: string, amount: number) => {
    // Check if wallet is connected
    if (!account) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      connectWallet();
      return;
    }

    const newTxn: Transaction = {
      id: transactions.length + 1,
      to: recipient,
      amount: amount,
      approvals: 0,
      initiatorApproved: false,
      executed: false,
      status: TxnStatus.pending,
      txnInitiator: account, // Use connected wallet address
      executedTime: 0,
      approvers: [],
    };

    setTransactions([newTxn, ...transactions]);
    toast({
      title: "Transaction Created",
      description: `Transaction #${newTxn.id} submitted successfully`,
    });
  };

  // Initialize transaction (first approval by initiator)
  const handleInitialize = (txnId: number) => {
    if (!account) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      connectWallet();
      return;
    }

    setTransactions((prev) =>
      prev.map((txn) => {
        if (txn.id !== txnId) return txn;
        if (txn.initiatorApproved || txn.executed || txn.status === TxnStatus.canceled) {
          return txn;
        }

        const newApprovals = txn.approvals + 1;
        const newApprovers = [...(txn.approvers || []), account];
        let newStatus = newApprovals >= MOCK_THRESHOLD ? TxnStatus.successful : TxnStatus.approved;
        let newExecuted = txn.executed;
        let newExecutedTime = txn.executedTime;

        // Auto-execute if threshold reached
        if (newApprovals >= MOCK_THRESHOLD) {
          newExecuted = true;
          newExecutedTime = Math.floor(Date.now() / 1000);
        }

        return {
          ...txn,
          initiatorApproved: true,
          approvals: newApprovals,
          approvers: newApprovers,
          status: newStatus,
          executed: newExecuted,
          executedTime: newExecutedTime,
        };
      })
    );

    toast({
      title: "Transaction Initialized",
      description: `Transaction #${txnId} has been initialized`,
    });
  };

  // Authorize transaction (subsequent approvals)
  const handleAuthorize = (txnId: number) => {
    if (!account) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      connectWallet();
      return;
    }

    setTransactions((prev) =>
      prev.map((txn) => {
        if (txn.id !== txnId) return txn;
        if (txn.executed || txn.status === TxnStatus.canceled) {
          return txn;
        }
        // Check if already approved by this account
        if (txn.approvers?.includes(account)) {
          return txn;
        }

        const newApprovals = txn.approvals + 1;
        const newApprovers = [...(txn.approvers || []), account];
        let newStatus = newApprovals >= MOCK_THRESHOLD ? TxnStatus.successful : TxnStatus.approved;
        let newExecuted = txn.executed;
        let newExecutedTime = txn.executedTime;

        // Auto-execute if threshold reached
        if (newApprovals >= MOCK_THRESHOLD) {
          newExecuted = true;
          newExecutedTime = Math.floor(Date.now() / 1000);
        }

        return {
          ...txn,
          approvals: newApprovals,
          approvers: newApprovers,
          status: newStatus,
          executed: newExecuted,
          executedTime: newExecutedTime,
        };
      })
    );

    toast({
      title: "Transaction Authorized",
      description: `Transaction #${txnId} has been authorized`,
    });
  };

  // Cancel transaction (only by initiator)
  const handleCancel = (txnId: number) => {
    if (!account) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      connectWallet();
      return;
    }

    setTransactions((prev) =>
      prev.map((txn) => {
        if (txn.id !== txnId) return txn;
        if (txn.executed || txn.status === TxnStatus.canceled || txn.status === TxnStatus.successful) {
          return txn;
        }
        // Only initiator can cancel
        if (txn.txnInitiator.toLowerCase() !== account.toLowerCase()) {
          return txn;
        }

        return {
          ...txn,
          status: TxnStatus.canceled,
          executed: true,
          executedTime: Math.floor(Date.now() / 1000),
        };
      })
    );

    toast({
      title: "Transaction Canceled",
      description: `Transaction #${txnId} has been canceled`,
    });
  };

  const perPage = 10;
  const statusFilter = FILTER_MAP[filter];
  
  // Separate transactions by execution readiness
  const readyForExecution = transactions.filter(
    (t) => t.status === TxnStatus.approved && t.approvals >= MOCK_THRESHOLD
  );
  const pendingNotReady = transactions.filter(
    (t) => t.status === TxnStatus.pending && t.approvals < MOCK_THRESHOLD
  );
  
  // Apply filter
  let filtered = transactions;
  if (statusFilter === null) {
    filtered = transactions;
  } else if (typeof statusFilter === 'function') {
    filtered = transactions.filter((t) => statusFilter(t, account));
  } else {
    filtered = transactions.filter((t) => t.status === statusFilter);
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const selectedTxn = selectedTxnId ? transactions.find((t) => t.id === selectedTxnId) ?? null : null;

  const getSignerAddresses = (txnId: number) =>
    MOCK_TXN_SIGNERS.filter((s) => s.txnId === txnId).map((s) => s.signerAddress);

  const pendingCount = transactions.filter((t) => t.status === TxnStatus.pending).length;
  const needsAction = transactions.filter(
    (t) => t.status === TxnStatus.pending && t.initiatorApproved && t.approvals < MOCK_THRESHOLD && !t.approvers?.includes(account || "")
  ).length;

  return (
    <div className="flex min-h-screen bg-background">
      <VaultSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b border-border px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium tracking-display">Operations</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {pendingNotReady.length} pending · {needsAction} awaiting signature · {readyForExecution.length} ready for execution
            </p>
          </div>
          <Button variant="action" onClick={() => setCreateOpen(true)} className="h-10">
            <Plus className="h-4 w-4 mr-2" />
            Create Transaction
          </Button>
        </header>

        {/* Stats */}
        <div className="px-8 py-6 grid grid-cols-3 gap-4">
          {[
            { label: "Total Transactions", value: transactions.length.toString() },
            { label: "Active Signers", value: account ? "1 / 5" : "0 / 5" },
            { label: "Threshold", value: MOCK_THRESHOLD.toString() + " signatures" },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface border border-border rounded-lg p-4">
              <span className="btn-label text-muted-foreground">{stat.label}</span>
              <p className="text-xl font-medium tracking-display mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 px-8 pb-8 flex gap-6">
          {/* Transaction list */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Ready for Execution Section */}
            {readyForExecution.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success glow-dot" />
                  <h3 className="text-sm font-medium text-success">Ready for Execution</h3>
                  <span className="text-xs text-muted-foreground">({readyForExecution.length} transactions)</span>
                </div>
                {readyForExecution.map((txn) => (
                  <TransactionCard
                    key={txn.id}
                    txn={txn}
                    signerAddresses={txn.approvers || []}
                    onSelect={setSelectedTxnId}
                    selected={selectedTxnId === txn.id}
                  />
                ))}
              </div>
            )}

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => { setFilter(f.value); setPage(1); }}
                  className={`
                    btn-label px-3 py-1.5 rounded-md border transition-colors
                    ${filter === f.value
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-surface border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
                    }
                  `}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-3">
              {paginated.map((txn) => (
                <TransactionCard
                  key={txn.id}
                  txn={txn}
                  signerAddresses={getSignerAddresses(txn.id)}
                  onSelect={setSelectedTxnId}
                  selected={selectedTxnId === txn.id}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`
                      font-mono text-xs px-3 py-1.5 rounded border transition-colors
                      ${page === i + 1
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-surface border-border text-muted-foreground hover:text-foreground"
                      }
                    `}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selectedTxn && (
            <div className="w-[380px] shrink-0">
              <TxnDetailPanel
                txn={selectedTxn}
                onClose={() => setSelectedTxnId(null)}
                onInitialize={() => handleInitialize(selectedTxnId!)}
                onAuthorize={() => handleAuthorize(selectedTxnId!)}
                onCancel={() => handleCancel(selectedTxnId!)}
                connectedAccount={account}
              />
            </div>
          )}
        </div>
      </main>

      <CreateTxnPanel
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreateTransaction={handleCreateTransaction}
      />
    </div>
  );
}
