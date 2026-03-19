import type React from "react";
import "../token-interactions-page.css";
import ListTile from "../components/ListTile";
import type { ITokenDetail } from "../interface/ITokenDetail";

const TokenInteractionPage = (
  {tokenDetail} : {tokenDetail: ITokenDetail}
) => {
  return (
    <div className="tf-root">
      <main className="tf-main">
        {/* Token Header Card */}
        <section className="token-header-card">
          <div className="token-info-left">
            <button className="back-button">← Back</button>
            <div className="token-logo">{tokenDetail.symbol.slice(0, 2)}</div>
            <div className="token-name-section">
              <h2>
                {tokenDetail.name} <span className="token-symbol">({tokenDetail.symbol})</span>
              </h2>
              <div className="token-address">
                0xA1b2C3d4...7890
                <span style={{ cursor: 'pointer', opacity: 0.6 }}>📋</span>
              </div>
            </div>
          </div>
          <div className="token-stats-right">
            <div className="stat-item">
              <span className="stat-value">{tokenDetail.totalSupply}</span>
              <span className="stat-label">Total Supply</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{tokenDetail.decimals}</span>
              <span className="stat-label">Decimals</span>
            </div>
          </div>
        </section>

        {/* Load Token Section */}
        <section className="load-token-section">
          <span className="load-token-label">Test a different token address</span>
          <div className="load-token-input-container">
            <input
              type="text"
              placeholder="Paste contract address - 0x..."
              className="load-token-input"
            />
            <button className="load-button">Load →</button>
          </div>
        </section>

        {/* Functions Section */}
        <section className="functions-container">
          {/* Read Functions */}
          <div className="function-column">
            <div className="function-column-header">
              <div className="column-title">
                <span className="dot dot-blue"></span>
                Read Functions
              </div>
              <span className="column-subtitle">No gas required</span>
            </div>
            <div className="function-list">
              <ListTile title="name()" tag="VIEW" isExpanded={true} />
              <ListTile title="symbol()" tag="VIEW" />
              <ListTile title="decimals()" tag="VIEW" />
              <ListTile title="totalSupply()" tag="VIEW" />
              <ListTile title="balanceOf" tag="VIEW" />
              <ListTile title="allowance" tag="VIEW" />
            </div>
          </div>

          {/* Write Functions */}
          <div className="function-column">
            <div className="function-column-header">
              <div className="column-title">
                <span className="dot dot-purple"></span>
                Write Functions
              </div>
              <span className="column-subtitle">Requires wallet</span>
            </div>
            <div className="function-list">
              <ListTile title="mint" tag="WRITE" />
              <ListTile title="transfer" tag="WRITE" />
              <ListTile title="transferFrom" tag="WRITE" />
              <ListTile title="approve" tag="WRITE" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TokenInteractionPage;
