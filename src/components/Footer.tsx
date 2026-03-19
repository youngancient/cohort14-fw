export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6 md:px-8 text-white"  style={{
          background: "#08090f",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
      <div className="w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #00e5ff, #0066ff)" }}
          >
            <span className="text-[#08090f] font-black text-sm">GB</span>
          </div>
          <span
            className="text-white font-bold text-lg tracking-tight"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            GroupB
          </span>
        </div>

        <p className="text-[11px] text-text-muted text-center">
          ERC20 Token Factory · Built on Lisk Sepolia Testnet
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/gharneeyart/GroupB-Frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-text-muted hover:text-cyan transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://sepolia.etherscan.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-text-muted hover:text-cyan transition-colors"
          >
            Etherscan
          </a>
          <a
            href="https://docs.soliditylang.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-text-muted hover:text-cyan transition-colors"
          >
            Solidity Docs
          </a>
        </div>
      </div>
    </footer>
  )
}
