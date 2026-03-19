import { useState } from "react";
import CreateTokenModal from "./CreateTokenModal";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="w-full flex justify-center px-4 pt-4 fixed top-0 left-0 z-50">
        <nav
          className="flex items-center justify-between px-6 relative w-full"
          style={{
            maxWidth: "860px",
            background: "rgba(8,6,4,0.75)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "999px",
            height: "52px",
            boxShadow: "0 4px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset",
          }}
        >
          {/* Center — Nav links */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
            {["Factory", "Dashboard", "Docs", "Audit"].map((item, i) => (
              <button
                key={item}
                type="button"
                className="relative text-[11px] tracking-[0.14em] uppercase font-medium transition-all duration-200 group"
                style={{
                  color: i === 0 ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.38)",
                  fontFamily: "'Courier New', monospace",
                  background: "transparent",
                  border: "none",
                  padding: "4px 0",
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.92)"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = i === 0 ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.38)"
                }}
              >
                {item}
                {/* underline — solid for active, hover for rest */}
                <span
                  className="absolute left-0 bottom-0 h-[1px] transition-all duration-200"
                  style={{
                    width: i === 0 ? "100%" : "0%",
                    background: "rgba(255,255,255,0.55)",
                  }}
                  onMouseEnter={e => { if (i !== 0) (e.currentTarget as HTMLElement).style.width = "100%" }}
                />
              </button>
            ))}
          </nav>

          {/* Right — Connect Wallet (no padding/border, just text + underline hover) */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative text-[11px] tracking-[0.18em] uppercase font-medium transition-all duration-200"
              style={{
                color: "rgba(255,255,255,0.55)",
                fontFamily: "'Courier New', monospace",
                background: "transparent",
                border: "none",
                padding: "4px 0",
                cursor: "pointer",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "rgba(255,255,255,0.92)"
                const line = e.currentTarget.querySelector('.cw-line') as HTMLElement
                if (line) line.style.width = "100%"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "rgba(255,255,255,0.55)"
                const line = e.currentTarget.querySelector('.cw-line') as HTMLElement
                if (line) line.style.width = "0%"
              }}
            >
              Connect Wallet
              <span
                className="cw-line absolute left-0 bottom-0 h-[1px] transition-all duration-300"
                style={{ width: "0%", background: "rgba(255,255,255,0.5)" }}
              />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col justify-center gap-[5px] p-2"
            style={{ background: "transparent", border: "none", cursor: "pointer" }}
            aria-label="Toggle mobile menu"
          >
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="block transition-all duration-300"
                style={{
                  width: i === 1 ? "14px" : "20px",
                  height: "1.5px",
                  background: "rgba(255,255,255,0.6)",
                  transform: isMobileMenuOpen
                    ? i === 0 ? "rotate(45deg) translateY(6.5px)"
                    : i === 1 ? "scaleX(0)"
                    : "rotate(-45deg) translateY(-6.5px)"
                    : "none",
                  opacity: isMobileMenuOpen && i === 1 ? 0 : 1,
                  marginLeft: i === 1 ? "auto" : "0",
                }}
              />
            ))}
          </button>
        </nav>
      </div>

      {/* Mobile dropdown */}
      <div
        className="md:hidden fixed z-40 left-1/2 overflow-hidden transition-all duration-300"
        style={{
          top: "64px",
          transform: "translateX(-50%)",
          width: "calc(100% - 32px)",
          maxWidth: "860px",
          maxHeight: isMobileMenuOpen ? "300px" : "0",
          background: "rgba(8,6,4,0.96)",
          backdropFilter: "blur(20px)",
          border: isMobileMenuOpen ? "1px solid rgba(255,255,255,0.07)" : "none",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex flex-col gap-1 p-4">
          {["Factory", "Dashboard", "Docs", "Audit"].map((item, i) => (
            <button
              key={item}
              type="button"
              className="text-left px-4 py-3 text-[12px] tracking-[0.1em] uppercase font-medium"
              style={{
                color: i === 0 ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.38)",
                fontFamily: "'Courier New', monospace",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              {item}
            </button>
          ))}
          <div className="pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            <button
              onClick={() => { setIsModalOpen(true); setIsMobileMenuOpen(false); }}
              className="w-full py-3 mt-2 text-[11px] tracking-[0.18em] uppercase font-medium text-left px-4"
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.55)",
                fontFamily: "'Courier New', monospace",
                cursor: "pointer",
              }}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>

      <CreateTokenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}