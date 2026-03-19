import { useState } from "react";
import CreateTokenModal from "./CreateTokenModal";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="w-full flex justify-center px-4 pt-4 fixed top-0 left-0 z-50">
        <nav
          className="flex items-center justify-end px-6 relative w-full"
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
          <button
            onClick={() => setIsModalOpen(true)}
            className="relative flex items-center gap-2 px-5 py-2 text-[11px] tracking-[0.18em] uppercase font-bold transition-all duration-200 overflow-hidden group"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.85)",
              fontFamily: "'Courier New', monospace",
              borderRadius: "999px",
              boxShadow: "0 0 0 rgba(255,255,255,0)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.11)"
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"
              e.currentTarget.style.color = "#ffffff"
              e.currentTarget.style.boxShadow = "0 0 20px rgba(255,255,255,0.06)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)"
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"
              e.currentTarget.style.color = "rgba(255,255,255,0.85)"
              e.currentTarget.style.boxShadow = "0 0 0 rgba(255,255,255,0)"
            }}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.04) 50%, transparent 70%)",
              }}
            />
            {/* <span
              className="w-[5px] h-[5px] rounded-full flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.7)",
                boxShadow: "0 0 6px rgba(255,255,255,0.5)",
                animation: "navPulse 2.4s ease-in-out infinite",
              }}
            /> */}
            Connect Wallet
          </button>
        </nav>
      </div>

      <CreateTokenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <style>{`
        @keyframes navPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 5px rgba(255,255,255,0.4); }
          50%       { opacity: 0.5; box-shadow: 0 0 10px rgba(255,255,255,0.15); }
        }
      `}</style>
    </>
  );
}