import { useState } from "react";

const tokens = [
  { symbol: "CR", name: "CryptoX", ticker: "CRX", contractAddress: "0xA1b2C3d4...7890", deployer: "0x9f8e7d6c...5b4a", supply: "10,000,000", date: "2025-03-12" },
  { symbol: "DE", name: "DevCoin", ticker: "DEV", contractAddress: "0xB2c3D4e5...8901", deployer: "0x1a2b3c4d...5e6f", supply: "500,000", date: "2025-03-10" },
  { symbol: "GB", name: "GroupB Test", ticker: "GBT", contractAddress: "0xC3d4E5f6...9012", deployer: "0x4d5e6f7g...8h9i", supply: "1,000,000", date: "2025-03-08" },
  { symbol: "LB", name: "LabToken", ticker: "LBT", contractAddress: "0xD4e5F6a7...0123", deployer: "0x7g8h9i0j...1k2l", supply: "250,000,000", date: "2025-03-05" },
  { symbol: "TN", name: "TestNet20", ticker: "TN20", contractAddress: "0xE5f6A7b8...1234", deployer: "0xjklm12no...qrst", supply: "100,000", date: "2025-03-01" },
];

function CopyIcon({ copied }: { copied: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={copied ? "#17c8c4" : "#2e6470"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: "stroke 0.2s" }}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export default function TokenRegistry() {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <>
      <style>{`
        *{box-sizing:border-box;}
        body{margin:0;}
        .reg-page{min-height:100vh;background:#0e1318;font-family:'Courier New',Courier,monospace;padding:clamp(20px,4vw,48px) clamp(14px,4vw,48px);color:#c5cdd8;}
        .reg-inner{max-width:1100px;margin:0 auto;}
        .reg-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:26px;flex-wrap:wrap;gap:8px;}
        .reg-title-row{display:flex;align-items:center;gap:12px;}
        .reg-accent{width:4px;height:26px;background:#17b8c4;border-radius:2px;flex-shrink:0;}
        .reg-title{font-size:clamp(17px,2.5vw,21px);font-weight:700;color:#dde6f0;margin:0;letter-spacing:.01em;}
        .reg-count{font-size:11px;color:#2e6470;letter-spacing:.06em;}
        .reg-card{background:#121a20;border-radius:10px;border:1px solid #1a2830;overflow:hidden;}
        .reg-table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;}
        .reg-table{width:100%;border-collapse:collapse;min-width:600px;}
        .reg-table thead tr{border-bottom:1px solid #1a2830;}
        .reg-table th{padding:12px 16px;text-align:left;font-size:10px;font-weight:600;color:#2e6470;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;}
        .reg-table td{padding:14px 16px;vertical-align:middle;}
        .reg-tr{border-bottom:1px solid #151f28;transition:background .15s;}
        .reg-tr:last-child{border-bottom:none;}
        .reg-tr:hover{background:#141d24;}
        .reg-avatar{width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#1a8898,#0b4e5e);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#b8e8ee;flex-shrink:0;border:1px solid #175868;box-shadow:inset 0 1px 2px rgba(255,255,255,.08);}
        .reg-token-wrap{display:flex;align-items:center;gap:11px;}
        .reg-token-name{font-size:14px;font-weight:600;color:#dde6f0;line-height:1.3;}
        .reg-token-ticker{font-size:10px;color:#2e6470;margin-top:2px;letter-spacing:.04em;}
        .reg-addr-cell{display:flex;align-items:center;gap:6px;}
        .reg-addr{font-size:12px;color:#3d8a96;white-space:nowrap;}
        .reg-copy-btn{background:none;border:none;cursor:pointer;padding:2px;display:flex;align-items:center;flex-shrink:0;}
        .reg-supply{display:inline-block;background:#091f24;color:#17c8c4;font-size:11px;font-weight:600;padding:4px 10px;border-radius:5px;border:1px solid #0e3a40;white-space:nowrap;}
        .reg-date{font-size:12px;color:#3a6a72;white-space:nowrap;}
        .reg-test-btn{background:transparent;border:1px solid #1e3540;color:#7aaab4;font-size:12px;padding:5px 13px;border-radius:6px;cursor:pointer;font-family:'Courier New',monospace;white-space:nowrap;transition:border-color .15s,color .15s,background .15s;}
        .reg-test-btn:hover{border-color:#17b8c4;color:#17b8c4;background:rgba(23,184,196,.05);}
      `}</style>
      <div className="reg-page">
        <div className="reg-inner">
          <div className="reg-header">
            <div className="reg-title-row">
              <div className="reg-accent" />
              <h1 className="reg-title">Token Registry</h1>
            </div>
            <span className="reg-count">{tokens.length} tokens deployed</span>
          </div>
          <div className="reg-card">
            <div className="reg-table-wrap">
              <table className="reg-table">
                <thead>
                  <tr>
                    {["Token", "Contract Address", "Deployer", "Supply", "Date", ""].map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((token, idx) => (
                    <tr key={token.ticker} className="reg-tr" onMouseEnter={() => setHoveredRow(idx)} onMouseLeave={() => setHoveredRow(null)}>
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
                          <button className="reg-copy-btn" onClick={() => handleCopy(token.contractAddress, `c-${idx}`)}>
                            <CopyIcon copied={copiedField === `c-${idx}`} />
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="reg-addr-cell">
                          <span className="reg-addr">{token.deployer}</span>
                          <button className="reg-copy-btn" onClick={() => handleCopy(token.deployer, `d-${idx}`)}>
                            <CopyIcon copied={copiedField === `d-${idx}`} />
                          </button>
                        </div>
                      </td>
                      <td><span className="reg-supply">{token.supply}</span></td>
                      <td><span className="reg-date">{token.date}</span></td>
                      <td><button className="reg-test-btn">Test →</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}