export default function Footer() {
  return (
    <footer className="border-t py-8 px-6 md:px-8 text-white w-full"  style={{
          background: "var(--bg-darkest)",
          borderBottom: "1px solid var(--border-card)",
          borderTop: "1px solid var(--border-card)",
        }}>
      <div className="w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--accent-cyan), #0066ff)" }}
          >
            <span className="text-[var(--bg-darkest)] font-black text-sm">GB</span>
          </div>
          <span
            className="text-white font-bold text-lg tracking-tight"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            GroupB
          </span>
        </div>

        <p className="text-[11px] text-[var(--text-muted)] text-center">
          ERC20 Token Factory · Built on Lisk Sepolia Testnet
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/gharneeyart/GroupB-Frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] hover:opacity-80 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            GitHub
          </a>
          <a
            href="https://sepolia.etherscan.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] hover:opacity-80 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            Etherscan
          </a>
          <a
            href="https://docs.soliditylang.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] hover:opacity-80 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            Solidity Docs
          </a>
        </div>
      </div>
    </footer>
  )
}
