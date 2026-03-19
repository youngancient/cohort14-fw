import { Shield, LayoutDashboard, History, Users, Settings, Wallet } from "lucide-react";
import { truncateAddress } from "@/lib/multisig-types";
import { MOCK_SIGNERS, MOCK_CONTRACT_ADDRESS, MOCK_VAULT_BALANCE, MOCK_TOKEN_SYMBOL } from "@/lib/mock-data";
import { formatAmount } from "@/lib/multisig-types";
import { useWallet } from "@/hooks/useWallet";
import { NavLink } from "@/components/NavLink";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, active: true, path: "/" },
  { label: "Transactions", icon: History, active: false },
  { label: "Signers", icon: Users, active: false },
  { label: "Settings", icon: Settings, active: false, path: "/settings" },
];

interface VaultSidebarProps {
  className?: string;
}

export function VaultSidebar({ className }: VaultSidebarProps) {
    const { account, connectWallet } = useWallet();
  return (
    <aside
      aria-label="Vault navigation"
      className={`
        w-full max-w-[280px] min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0
        ${className ?? ""}
      `}
    >
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-medium tracking-display text-foreground">Vanguard</h1>
            <p className="text-[10px] tracking-widest uppercase text-muted-foreground">Multisig</p>
          </div>
        </div>
      </div>

      {/* Vault info */}
      <div className="p-6 border-b border-sidebar-border space-y-3">
        <span className="btn-label text-muted-foreground">Vault Balance</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-medium tracking-display text-foreground">
            {formatAmount(MOCK_VAULT_BALANCE)}
          </span>
          <span className="text-xs font-mono text-muted-foreground">{MOCK_TOKEN_SYMBOL}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Wallet className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono text-[11px] text-muted-foreground">{truncateAddress(MOCK_CONTRACT_ADDRESS)}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-4 flex-1">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const baseNavClasses =
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors";
            const activeClasses = "bg-sidebar-accent text-foreground";
            const inactiveClasses = "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground";
            const buttonContent = (
              <>
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </>
            );

            return (
              <li key={item.label}>
                {item.path ? (
                  <NavLink
                    to={item.path}
                    className={`${baseNavClasses} ${inactiveClasses}`}
                    activeClassName={`${baseNavClasses} ${activeClasses}`}
                  >
                    {buttonContent}
                  </NavLink>
                ) : (
                  <button className={`${baseNavClasses} ${item.active ? activeClasses : inactiveClasses}`}>
                    {buttonContent}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

     {/* Connected wallet */}
<div className="p-4 border-t border-sidebar-border">
  {account ? (
    <>
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-md border border-border">
        <div className="w-2 h-2 rounded-full bg-success glow-dot" />
        <span className="font-mono text-xs text-foreground/70">
          {truncateAddress(account)}
        </span>
      </div>
      <span className="text-[10px] text-muted-foreground mt-2 block px-1">
        Connected · Signer
      </span>
    </>
  ) : (
    <button
      onClick={connectWallet}
      className="w-full px-3 py-2 rounded-md bg-primary text-white text-sm hover:opacity-90 transition"
    >
      Connect Wallet
    </button>
  )}
</div>
    </aside>
  );
}
