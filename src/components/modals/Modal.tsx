import { useEffect, useCallback, type ReactNode } from "react";
import { useApp } from "../../context/AppContext";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose?: () => void;
  size?: "sm" | "md" | "lg";
}

export function Modal({ title, children, onClose, size = "md" }: ModalProps) {
  const { closeModal } = useApp();

  // Stable close handler
  const handleClose = useCallback(() => {
    onClose?.();
    closeModal();
  }, [onClose, closeModal]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [handleClose]);

  const sizes = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl" };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-md animate-fadeIn"
        onClick={handleClose}
      />
      <div
        className={`relative w-full ${sizes[size]} bg-surface-container-high rounded-xl shadow-2xl overflow-hidden border border-outline-variant/20`}
        style={{ animation: "scaleIn 0.25s ease-out forwards", opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 md:px-8 py-5 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-highest/20">
          <h3 className="font-headline font-extrabold text-xl tracking-tight">
            {title}
          </h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-surface-container-highest rounded-full transition-colors text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 md:p-8 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
