import { useState } from "react";
import CreateTokenModal from "./createTokenModal";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav
        className="w-full flex items-center justify-between px-6 py-3"
        style={{
          background: "#08090f",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #00e5ff, #0066ff)" }}
          >
            <span className="text-[#08090f] font-black text-sm">GB</span>
          </div>
          <span
            className="text-white font-bold text-lg tracking-tight"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            GroupB
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Network badge */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: "#00e5ff",
                boxShadow: "0 0 6px rgba(0,229,255,0.8)",
              }}
            />
            <span className="text-white text-xs font-medium">Sepolia</span>
          </div>

          {/* Create Token modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg text-[#08090f] font-bold text-sm tracking-wide hover:brightness-110 transition-all cursor-pointer"
            style={{
              background: "linear-gradient(90deg, #00e5ff, #00bcd4)",
              boxShadow: "0 2px 10px rgba(0,229,255,0.25)",
              fontFamily: "'Courier New', monospace",
            }}
          >
            Create Token
          </button>
        </div>
      </nav>

      {/* Rendered Modal */}
      <CreateTokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
