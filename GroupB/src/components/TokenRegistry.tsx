import { useState } from "react";

const tokens = [
  { symbol: "CR", name: "CryptoX",     ticker: "CRX",  contractAddress: "0xA1b2C3d4...7890", deployer: "0x9f8e7d6c...5b4a", supply: "10,000,000",  date: "2025-03-12" },
  { symbol: "DE", name: "DevCoin",     ticker: "DEV",  contractAddress: "0xB2c3D4e5...8901", deployer: "0x1a2b3c4d...5e6f", supply: "500,000",     date: "2025-03-10" },
  { symbol: "GB", name: "GroupB Test", ticker: "GBT",  contractAddress: "0xC3d4E5f6...9012", deployer: "0x4d5e6f7g...8h9i", supply: "1,000,000",   date: "2025-03-08" },
  { symbol: "LB", name: "LabToken",    ticker: "LBT",  contractAddress: "0xD4e5F6a7...0123", deployer: "0x7g8h9i0j...1k2l", supply: "250,000,000", date: "2025-03-05" },
  { symbol: "TN", name: "TestNet20",   ticker: "TN20", contractAddress: "0xE5f6A7b8...1234", deployer: "0xjklm12no...qrst", supply: "100,000",     date: "2025-03-01" },
];

function CopyIcon({ copied }: { copied: boolean }) {
  return copied ? (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,55,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ) : (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

// Rotations for the awkward-but-intentional avatar tilt
const tilts = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-3", "-rotate-3"];
const offsets = ["translate-y-[2px]", "-translate-y-[1px]", "translate-y-[3px]", "-translate-y-[2px]", "translate-y-[1px]"];

export default function TokenRegistry() {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const filtered = tokens.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.ticker.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&display=swap');

        .reg-root {
          min-height: 100vh;
          padding: clamp(48px, 7vw, 96px) clamp(16px, 5vw, 64px);
          position: relative;
          overflow: hidden;
          font-family: 'DM Mono', 'Courier New', monospace;
        }

        /* Diagonal rule lines — blueprint feel */
        .reg-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(
              -55deg,
              transparent,
              transparent 80px,
              rgba(212,175,55,0.018) 80px,
              rgba(212,175,55,0.018) 81px
            );
          pointer-events: none;
          z-index: 0;
        }

        .reg-inner { max-width: 1120px; margin: 0 auto; position: relative; z-index: 1; }

        /* Giant background number */
        .reg-bg-num {
          position: absolute;
          top: -32px;
          right: -24px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(120px, 18vw, 240px);
          color: rgba(212,175,55,0.03);
          pointer-events: none;
          line-height: 1;
          letter-spacing: -0.02em;
          user-select: none;
          z-index: 0;
        }

        /* Header — intentionally off-axis */
        .reg-header {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          margin-bottom: 40px;
          gap: 16px;
        }
        .reg-eyebrow {
          font-size: 9px;
          letter-spacing: 0.42em;
          text-transform: uppercase;
          color: rgba(212,175,55,0.4);
          margin-bottom: 10px;
        }
        .reg-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(42px, 6vw, 72px);
          color: rgba(255,255,255,0.90);
          margin: 0;
          letter-spacing: 0.04em;
          line-height: 0.9;
          /* Awkward: slightly pushed right */
          padding-left: clamp(0px, 1.5vw, 24px);
          text-shadow: 0 0 60px rgba(212,175,55,0.12);
        }
        .reg-title em {
          font-style: normal;
          color: rgba(212,175,55,0.7);
        }
        .reg-header-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          padding-bottom: 4px;
        }
        .reg-count {
          font-size: 10px;
          letter-spacing: 0.2em;
          color: rgba(212,175,55,0.35);
          text-transform: uppercase;
          border-bottom: 1px solid rgba(212,175,55,0.15);
          padding-bottom: 4px;
        }

        /* Search — deliberately undersized and right-anchored */
        .reg-search-wrap { position: relative; }
        .reg-search {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          padding: 6px 4px 6px 22px;
          outline: none;
          width: 170px;
          transition: border-color 0.2s;
        }
        .reg-search::placeholder { color: rgba(255,255,255,0.18); }
        .reg-search:focus { border-bottom-color: rgba(212,175,55,0.4); }
        .reg-search-icon {
          position: absolute; left: 0; top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }

        /* Rows — card-per-row layout instead of table */
        .reg-list { display: flex; flex-direction: column; gap: 2px; }

        .reg-row {
          display: grid;
          grid-template-columns: 52px 1fr 1fr 1fr 100px 80px 80px;
          align-items: center;
          gap: 0 20px;
          padding: 16px 20px;
          border: 1px solid transparent;
          border-left: 2px solid transparent;
          transition: background 0.15s, border-color 0.15s;
          position: relative;
          cursor: default;
        }
        .reg-row:hover {
          background: rgba(212,175,55,0.03);
          border-color: rgba(212,175,55,0.1);
          border-left-color: rgba(212,175,55,0.45);
        }

        /* Header row */
        .reg-row-head {
          padding: 8px 20px 8px;
          grid-template-columns: 52px 1fr 1fr 1fr 100px 80px 80px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 4px;
        }
        .reg-col-label {
          font-size: 8.5px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.18);
        }

        /* Avatar — skewed intentionally */
        .reg-avatar {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          color: rgba(212,175,55,0.8);
          background: rgba(212,175,55,0.06);
          border: 1px solid rgba(212,175,55,0.2);
          letter-spacing: 0.06em;
          flex-shrink: 0;
          /* no border-radius — square on purpose */
          transition: background 0.2s, border-color 0.2s;
        }
        .reg-row:hover .reg-avatar {
          background: rgba(212,175,55,0.1);
          border-color: rgba(212,175,55,0.4);
        }

        .reg-token-name {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          letter-spacing: 0.01em;
        }
        .reg-token-ticker {
          font-size: 9px;
          color: rgba(212,175,55,0.4);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .reg-addr { font-size: 11px; color: rgba(255,255,255,0.28); letter-spacing: 0.02em; }
        .reg-addr-cell { display: flex; align-items: center; gap: 6px; }
        .reg-copy-btn {
          background: none; border: none; cursor: pointer;
          padding: 2px; display: flex; align-items: center;
          opacity: 0; transition: opacity 0.15s;
        }
        .reg-row:hover .reg-copy-btn { opacity: 1; }
        .reg-copy-btn:hover svg { stroke: rgba(212,175,55,0.8) !important; }

        .reg-supply {
          font-size: 11px;
          color: rgba(212,175,55,0.65);
          letter-spacing: 0.04em;
        }
        .reg-date {
          font-size: 10px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.06em;
        }

        /* Test button — angular, no radius */
        .reg-test-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.3);
          font-size: 10px;
          padding: 6px 12px;
          cursor: pointer;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: all 0.15s;
          border-radius: 0;
          white-space: nowrap;
        }
        .reg-test-btn:hover {
          border-color: rgba(212,175,55,0.4);
          color: rgba(212,175,55,0.8);
          background: rgba(212,175,55,0.04);
        }

        /* Footer */
        .reg-footer {
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .reg-footer-left {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.12);
        }
        .reg-live-wrap { display: flex; align-items: center; gap: 7px; }
        .reg-live-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(212,175,55,0.7);
          box-shadow: 0 0 6px rgba(212,175,55,0.6);
          animation: regPulse 2.4s ease-in-out infinite;
        }
        .reg-live-label { font-size: 9px; color: rgba(212,175,55,0.35); letter-spacing: 0.2em; text-transform: uppercase; }

        .reg-empty {
          padding: 56px 24px;
          text-align: center;
          color: rgba(255,255,255,0.15);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        @keyframes regPulse {
          0%, 100% { opacity: 0.8; }
          50%       { opacity: 0.3; }
        }

        @media (max-width: 768px) {
          .reg-row, .reg-row-head {
            grid-template-columns: 40px 1fr 80px;
          }
          .reg-col-addr, .reg-col-deployer, .reg-col-date, .reg-td-addr, .reg-td-deployer, .reg-td-date {
            display: none;
          }
        }
      `}</style>

      <div className="reg-root">
        <div className="reg-bg-num">REG</div>
        <div className="reg-inner">

          {/* Header */}
          <div className="reg-header">
            <div>
              <div className="reg-eyebrow">◈ &nbsp;On-chain · Lisk Sepolia</div>
              <h1 className="reg-title">Token<br /><em>Registry</em></h1>
            </div>
            <div className="reg-header-right">
              <span className="reg-count">{filtered.length} of {tokens.length} records</span>
              <div className="reg-search-wrap">
                <svg className="reg-search-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  className="reg-search"
                  type="text"
                  placeholder="filter tokens…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Column headers */}
          <div className="reg-list">
            <div className="reg-row reg-row-head" style={{ cursor: 'default', alignItems: 'center' }}>
              <div />
              <div className="reg-col-label">Token</div>
              <div className="reg-col-label reg-col-addr">Contract</div>
              <div className="reg-col-label reg-col-deployer">Deployer</div>
              <div className="reg-col-label">Supply</div>
              <div className="reg-col-label reg-col-date">Deployed</div>
              <div className="reg-col-label" />
            </div>

            {filtered.length === 0 ? (
              <div className="reg-empty">— no tokens match —</div>
            ) : (
              filtered.map((token, idx) => (
                <div
                  key={token.ticker}
                  className="reg-row"
                  
                  
                >
                  {/* Avatar — slightly tilted per row */}
                  <div
                    className={`reg-avatar ${tilts[idx % tilts.length]} ${offsets[idx % offsets.length]}`}
                  >
                    {token.symbol}
                  </div>

                  {/* Name */}
                  <div>
                    <div className="reg-token-name">{token.name}</div>
                    <div className="reg-token-ticker">{token.ticker}</div>
                  </div>

                  {/* Contract */}
                  <div className="reg-addr-cell reg-td-addr">
                    <span className="reg-addr">{token.contractAddress}</span>
                    <button className="reg-copy-btn" onClick={() => handleCopy(token.contractAddress, `c-${idx}`)}>
                      <CopyIcon copied={copiedField === `c-${idx}`} />
                    </button>
                  </div>

                  {/* Deployer */}
                  <div className="reg-addr-cell reg-td-deployer">
                    <span className="reg-addr">{token.deployer}</span>
                    <button className="reg-copy-btn" onClick={() => handleCopy(token.deployer, `d-${idx}`)}>
                      <CopyIcon copied={copiedField === `d-${idx}`} />
                    </button>
                  </div>

                  {/* Supply */}
                  <div className="reg-supply">{token.supply}</div>

                  {/* Date */}
                  <div className="reg-date reg-td-date">{token.date}</div>

                  {/* Action */}
                  <div>
                    <button className="reg-test-btn">Test →</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="reg-footer">
            <span className="reg-footer-left">Verifiable · Immutable · Open</span>
            <div className="reg-live-wrap">
              <div className="reg-live-dot" />
              <span className="reg-live-label">Live</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}