import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { VaultSidebar } from "./VaultSidebar";

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="mobile-nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur"
          />
          <motion.aside
            key="mobile-nav-panel"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 40 }}
            className="fixed inset-y-0 left-0 z-50 flex w-full max-w-[320px] flex-col border-r border-border bg-surface/95 shadow-2xl backdrop-saturate-150 backdrop-blur"
            role="dialog"
            aria-label="Vault navigation"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-semibold">Vault menu</span>
              <button
                type="button"
                aria-label="Close navigation"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <VaultSidebar className="h-full" />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
