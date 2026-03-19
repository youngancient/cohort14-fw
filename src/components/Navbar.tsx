import { useState } from "react";
import CreateTokenModal from "./CreateTokenModal";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav
        className="w-full flex items-center justify-between px-4 md:px-6 py-3 relative z-50"
        style={{
          background: "var(--bg-darkest)",
          borderBottom: "1px solid var(--border-card)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--accent-cyan), #0066ff)" }}
          >
            <span className="text-[var(--bg-darkest)] font-black text-sm">GB</span>
          </div>
          <span
            className="text-white font-bold text-lg tracking-tight hidden sm:inline"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            GroupB
          </span>
        </div>

        {/* Navbar Links - Desktop */}
        <nav className="tf-navbar-links hidden md:flex" aria-label="Main navigation">
          <button type="button" className="tf-nav-link tf-nav-link--active">
            Factory
          </button>
          <button type="button" className="tf-nav-link">
            Dashboard
          </button>
          <button type="button" className="tf-nav-link">
            Docs
          </button>
          <button type="button" className="tf-nav-link">
            Audit
          </button>
        </nav>

        {/* Right side - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {/* Network badge */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--border-card)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: "var(--accent-cyan)",
                boxShadow: "0 0 6px var(--accent-cyan)",
              }}
            />
            <span className="text-white text-xs font-medium">Sepolia</span>
          </div>

          {/* Create Token modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg text-[var(--bg-darkest)] font-bold text-sm tracking-wide hover:brightness-110 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
            style={{
              background: "linear-gradient(90deg, var(--accent-cyan), #00bcd4)",
              boxShadow: "0 2px 10px rgba(0,229,255,0.25)",
              fontFamily: "'Courier New', monospace",
              outlineColor: "var(--accent-blue)",
            }}
          >
            Create Token
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex flex-col gap-1 p-2 rounded-lg hover:bg-opacity-50 transition-all focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            background: "rgba(255,255,255,0.05)",
            outlineColor: "var(--accent-blue)",
          }}
          aria-label="Toggle mobile menu"
        >
          <span className="w-5 h-0.5 bg-white block transition-all" style={{
            transform: isMobileMenuOpen ? 'rotate(45deg) translateY(8px)' : 'rotate(0)'
          }} />
          <span className="w-5 h-0.5 bg-white block transition-all" style={{
            opacity: isMobileMenuOpen ? 0 : 1
          }} />
          <span className="w-5 h-0.5 bg-white block transition-all" style={{
            transform: isMobileMenuOpen ? 'rotate(-45deg) translateY(-8px)' : 'rotate(0)'
          }} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden w-full flex flex-col gap-4 p-4 border-b"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border-card)",
          }}
        >
          <nav className="flex flex-col gap-2">
            <button type="button" className="tf-nav-link tf-nav-link--active text-left px-4 py-2">
              Factory
            </button>
            <button type="button" className="tf-nav-link text-left px-4 py-2">
              Dashboard
            </button>
            <button type="button" className="tf-nav-link text-left px-4 py-2">
              Docs
            </button>
            <button type="button" className="tf-nav-link text-left px-4 py-2">
              Audit
            </button>
          </nav>

          {/* Mobile Right side */}
          <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor: "var(--border-card)" }}>
            {/* Network badge */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border-card)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: "var(--accent-cyan)",
                  boxShadow: "0 0 6px var(--accent-cyan)",
                }}
              />
              <span className="text-white text-xs font-medium">Sepolia</span>
            </div>

            {/* Create Token button */}
            <button
              onClick={() => {
                setIsModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 rounded-lg text-[var(--bg-darkest)] font-bold text-sm tracking-wide hover:brightness-110 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
              style={{
                background: "linear-gradient(90deg, var(--accent-cyan), #00bcd4)",
                boxShadow: "0 2px 10px rgba(0,229,255,0.25)",
                fontFamily: "'Courier New', monospace",
                outlineColor: "var(--accent-blue)",
              }}
            >
              Create Token
            </button>
          </div>
        </div>
      )}

      {/* Rendered Modal */}
      <CreateTokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}