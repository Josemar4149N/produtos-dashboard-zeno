export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  total: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  statusText: string;
  data: T;
  pagination?: PaginationMeta;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  stock: number;
}

export type SortField = "name" | "description" | "price" | "stock";
export type SortOrder = "asc" | "desc";

export type StockFilter = "all" | "in_stock" | "low_stock" | "out_of_stock";

export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  stockFilter?: StockFilter;
}
