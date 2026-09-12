"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { deleteProductsAction } from "@/lib/actions/products";
import { ProductFormModal } from "@/components/products/ProductFormModal";
import { DeleteConfirmModal } from "@/components/products/DeleteConfirmModal";
import { ProductHeader } from "@/components/products/ProductHeader";
import { SearchAndFilters } from "@/components/products/SearchAndFilters";
import { ProductTable } from "@/components/products/ProductTable";
import { Pagination } from "@/components/products/Pagination";
import { Toast } from "@/components/ui/Toast";
import type {
  PaginationMeta,
  Product,
  SortField,
  SortOrder,
} from "@/lib/types";

type ProductsViewProps = {
  products: Product[];
  pagination: PaginationMeta;
  sortBy: SortField;
  sortOrder: SortOrder;
};

type ModalState =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; product: Product }
  | { type: "view"; product: Product }
  | { type: "delete"; product: Product };

type Notice = {
  type: "success" | "error";
  message: string;
};

export function ProductsView({
  products,
  pagination,
  sortBy,
  sortOrder,
}: ProductsViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [modal, setModal] = useState<ModalState>({ type: "closed" });
  const [notice, setNotice] = useState<Notice | null>(null);

  function handleSort(field: SortField) {
    const params = new URLSearchParams(searchParams.toString());
    const nextOrder =
      sortBy === field && sortOrder === "asc" ? "desc" : "asc";

    params.set("sortBy", field);
    params.set("sortOrder", nextOrder);
    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleBulkDelete(ids: string[]) {
    startTransition(async () => {
      const result = await deleteProductsAction(ids);

      if (result.success) {
        setNotice({
          type: "success",
          message: `${ids.length} produto(s) eliminado(s) com sucesso.`,
        });
      } else {
        setNotice({ type: "error", message: result.error });
      }
    });
  }

  function showSuccess(message: string) {
    setNotice({ type: "success", message });
  }

  function showError(message: string) {
    setNotice({ type: "error", message });
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <ProductHeader onNewProduct={() => setModal({ type: "create" })} />

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        <div className="border-b border-[#E2E8F0] p-4 sm:p-5">
          <SearchAndFilters />
        </div>

        <ProductTable
          products={products}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onView={(product) => setModal({ type: "view", product })}
          onEdit={(product) => setModal({ type: "edit", product })}
          onDelete={(product) => setModal({ type: "delete", product })}
          onBulkDelete={handleBulkDelete}
        />

        <div className="border-t border-[#E2E8F0] p-4 sm:px-5 sm:py-4">
          <Pagination pagination={pagination} />
        </div>
      </section>

      <ProductFormModal
        mode={modal.type === "create" ? "create" : modal.type === "edit" ? "edit" : "view"}
        product={
          modal.type === "edit" || modal.type === "view"
            ? modal.product
            : null
        }
        open={
          modal.type === "create" ||
          modal.type === "edit" ||
          modal.type === "view"
        }
        onClose={() => setModal({ type: "closed" })}
        onSuccess={showSuccess}
      />

      <DeleteConfirmModal
        product={modal.type === "delete" ? modal.product : null}
        open={modal.type === "delete"}
        onClose={() => setModal({ type: "closed" })}
        onSuccess={showSuccess}
        onError={showError}
      />

      {notice && (
        <Toast
          message={notice.message}
          type={notice.type}
          onClose={() => setNotice(null)}
        />
      )}
    </div>
  );
}
