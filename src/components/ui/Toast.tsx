"use client";

import { useEffect } from "react";

type ToastProps = {
  message: string;
  type: "success" | "error";
  onClose: () => void;
};

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timeout = setTimeout(onClose, 3500);
    return () => clearTimeout(timeout);
  }, [message, onClose]);

  return (
    <div
      role="status"
      className={`fixed bottom-5 right-5 z-[60] flex max-w-sm items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg ${
        type === "success"
          ? "border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]"
          : "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]"
      }`}
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${
          type === "success" ? "bg-[#22C55E]" : "bg-[#EF4444]"
        }`}
      />
      {message}
      <button
        type="button"
        onClick={onClose}
        className="ml-2 text-current opacity-60 hover:opacity-100"
        aria-label="Fechar mensagem"
      >
        ×
      </button>
    </div>
  );
}
