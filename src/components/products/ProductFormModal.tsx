"use client";

import { useEffect, useState, useTransition } from "react";
import { CloseIcon } from "@/components/icons";
import {
  createProductAction,
  updateProductAction,
} from "@/lib/actions/products";
import { formatPrice, formatPriceInput as formatPriceInputValue } from "@/lib/utils/format";
import type { Product, ProductFormData } from "@/lib/types";

type ModalMode = "create" | "edit" | "view";

type ProductFormModalProps = {
  mode: ModalMode;
  product?: Product | null;
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
};

const EMPTY_FORM: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
};

export function ProductFormModal({
  mode,
  product,
  open,
  onClose,
  onSuccess,
}: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [priceInput, setPriceInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isViewMode = mode === "view";
  const title =
    mode === "create"
      ? "Novo Produto"
      : mode === "edit"
        ? "Editar Produto"
        : "Detalhes do Produto";

  useEffect(() => {
    if (!open) return;

    if (product) {
      // O formulário precisa refletir o produto selecionado ao abrir o modal.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: product.name,
        description: product.description ?? "",
        price: product.price,
        stock: product.stock,
      });
      setPriceInput(formatPriceInputValue(product.price));
    } else {
      setForm(EMPTY_FORM);
      setPriceInput("");
    }

    setError(null);
  }, [open, product]);

  if (!open) return null;

  function handleChange(
    field: keyof ProductFormData,
    value: string | number,
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handlePriceChange(value: string) {
    const rawValue = value.replace(/[^\d,]/g, "");
    const numericValue = Number(rawValue.replace(",", "."));

    if (rawValue === "" || Number.isNaN(numericValue)) {
      setPriceInput("");
      handleChange("price", 0);
      return;
    }

    setPriceInput(formatPriceInputValue(numericValue));
    handleChange("price", numericValue);
  }

  function handlePriceKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const hasSelection =
      event.currentTarget.selectionStart !== event.currentTarget.selectionEnd;

    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      const currentDigits =
        !hasSelection && form.price ? String(Math.round(form.price)) : "";
      const numericValue = Number(`${currentDigits}${event.key}`);

      setPriceInput(formatPriceInputValue(numericValue));
      handleChange("price", numericValue);
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      const currentDigits =
        !hasSelection && form.price ? String(Math.round(form.price)) : "";
      const numericValue = Number(currentDigits.slice(0, -1)) || 0;

      setPriceInput(numericValue ? formatPriceInputValue(numericValue) : "");
      handleChange("price", numericValue);
    }
  }

  function formatPriceOnBlur() {
    setPriceInput(form.price ? formatPriceInputValue(form.price) : "");
  }

  function showRawPriceInput() {
    setPriceInput(form.price ? String(form.price) : "");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("O nome do produto é obrigatório.");
      return;
    }

    if (form.price < 0 || form.stock < 0) {
      setError("Preço e estoque devem ser valores válidos.");
      return;
    }

    startTransition(async () => {
      const payload: ProductFormData = {
        name: form.name.trim(),
        description: form.description?.trim() || undefined,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      const result =
        mode === "create"
          ? await createProductAction(payload)
          : product
            ? await updateProductAction(product._id, payload)
            : { success: false as const, error: "Produto não encontrado." };

      if (result.success) {
        onClose();
        onSuccess(
          mode === "create"
            ? "Produto adicionado com sucesso."
            : "Produto atualizado com sucesso.",
        );
        return;
      }

      setError(result.error);
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

      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#1E293B]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#64748B] transition-colors hover:bg-[#F1F5F9]"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {isViewMode && product ? (
          <div className="space-y-4 px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
                Nome
              </p>
              <p className="mt-1 text-sm text-[#1E293B]">{product.name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
                Descrição
              </p>
              <p className="mt-1 text-sm text-[#64748B]">
                {product.description || "—"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
                  Preço
                </p>
                <p className="mt-1 text-sm text-[#1E293B]">
                  {formatPrice(product.price)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
                  Estoque
                </p>
                <p className="mt-1 text-sm text-[#1E293B]">{product.stock}</p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#E2E8F0] px-4 py-2 text-sm font-medium text-[#475569] hover:bg-[#F8FAFC]"
              >
                Fechar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-[#475569]"
              >
                Nome *
              </label>
              <input
                id="name"
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
                className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20"
                placeholder="Nome do produto"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1.5 block text-sm font-medium text-[#475569]"
              >
                Descrição
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={(event) =>
                  handleChange("description", event.target.value)
                }
                rows={3}
                className="w-full resize-none rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20"
                placeholder="Descrição do produto"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className="mb-1.5 block text-sm font-medium text-[#475569]"
                >
                  Preço (Kz) *
                </label>
                <input
                  id="price"
                  type="text"
                  inputMode="decimal"
                  value={priceInput}
                  onFocus={showRawPriceInput}
                  onBlur={formatPriceOnBlur}
                  onKeyDown={handlePriceKeyDown}
                  onChange={(event) => handlePriceChange(event.target.value)}
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20"
                  placeholder="Kz 0,00"
                />
              </div>
              <div>
                <label
                  htmlFor="stock"
                  className="mb-1.5 block text-sm font-medium text-[#475569]"
                >
                  Estoque *
                </label>
                <input
                  id="stock"
                  type="number"
                  min="0"
                  value={form.stock || ""}
                  onChange={(event) =>
                    handleChange("stock", Number(event.target.value))
                  }
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20"
                  placeholder="0"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-[#FEE2E2] px-3 py-2 text-sm text-[#DC2626]">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#E2E8F0] px-4 py-2 text-sm font-medium text-[#475569] hover:bg-[#F8FAFC]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-[#6C5CE7] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5B4BD4] disabled:opacity-60"
              >
                {isPending
                  ? "Salvando..."
                  : mode === "create"
                    ? "Criar Produto"
                    : "Salvar Alterações"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
