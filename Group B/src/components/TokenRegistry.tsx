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
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#17c8c4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: "all 0.2s" }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ) : (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2e6470" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: "all 0.2s" }}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

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
        .reg-page {
          min-height: 100vh;
          background: #0a0f18;
          font-family: 'Courier New', Courier, monospace;
          padding: clamp(32px, 5vw, 64px) clamp(16px, 4vw, 48px);
          color: #c5cdd8;
        }
        .reg-inner { max-width: 1100px; margin: 0 auto; }

        /* Header */
        .reg-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .reg-title-row { display: flex; align-items: center; gap: 14px; }
        .reg-accent-bar {
          width: 3px;
          height: 32px;
          border-radius: 2px;
          background: linear-gradient(180deg, #17c8c4, rgba(23,184,196,0.2));
          flex-shrink: 0;
        }
        .reg-title-group { display: flex; flex-direction: column; gap: 3px; }
        .reg-title {
          font-size: clamp(18px, 2.5vw, 22px);
          font-weight: 700;
          color: #dde6f0;
          margin: 0;
          letter-spacing: 0.02em;
        }
        .reg-subtitle {
          font-size: 10px;
          color: rgba(23,184,196,0.45);
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .reg-header-right { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .reg-count-badge {
          font-size: 10px;
          color: #17c8c4;
          letter-spacing: 0.1em;
          background: rgba(23,184,196,0.07);
          border: 1px solid rgba(23,184,196,0.18);
          padding: 5px 12px;
          border-radius: 4px;
        }

        /* Search */
        .reg-search-wrap { position: relative; }
        .reg-search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }
        .reg-search {
          background: rgba(23,184,196,0.04);
          border: 1px solid rgba(23,184,196,0.14);
          color: #dde6f0;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          padding: 7px 12px 7px 30px;
          border-radius: 4px;
          outline: none;
          width: 190px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .reg-search::placeholder { color: rgba(61,138,150,0.5); }
        .reg-search:focus {
          border-color: rgba(23,184,196,0.35);
          box-shadow: 0 0 0 3px rgba(23,184,196,0.06);
        }

        /* Card */
        .reg-card {
          background: #0d1520;
          border-radius: 10px;
          border: 1px solid #162030;
          overflow: hidden;
          box-shadow: 0 4px 40px rgba(0,0,0,0.4), 0 1px 0 rgba(23,184,196,0.06) inset;
        }

        /* Top accent line on card */
        .reg-card-topline {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(23,184,196,0.3), transparent);
        }

        .reg-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .reg-table { width: 100%; border-collapse: collapse; min-width: 600px; }

        /* Table head */
        .reg-table thead tr {
          border-bottom: 1px solid #162030;
          background: rgba(23,184,196,0.025);
        }
        .reg-table th {
          padding: 12px 18px;
          text-align: left;
          font-size: 9.5px;
          font-weight: 600;
          color: rgba(23,184,196,0.45);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        /* Table rows */
        .reg-table td { padding: 15px 18px; vertical-align: middle; }
        .reg-tr { border-bottom: 1px solid #111c28; transition: background 0.15s; }
        .reg-tr:last-child { border-bottom: none; }
        .reg-tr:hover { background: rgba(23,184,196,0.03); }
        .reg-tr:hover .reg-avatar { box-shadow: 0 0 0 1px rgba(23,184,196,0.35), inset 0 1px 2px rgba(255,255,255,0.08); }

        /* Avatar */
        .reg-avatar {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: linear-gradient(135deg, #1a8898 0%, #0b4e5e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          color: #b8e8ee;
          flex-shrink: 0;
          border: 1px solid #175868;
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.08);
          transition: box-shadow 0.2s;
          letter-spacing: 0.04em;
        }

        /* Token name cell */
        .reg-token-wrap { display: flex; align-items: center; gap: 12px; }
        .reg-token-name { font-size: 13px; font-weight: 600; color: #dde6f0; line-height: 1.3; }
        .reg-token-ticker {
          font-size: 9.5px;
          color: rgba(23,184,196,0.5);
          margin-top: 2px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* Address cells */
        .reg-addr-cell { display: flex; align-items: center; gap: 6px; }
        .reg-addr { font-size: 11.5px; color: #3d8a96; white-space: nowrap; letter-spacing: 0.02em; }
        .reg-copy-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 3px;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          border-radius: 3px;
          transition: background 0.15s;
        }
        .reg-copy-btn:hover { background: rgba(23,184,196,0.1); }
        .reg-copy-btn:hover svg { stroke: #17c8c4 !important; }

        /* Supply badge */
        .reg-supply {
          display: inline-block;
          background: rgba(9,31,36,0.8);
          color: #17c8c4;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid rgba(23,184,196,0.18);
          white-space: nowrap;
          letter-spacing: 0.04em;
        }

        /* Date */
        .reg-date { font-size: 11px; color: #3a6a72; white-space: nowrap; letter-spacing: 0.04em; }

        /* Test button */
        .reg-test-btn {
          background: transparent;
          border: 1px solid #1e3540;
          color: #7aaab4;
          font-size: 11px;
          padding: 6px 14px;
          border-radius: 5px;
          cursor: pointer;
          font-family: 'Courier New', monospace;
          white-space: nowrap;
          letter-spacing: 0.08em;
          transition: border-color 0.15s, color 0.15s, background 0.15s, box-shadow 0.15s;
        }
        .reg-test-btn:hover {
          border-color: #17b8c4;
          color: #17b8c4;
          background: rgba(23,184,196,0.05);
          box-shadow: 0 0 10px rgba(23,184,196,0.08);
        }

        /* Empty state */
        .reg-empty {
          padding: 48px 24px;
          text-align: center;
          color: #2e6470;
          font-size: 12px;
          letter-spacing: 0.1em;
        }

        /* Footer row */
        .reg-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          border-top: 1px solid #111c28;
          background: rgba(23,184,196,0.015);
        }
        .reg-footer-text { font-size: 9.5px; color: #2e6470; letter-spacing: 0.1em; text-transform: uppercase; }
        .reg-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #17c8c4;
          box-shadow: 0 0 6px rgba(23,184,196,0.8);
          animation: regPulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        .reg-live-wrap { display: flex; align-items: center; gap: 6px; }
        .reg-live-label { font-size: 9px; color: rgba(23,184,196,0.5); letter-spacing: 0.14em; text-transform: uppercase; }

        @keyframes regPulse {
          0%, 100% { box-shadow: 0 0 5px rgba(23,184,196,0.7); }
          50%       { box-shadow: 0 0 12px rgba(23,184,196,1), 0 0 20px rgba(23,184,196,0.3); }
        }
      `}</style>

      <div className="reg-page">
        <div className="reg-inner">

          {/* Header */}
          <div className="reg-header">
            <div className="reg-title-row">
              <div className="reg-accent-bar" />
              <div className="reg-title-group">
                <h1 className="reg-title">Registry Explorer</h1>
                <span className="reg-subtitle">Verifiable on-chain token records</span>
              </div>
            </div>
            <div className="reg-header-right">
              <span className="reg-count-badge">{filtered.length} / {tokens.length} tokens</span>
              {/* Search */}
              <div className="reg-search-wrap">
                <svg className="reg-search-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(61,138,150,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  className="reg-search"
                  type="text"
                  placeholder="Search name or ticker…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table card */}
          <div className="reg-card">
            <div className="reg-card-topline" />
            <div className="reg-table-wrap">
              <table className="reg-table">
                <thead>
                  <tr>
                    {["Token", "Contract Address", "Deployer", "Supply", "Deployed", ""].map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="reg-empty">No tokens match your search</div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((token, idx) => (
                      <tr key={token.ticker} className="reg-tr">
                        <td>
                          <div className="reg-token-wrap">
                            <div className="reg-avatar">{token.symbol}</div>
                            <div>
                              <div className="reg-token-name">{token.name}</div>
                              <div className="reg-token-ticker">{token.ticker}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="reg-addr-cell">
                            <span className="reg-addr">{token.contractAddress}</span>
                            <button className="reg-copy-btn" title="Copy address" onClick={() => handleCopy(token.contractAddress, `c-${idx}`)}>
                              <CopyIcon copied={copiedField === `c-${idx}`} />
                            </button>
                          </div>
                        </td>
                        <td>
                          <div className="reg-addr-cell">
                            <span className="reg-addr">{token.deployer}</span>
                            <button className="reg-copy-btn" title="Copy deployer" onClick={() => handleCopy(token.deployer, `d-${idx}`)}>
                              <CopyIcon copied={copiedField === `d-${idx}`} />
                            </button>
                          </div>
                        </td>
                        <td><span className="reg-supply">{token.supply}</span></td>
                        <td><span className="reg-date">{token.date}</span></td>
                        <td><button className="reg-test-btn">Test →</button></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="reg-footer">
              <span className="reg-footer-text">Lisk Sepolia Testnet</span>
              <div className="reg-live-wrap">
                <div className="reg-live-dot" />
                <span className="reg-live-label">Live</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}