"use client";

import { useMemo, useState } from "react";
import { EyeIcon, PencilIcon, SortIcon, TrashIcon } from "@/components/icons";
import { formatPrice, truncateText } from "@/lib/utils/format";
import type { Product, SortField, SortOrder } from "@/lib/types";

type ProductTableProps = {
  products: Product[];
  sortBy: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onBulkDelete: (ids: string[]) => void;
};

const COLUMNS: { key: SortField | "actions"; label: string; sortable: boolean }[] =
  [
    { key: "name", label: "Produto", sortable: true },
    { key: "description", label: "Descrição", sortable: true },
    { key: "price", label: "Preço (Kz)", sortable: true },
    { key: "stock", label: "Estoque", sortable: true },
    { key: "actions", label: "Ações", sortable: false },
  ];

function StockIndicator({ stock }: { stock: number }) {
  const color =
    stock === 0 ? "bg-[#EF4444]" : stock <= 10 ? "bg-[#F59E0B]" : "bg-[#22C55E]";

  return (
    <span className="inline-flex items-center gap-2 text-sm text-[#1E293B]">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {stock}
    </span>
  );
}

export function ProductTable({
  products,
  sortBy,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
}: ProductTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allSelected = useMemo(
    () => products.length > 0 && selectedIds.length === products.length,
    [products.length, selectedIds.length],
  );

  function toggleAll() {
    if (allSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(products.map((product) => product._id));
  }

  function toggleOne(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <div>
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
          <span className="text-sm text-[#64748B]">
            {selectedIds.length} selecionado(s)
          </span>
          <button
            type="button"
            onClick={() => {
              onBulkDelete(selectedIds);
              setSelectedIds([]);
            }}
            className="rounded-lg bg-[#FEE2E2] px-3 py-1.5 text-sm font-medium text-[#DC2626] transition-colors hover:bg-[#FECACA]"
          >
            Excluir selecionados
          </button>
        </div>
      )}

      <div className="overflow-x-auto bg-white">
        <table className="w-full min-w-[760px] table-fixed divide-y divide-[#E2E8F0]">
          <colgroup>
            <col className="w-[4%]" />
            <col className="w-[23%]" />
            <col className="w-[24%]" />
            <col className="w-[15%]" />
            <col className="w-[16%]" />
            <col className="w-[18%]" />
          </colgroup>
          <thead className="bg-[#F8FAFC]">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-[#CBD5E1] text-[#6C5CE7] focus:ring-[#6C5CE7]"
                  aria-label="Selecionar todos"
                />
              </th>
              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-medium text-[#64748B]"
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => onSort(column.key as SortField)}
                      className="inline-flex items-center gap-1 transition-colors hover:text-[#6C5CE7]"
                    >
                      {column.label}
                      <SortIcon
                        className={`h-3.5 w-3.5 ${
                          sortBy === column.key
                            ? sortOrder === "asc"
                              ? "rotate-180 text-[#6C5CE7]"
                              : "text-[#6C5CE7]"
                            : "text-[#CBD5E1]"
                        }`}
                      />
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] bg-white">
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm text-[#64748B]"
                >
                  Nenhum produto encontrado.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="transition-colors hover:bg-[#F8FAFC]"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product._id)}
                      onChange={() => toggleOne(product._id)}
                      className="h-4 w-4 rounded border-[#CBD5E1] text-[#6C5CE7] focus:ring-[#6C5CE7]"
                      aria-label={`Selecionar ${product.name}`}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-semibold text-[#1E293B]">
                      {product.name}
                    </span>
                  </td>
                  <td className="max-w-xs px-4 py-4">
                    <p className="text-sm text-[#64748B]">
                      {product.description
                        ? truncateText(product.description)
                        : "—"}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#1E293B]">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-4">
                    <StockIndicator stock={product.stock} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onView(product)}
                        className="rounded-lg bg-[#EDE9FE] p-2.5 text-[#6C5CE7] transition-colors hover:bg-[#DDD6FE]"
                        aria-label={`Visualizar ${product.name}`}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        className="rounded-lg bg-[#EDE9FE] p-2.5 text-[#6C5CE7] transition-colors hover:bg-[#DDD6FE]"
                        aria-label={`Editar ${product.name}`}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(product)}
                        className="rounded-lg bg-[#FEE2E2] p-2.5 text-[#DC2626] transition-colors hover:bg-[#FECACA]"
                        aria-label={`Excluir ${product.name}`}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
