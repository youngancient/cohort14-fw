import type React from "react";

const Hero: React.FC = () => {
  return (
    <section className="tf-hero">
      <div className="tf-hero-content">
        <div className="tf-hero-copy">
          <div className="tf-badge">v2.0 live on Ethereum</div>
          <h1 className="tf-hero-title">
            The ERC20
            <br />
            <span className="tf-hero-title-accent">Architect</span>
          </h1>
          <p className="tf-hero-subtitle">
            Deploy and test custom tokens without writing a single line of
            code. Professional-grade smart contracts, audited and optimized
            for the decentralized web.
          </p>

          <div className="tf-hero-actions">
            <button type="button" className="tf-primary-button tf-primary-button--large">
              Create Token
            </button>
            <button type="button" className="tf-secondary-button tf-secondary-button--large">
              View Docs
            </button>
          </div>
        </div>

        <div className="tf-hero-visual">
          <div className="tf-hero-card">
            <div className="tf-hero-card-header">
              <span className="tf-hero-window-dot" />
              <span className="tf-hero-window-dot" />
              <span className="tf-hero-window-dot" />
            </div>
            <div className="tf-hero-card-body">
              <div className="tf-hero-line tf-hero-line--wide" />
              <div className="tf-hero-row">
                <div className="tf-hero-line" />
                <div className="tf-hero-pill" />
              </div>
              <div className="tf-hero-row">
                <div className="tf-hero-line tf-hero-line--short" />
                <div className="tf-hero-line tf-hero-line--short" />
              </div>
              <div className="tf-hero-progress">
                <div className="tf-hero-progress-bar" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

