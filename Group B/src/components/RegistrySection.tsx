import type React from "react";

const RegistrySection: React.FC = () => {
  return (
    <section className="tf-registry">
      <div className="tf-registry-header">
        <div>
          <h2 className="tf-registry-title">Registry Explorer</h2>
          <p className="tf-registry-subtitle">
            Verifiable records of tokens deployed via the Architect protocol.
          </p>
        </div>

        <div className="tf-registry-search">
          <input
            type="text"
            placeholder="Search Symbol..."
            className="tf-registry-search-input"
          />
        </div>
      </div>

      <div className="tf-registry-table">
        <div className="tf-registry-header-row">
          <span>Token Name</span>
          <span>Symbol</span>
          <span>Contract Address</span>
          <span>Deployer</span>
          <span>Date</span>
          <span className="tf-registry-actions-header">Actions</span>
        </div>

        <div className="tf-registry-row">
          <span className="tf-registry-token">
            <span className="tf-registry-token-icon tf-registry-token-icon--purple" />
            <span>Neon Genesis</span>
          </span>
          <span className="tf-registry-link">NEXUS</span>
          <span className="tf-registry-address">0x7a25...c4b3</span>
          <span className="tf-registry-address">0x1234...5678</span>
          <span>Oct 24, 2024</span>
          <span className="tf-registry-actions">
            <button type="button" className="tf-secondary-button tf-secondary-button--small">
              Test
            </button>
          </span>
        </div>

        <div className="tf-registry-row">
          <span className="tf-registry-token">
            <span className="tf-registry-token-icon tf-registry-token-icon--blue" />
            <span>Ether Architect</span>
          </span>
          <span className="tf-registry-link">ARC</span>
          <span className="tf-registry-address">0x4c21...8f12</span>
          <span className="tf-registry-address">0xdead...beef</span>
          <span>Oct 23, 2024</span>
          <span className="tf-registry-actions">
            <button type="button" className="tf-secondary-button tf-secondary-button--small">
              Test
            </button>
          </span>
        </div>

        <div className="tf-registry-row">
          <span className="tf-registry-token">
            <span className="tf-registry-token-icon tf-registry-token-icon--green" />
            <span>Data Grid</span>
          </span>
          <span className="tf-registry-link">GRID</span>
          <span className="tf-registry-address">0x1a9e...3d54</span>
          <span className="tf-registry-address">0x5555...aaaa</span>
          <span>Oct 22, 2024</span>
          <span className="tf-registry-actions">
            <button type="button" className="tf-secondary-button tf-secondary-button--small">
              Test
            </button>
          </span>
        </div>
      </div>
    </section>
  );
};

export default RegistrySection;

