import { API_BASE_URL, DEFAULT_PAGE_SIZE, USER_ID } from "@/lib/constants";
import type {
  ApiResponse,
  PaginationMeta,
  Product,
  ProductFormData,
  ProductQueryParams,
  SortField,
  SortOrder,
  StockFilter,
} from "@/lib/types";

function buildProductsUrl(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams({ user: USER_ID });

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  return `${API_BASE_URL}/api/products?${searchParams.toString()}`;
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Erro na requisição: ${response.status}`);
  }

  return response.json() as Promise<ApiResponse<T>>;
}

function filterProducts(
  products: Product[],
  search?: string,
  stockFilter: StockFilter = "all",
): Product[] {
  let filtered = products;

  if (search?.trim()) {
    const term = search.trim().toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term),
    );
  }

  switch (stockFilter) {
    case "in_stock":
      filtered = filtered.filter((product) => product.stock > 10);
      break;
    case "low_stock":
      filtered = filtered.filter(
        (product) => product.stock > 0 && product.stock <= 10,
      );
      break;
    case "out_of_stock":
      filtered = filtered.filter((product) => product.stock === 0);
      break;
    default:
      break;
  }

  return filtered;
}

function sortProducts(
  products: Product[],
  sortBy: SortField = "name",
  sortOrder: SortOrder = "asc",
): Product[] {
  const sorted = [...products].sort((a, b) => {
    const direction = sortOrder === "asc" ? 1 : -1;

    switch (sortBy) {
      case "price":
      case "stock":
        return (a[sortBy] - b[sortBy]) * direction;
      case "description":
        return (
          (a.description ?? "").localeCompare(b.description ?? "", "pt") *
          direction
        );
      case "name":
      default:
        return a.name.localeCompare(b.name, "pt") * direction;
    }
  });

  return sorted;
}

function paginateProducts(
  products: Product[],
  page: number,
  pageSize: number,
): { data: Product[]; pagination: PaginationMeta } {
  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    data: products.slice(start, start + pageSize),
    pagination: {
      total,
      currentPage,
      totalPages,
      pageSize,
    },
  };
}

export async function getProducts(params: ProductQueryParams = {}) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const hasClientFilters =
    Boolean(params.search?.trim()) ||
    (params.stockFilter && params.stockFilter !== "all");

  if (hasClientFilters) {
    const response = await fetch(buildProductsUrl({ pageSize: 1000 }), {
      next: { tags: ["products"] },
    });
    const payload = await parseResponse<Product[]>(response);
    const filtered = filterProducts(
      payload.data,
      params.search,
      params.stockFilter,
    );
    const sorted = sortProducts(
      filtered,
      params.sortBy,
      params.sortOrder,
    );

    return paginateProducts(sorted, page, pageSize);
  }

  const response = await fetch(
    buildProductsUrl({ page, pageSize }),
    { next: { tags: ["products"] } },
  );
  const payload = await parseResponse<Product[]>(response);
  const sorted = sortProducts(payload.data, params.sortBy, params.sortOrder);

  return {
    data: sorted,
    pagination: payload.pagination ?? {
      total: sorted.length,
      currentPage: page,
      totalPages: 1,
      pageSize,
    },
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  const url = `${API_BASE_URL}/api/products/by-id?id=${id}&user=${USER_ID}`;
  const response = await fetch(url, { next: { tags: [`product-${id}`] } });

  if (response.status === 404) {
    return null;
  }

  const payload = await parseResponse<Product | Product[]>(response);
  const product = Array.isArray(payload.data) ? payload.data[0] : payload.data;

  return product ?? null;
}

export async function createProduct(
  data: ProductFormData,
): Promise<Product> {
  const response = await fetch(buildProductsUrl({}), {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json; charset=utf-8",
    },
    body: JSON.stringify({ ...data, user: USER_ID }),
  });

  const payload = await parseResponse<Product | Product[]>(response);
  const product = Array.isArray(payload.data) ? payload.data[0] : payload.data;

  if (!product) {
    throw new Error("Não foi possível criar o produto.");
  }

  return product;
}

export async function updateProduct(
  id: string,
  data: Partial<ProductFormData>,
): Promise<Product> {
  const url = `${API_BASE_URL}/api/products?id=${id}&user=${USER_ID}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json; charset=utf-8",
    },
    body: JSON.stringify(data),
  });

  const payload = await parseResponse<Product | Product[]>(response);
  const product = Array.isArray(payload.data) ? payload.data[0] : payload.data;

  if (!product) {
    throw new Error("Não foi possível atualizar o produto.");
  }

  return product;
}

export async function deleteProduct(id: string): Promise<void> {
  const url = `${API_BASE_URL}/api/products?id=${id}&user=${USER_ID}`;
  const response = await fetch(url, { method: "DELETE" });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Não foi possível excluir o produto.");
  }
}
