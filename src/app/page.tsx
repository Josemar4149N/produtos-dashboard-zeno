import { Suspense } from "react";
import { ProductsView } from "@/components/products/ProductsView";
import { getProducts } from "@/lib/api/products";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { SortField, SortOrder, StockFilter } from "@/lib/types";

type HomePageProps = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    stockFilter?: string;
  }>;
};

function ProductsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="h-20 animate-pulse rounded-xl bg-white" />
      <div className="h-12 animate-pulse rounded-xl bg-white" />
      <div className="h-96 animate-pulse rounded-xl bg-white" />
    </div>
  );
}

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function getSortField(value: string | undefined): SortField {
  return value === "description" || value === "price" || value === "stock"
    ? value
    : "name";
}

function getSortOrder(value: string | undefined): SortOrder {
  return value === "desc" ? "desc" : "asc";
}

function getStockFilter(value: string | undefined): StockFilter {
  return value === "in_stock" || value === "low_stock" || value === "out_of_stock"
    ? value
    : "all";
}

async function ProductsContent({
  searchParams,
}: {
  searchParams: HomePageProps["searchParams"];
}) {
  const params = await searchParams;

  const page = positiveInteger(params.page, 1);
  const requestedPageSize = positiveInteger(params.pageSize, DEFAULT_PAGE_SIZE);
  const pageSize = [5, 10, 20, 50].includes(requestedPageSize)
    ? requestedPageSize
    : DEFAULT_PAGE_SIZE;
  const sortBy = getSortField(params.sortBy);
  const sortOrder = getSortOrder(params.sortOrder);
  const stockFilter = getStockFilter(params.stockFilter);

  const { data, pagination } = await getProducts({
    page,
    pageSize,
    search: params.search,
    sortBy,
    sortOrder,
    stockFilter,
  });

  return (
    <ProductsView
      products={data}
      pagination={pagination}
      sortBy={sortBy}
      sortOrder={sortOrder}
    />
  );
}

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <main className="min-h-screen bg-[#F1F5F9] px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
      <Suspense fallback={<ProductsLoading />}>
        <ProductsContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
