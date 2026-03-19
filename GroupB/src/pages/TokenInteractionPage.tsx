import { useState } from "react";
import "../styles/token-interactions-page.css";
import ListTile from "../components/ListTile";
import type { ITokenDetail } from "../interface/ITokenDetail";
import useCall from "../hooks/useCall";

const TokenInteractionPage = ({
  tokenDetail,
  onBack,
}: {
  tokenDetail: ITokenDetail;
  onBack?: () => void;
}) => {
  const { loadToken, balanceOf, allowance, mint, transfer, transferFrom, approve } =
    useCall();

  const [expandedTile, setExpandedTile] = useState<string | null>("balanceOf");
  const [loadtTokenAddress, setLoadTokenAddress] = useState("");

  const toggleTile = (title: string) => {
    setExpandedTile((prev) => (prev === title ? null : title));
  };

  const handleCall = (method: string, inputs: string[]) => {
    inputs = inputs.map(input => input.replaceAll(" ", ""));

    switch (method) {
      case "balanceOf":
        if (inputs.length !== 1) {
          console.error("A Weird error has occured");
          return;
        }
        balanceOf(inputs[0]);
        break;
      case "allowance":
        if (inputs.length !== 2) {
          console.error("A Weird error has occured");
          return;
        }
        allowance(inputs[0], inputs[1]);
        break;
      case "mint":
        if (inputs.length !== 2) {
          console.error("A Weird error has occured");
          return;
        }
        mint(inputs[0], inputs[1]);
        break;
      case "transfer":
        if (inputs.length !== 2) {
          console.error("A Weird error has occured");
          return;
        }
        transfer(inputs[0], inputs[1]);
        break;
      case "transferFrom":
        if (inputs.length !== 3) {
          console.error("A Weird error has occured");
          return;
        }
        transferFrom(inputs[0], inputs[1], inputs[2]);
        break;
      case "approve":
        if (inputs.length !== 2) {
          console.error("A Weird error has occured");
          return;
        }
        approve(inputs[0], inputs[1]);
        break;

      default:
        break;
    }
  };

  return (
    <div className="tf-root">
      <main className="tf-main">
        {/* Token Header Card */}
        <section className="token-header-card">
          <div className="token-info-left">
            <button className="back-button" onClick={onBack}>← Back</button>
            <div className="token-logo">{tokenDetail.symbol.slice(0, 2)}</div>
            <div className="token-name-section">
              <h2>
                {tokenDetail.name}{" "}
                <span className="token-symbol">({tokenDetail.symbol})</span>
              </h2>
              <div className="token-address">
                0xA1b2C3d4...7890
                <span style={{ cursor: "pointer", opacity: 0.6 }}>📋</span>
              </div>
            </div>
          </div>
        </section>

        {/* Load Token Section */}
        <section className="load-token-section">
          <span className="load-token-label">
            Test a different token address
          </span>
          <div className="load-token-input-container">
            <input
              type="text"
              placeholder="Paste contract address - 0x..."
              className="load-token-input"
              onChange={(e) => setLoadTokenAddress(e.target.value)}
            />
            <button className="load-button" onClick={() => loadToken(loadtTokenAddress)}>Load →</button>
          </div>
        </section>

        {/* Quick Stats Row */}
        <section className="token-quick-stats">
          <div className="quick-stat-card">
            <span className="quick-stat-label">Name</span>
            <span className="quick-stat-value">{tokenDetail.name}</span>
          </div>
          <div className="quick-stat-card">
            <span className="quick-stat-label">Symbol</span>
            <span className="quick-stat-value">{tokenDetail.symbol}</span>
          </div>
          <div className="quick-stat-card">
            <span className="quick-stat-label">Decimals</span>
            <span className="quick-stat-value">{tokenDetail.decimals}</span>
          </div>
          <div className="quick-stat-card">
            <span className="quick-stat-label">Total Supply</span>
            <span className="quick-stat-value">{tokenDetail.totalSupply}</span>
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
              <ListTile
                title="balanceOf"
                tag="VIEW"
                isExpanded={expandedTile === "balanceOf"}
                onToggle={() => toggleTile("balanceOf")}
                placeholders={["account"]}
                onCall={(inputs) => handleCall("balanceOf", inputs)}
              />
              <ListTile
                title="allowance"
                tag="VIEW"
                isExpanded={expandedTile === "allowance"}
                onToggle={() => toggleTile("allowance")}
                placeholders={["owner", "spender"]}
                onCall={(inputs) => handleCall("allowance", inputs)}
              />
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
              <ListTile
                title="mint"
                tag="WRITE"
                isExpanded={expandedTile === "mint"}
                onToggle={() => toggleTile("mint")}
                placeholders={["address", "amount"]}
                onCall={(inputs) => handleCall("mint", inputs)}
              />
              <ListTile
                title="transfer"
                tag="WRITE"
                isExpanded={expandedTile === "transfer"}
                onToggle={() => toggleTile("transfer")}
                placeholders={["to", "amount"]}
                onCall={(inputs) => handleCall("transfer", inputs)}
              />
              <ListTile
                title="transferFrom"
                tag="WRITE"
                isExpanded={expandedTile === "transferFrom"}
                onToggle={() => toggleTile("transferFrom")}
                placeholders={["from", "to", "amount"]}
                onCall={(inputs) => handleCall("transferFrom", inputs)}
              />
              <ListTile
                title="approve"
                tag="WRITE"
                isExpanded={expandedTile === "approve"}
                onToggle={() => toggleTile("approve")}
                placeholders={["spender", "amount"]}
                onCall={(inputs) => handleCall("approve", inputs)}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TokenInteractionPage;
