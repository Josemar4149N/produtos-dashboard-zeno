"use client";

import { useTransition } from "react";
import { CloseIcon } from "@/components/icons";
import { deleteProductAction } from "@/lib/actions/products";
import type { Product } from "@/lib/types";

type DeleteConfirmModalProps = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

export function DeleteConfirmModal({
  product,
  open,
  onClose,
  onSuccess,
  onError,
}: DeleteConfirmModalProps) {
  const [isPending, startTransition] = useTransition();

  if (!open || !product) return null;

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProductAction(product!._id);

      if (result.success) {
        onClose();
        onSuccess("Produto eliminado com sucesso.");
        return;
      }

      onError(result.error);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar modal"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#1E293B]">
            Excluir Produto
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#64748B] transition-colors hover:bg-[#F1F5F9]"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <p className="text-sm text-[#64748B]">
            Tem certeza que deseja excluir{" "}
            <span className="font-semibold text-[#1E293B]">
              {product.name}
            </span>
            ? Esta ação não pode ser desfeita.
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E2E8F0] px-4 py-2 text-sm font-medium text-[#475569] hover:bg-[#F8FAFC]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-lg bg-[#DC2626] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#B91C1C] disabled:opacity-60"
            >
              {isPending ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
