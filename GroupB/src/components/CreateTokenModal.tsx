import React, { useState } from "react";

interface CreateTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TokenData {
  tokenName: string;
  decimals: number;
  symbol: string;
  initialSupply: number;
}

export default function CreateTokenModal({ isOpen, onClose }: CreateTokenModalProps) {
  const [form, setForm] = useState({
    tokenName: "",
    symbol: "",
    decimals: "18",
    initialSupply: "1000000",
  });

  const [errors, setErrors] = useState<Partial<TokenData>>({});
  const [deploying, setDeploying] = useState(false);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};
    if (!form.tokenName.trim()) newErrors.tokenName = "Required";
    if (!form.symbol.trim()) newErrors.symbol = "Required";
    if (Number(form.decimals) < 0 || Number(form.decimals) > 18)
      newErrors.decimals = "0–18 only";
    if (Number(form.initialSupply) <= 0)
      newErrors.initialSupply = "Must be > 0";
    setErrors(newErrors as Partial<TokenData>);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // clear error on change
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleDeploy = () => {
    if (!validateForm()) return;
    setDeploying(true);
    setTimeout(() => {
      setDeploying(false);
      onClose();
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(4,3,2,0.88)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "linear-gradient(160deg, #0e0c0a 0%, #0a0807 100%)",
          border: "1px solid rgba(212,175,55,0.14)",
          borderRadius: "4px",
          boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.06), 0 0 60px rgba(212,175,55,0.04)",
          overflow: "hidden",
          position: "relative",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top rim glow */}
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
        }} />

        {/* Corner accents */}
        <div style={{ position: "absolute", top: 0, left: 0, width: 20, height: 20,
          borderTop: "1px solid rgba(212,175,55,0.4)", borderLeft: "1px solid rgba(212,175,55,0.4)" }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 20, height: 20,
          borderTop: "1px solid rgba(212,175,55,0.4)", borderRight: "1px solid rgba(212,175,55,0.4)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: 20, height: 20,
          borderBottom: "1px solid rgba(212,175,55,0.4)", borderLeft: "1px solid rgba(212,175,55,0.4)" }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: 20, height: 20,
          borderBottom: "1px solid rgba(212,175,55,0.4)", borderRight: "1px solid rgba(212,175,55,0.4)" }} />

        <div style={{ padding: "32px 32px 28px" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
            <div>
              <div style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 9,
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "rgba(212,175,55,0.5)",
                marginBottom: 8,
              }}>
                ◈ &nbsp;ERC-20 Factory
              </div>
              <h2 style={{
                fontFamily: "'Bebas Neue', 'Courier New', monospace",
                fontSize: 38,
                fontWeight: 400,
                letterSpacing: "0.06em",
                color: "#f5f0e8",
                margin: 0,
                lineHeight: 1,
                textShadow: "0 0 40px rgba(212,175,55,0.15)",
              }}>
                Deploy Token
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 30, height: 30,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "2px",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(255,255,255,0.35)",
                fontSize: 14,
                transition: "all 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)"
                e.currentTarget.style.color = "rgba(212,175,55,0.8)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
                e.currentTarget.style.color = "rgba(255,255,255,0.35)"
              }}
            >
              ✕
            </button>
          </div>

          {/* Divider */}
          <div style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.18), transparent)",
            marginBottom: 24,
          }} />

          {/* Form fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
            {[
              { name: "tokenName",    label: "Token Name",    type: "text",   placeholder: "Neon Sapphire", span: false },
              { name: "symbol",       label: "Symbol",        type: "text",   placeholder: "NSPH",          span: false },
              { name: "decimals",     label: "Decimals",      type: "number", placeholder: "18",            span: false },
              { name: "initialSupply",label: "Initial Supply",type: "number", placeholder: "1000000",       span: false },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: 9,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "rgba(212,175,55,0.45)",
                }}>
                  {label}
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={type}
                    name={name}
                    value={form[name as keyof typeof form]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${errors[name as keyof TokenData] ? "rgba(220,80,60,0.5)" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: "2px",
                      padding: "10px 12px",
                      fontFamily: "'Courier New', monospace",
                      fontSize: 12,
                      color: "#f0ece4",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)"
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.06)"
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = errors[name as keyof TokenData] ? "rgba(220,80,60,0.5)" : "rgba(255,255,255,0.08)"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  />
                </div>
                {errors[name as keyof TokenData] && (
                  <span style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: 9,
                    color: "rgba(220,80,60,0.9)",
                    letterSpacing: "0.1em",
                  }}>
                    ⚠ {errors[name as keyof TokenData]}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
            marginBottom: 20,
          }} />

          {/* Deploy button */}
          <button
            onClick={handleDeploy}
            disabled={deploying}
            style={{
              width: "100%",
              padding: "14px",
              background: deploying
                ? "rgba(212,175,55,0.08)"
                : "rgba(212,175,55,0.10)",
              border: "1px solid rgba(212,175,55,0.35)",
              borderRadius: "2px",
              fontFamily: "'Courier New', monospace",
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: deploying ? "rgba(212,175,55,0.5)" : "rgba(212,175,55,0.9)",
              cursor: deploying ? "not-allowed" : "pointer",
              transition: "all 0.25s",
              textShadow: deploying ? "none" : "0 0 12px rgba(212,175,55,0.3)",
              boxShadow: deploying ? "none" : "0 0 20px rgba(212,175,55,0.06)",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={e => {
              if (!deploying) {
                e.currentTarget.style.background = "rgba(212,175,55,0.16)"
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.6)"
                e.currentTarget.style.boxShadow = "0 0 32px rgba(212,175,55,0.14)"
                e.currentTarget.style.color = "#d4af37"
              }
            }}
            onMouseLeave={e => {
              if (!deploying) {
                e.currentTarget.style.background = "rgba(212,175,55,0.10)"
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.35)"
                e.currentTarget.style.boxShadow = "0 0 20px rgba(212,175,55,0.06)"
                e.currentTarget.style.color = "rgba(212,175,55,0.9)"
              }
            }}
          >
            {deploying ? "Broadcasting  ···" : "◈  Deploy to Network"}
          </button>

          <p style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 9,
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.18)",
            textAlign: "center",
            marginTop: 14,
            margin: "14px 0 0",
          }}>
            Transaction will require wallet confirmation
          </p>
        </div>
      </div>

      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        input::placeholder { color: rgba(255,255,255,0.18) !important; }
      `}</style>
    </div>
  );
}