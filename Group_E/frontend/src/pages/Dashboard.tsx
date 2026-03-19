import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { VaultSidebar } from "@/components/VaultSidebar";
import { TransactionCard } from "@/components/TransactionCard";
import { TxnDetailPanel } from "@/components/TxnDetailPanel";
import { CreateTxnPanel } from "@/components/CreateTxnPanel";
import { MOCK_TRANSACTIONS, MOCK_TXN_SIGNERS, MOCK_THRESHOLD, MOCK_SIGNERS } from "@/lib/mock-data";
import { TxnStatus, type Transaction } from "@/lib/multisig-types";
import { Plus, Filter, Menu, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import { MobileNavDrawer } from "@/components/MobileNavDrawer";

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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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
        const newStatus = newApprovals >= MOCK_THRESHOLD ? TxnStatus.successful : TxnStatus.approved;
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
        const newStatus = newApprovals >= MOCK_THRESHOLD ? TxnStatus.successful : TxnStatus.approved;
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

  const heroChips = [
    { label: "Connected Signers", value: account ? "1 / 5" : "0 / 5" },
    { label: "Pending", value: pendingCount.toString() },
    { label: "Threshold", value: `${MOCK_THRESHOLD} sigs` },
  ];

  const statCards = [
    { label: "Total Transactions", value: transactions.length.toString(), detail: "All-time activity" },
    { label: "Awaiting You", value: needsAction.toString(), detail: "Needs your approval" },
    { label: "Ready for Execution", value: readyForExecution.length.toString(), detail: "Auto execute queue" },
  ];

  return (
    <div className="relative flex min-h-screen bg-background text-foreground">
      <MobileNavDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex w-full">
        <div className="hidden lg:flex">
          <VaultSidebar />
        </div>

        <main className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <header className="border-b border-border px-4 py-4 sm:px-6 lg:px-8" style={{ touchAction: "manipulation" }}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/50 text-muted-foreground transition hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  onClick={() => setMobileNavOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open navigation</span>
                </button>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">Vault operations</p>
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    Operations
                  </h1>
                </div>
              </div>
              <Button
                variant="action"
                onClick={() => setCreateOpen(true)}
                className="w-full rounded-2xl border border-transparent px-4 py-3 text-sm font-semibold leading-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 sm:w-auto sm:px-5 sm:text-base"
                style={{ touchAction: "manipulation" }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Transaction
              </Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground lg:text-base">
              {pendingNotReady.length} pending � {needsAction} awaiting signature � {readyForExecution.length} ready for execution
            </p>
          </header>

          <section className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-3">
                <p className="text-base font-medium text-foreground/90" style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.2rem)" }}>
                  Track approvals, explore pending flows, and stay ready no matter the device in hand.
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  <span>Touch ready</span>
                  <span aria-hidden="true">�</span>
                  <span>Fluid grids</span>
                  <span aria-hidden="true">�</span>
                  <span>Fast load</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {heroChips.map((chip) => (
                    <span
                      key={chip.label}
                      className="rounded-full border border-border/80 bg-surface px-3 py-1 text-[11px] font-semibold tracking-wide text-muted-foreground"
                    >
                      {chip.label}: <strong className="text-foreground">{chip.value}</strong>
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-slate-900/20 p-3 shadow-2xl shadow-primary/20">
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background/90" />
                <picture>
                  <source srcSet="/images/vault-hero-1200.svg 1200w, /images/vault-hero-768.svg 768w" media="(min-width: 1024px)" />
                  <source srcSet="/images/vault-hero-768.svg 768w, /images/vault-hero-480.svg 480w" media="(min-width: 640px)" />
                  <img
                    src="/images/vault-hero-480.svg"
                    alt="Abstract vault dashboard illustration"
                    className="h-40 w-full object-cover object-top transition-transform duration-500 ease-out hover:scale-[1.02]"
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 767px) 100vw, 280px"
                  />
                </picture>
              </div>
            </div>
          </section>

          <section className="px-4 pb-6 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {statCards.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-black/5">
                  <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                    {stat.label}
                  </span>
                  <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex-1 overflow-hidden px-4 pb-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3" style={{ touchAction: "manipulation" }}>
                <Filter className="h-4 w-4 text-muted-foreground" />
                {FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => {
                      setFilter(f.value);
                      setPage(1);
                    }}
                    className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors duration-150 ${
                      filter === f.value
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-surface text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                    style={{ touchAction: "manipulation" }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
                <div className="space-y-4">
                  {readyForExecution.length > 0 && (
                    <motion.div
                      layout
                      className="space-y-3 rounded-2xl border border-success/40 bg-success/5 p-4"
                    >
                      <div className="flex items-center gap-2 text-sm font-semibold text-success">
                        <div className="h-2 w-2 rounded-full bg-success glow-dot" />
                        Ready for execution
                        <span className="text-xs text-muted-foreground">({readyForExecution.length} txns)</span>
                      </div>
                      <div className="space-y-3">
                        {readyForExecution.map((txn) => (
                          <TransactionCard
                            key={`ready-${txn.id}`}
                            txn={txn}
                            signerAddresses={txn.approvers || []}
                            onSelect={setSelectedTxnId}
                            selected={selectedTxnId === txn.id}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

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

                  {totalPages > 1 && (
                    <div className="flex flex-wrap justify-center gap-2 pt-3">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={`page-${i}`}
                          type="button"
                          className={`font-mono text-xs px-3 py-2 rounded border transition-colors duration-150 ${
                            page === i + 1
                              ? "border-primary/40 bg-primary/10 text-primary"
                              : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          }`}
                          onClick={() => setPage(i + 1)}
                          style={{ touchAction: "manipulation" }}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedTxn && (
                  <motion.div layout className="hidden w-full lg:block">
                    <TxnDetailPanel
                      txn={selectedTxn}
                      onClose={() => setSelectedTxnId(null)}
                      onInitialize={() => handleInitialize(selectedTxnId!)}
                      onAuthorize={() => handleAuthorize(selectedTxnId!)}
                      onCancel={() => handleCancel(selectedTxnId!)}
                      connectedAccount={account}
                    />
                  </motion.div>
                )}
              </div>
              {selectedTxn && (
                <div className="lg:hidden">
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
          </section>
        </main>
      </div>

      <CreateTxnPanel
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreateTransaction={handleCreateTransaction}
      />
    </div>
  );

}
