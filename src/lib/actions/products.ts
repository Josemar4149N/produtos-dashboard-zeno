"use server";

import { revalidatePath } from "next/cache";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/lib/api/products";
import type { ProductFormData } from "@/lib/types";

type ValidationResult =
  | { success: true; data: ProductFormData }
  | { success: false; error: string };

function validateProductData(data: unknown): ValidationResult {
  if (!data || typeof data !== "object") {
    return { success: false, error: "Dados do produto inválidos." };
  }

  const input = data as Partial<ProductFormData>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const description =
    input.description === undefined
      ? undefined
      : typeof input.description === "string"
        ? input.description.trim() || undefined
        : null;

  if (!name) {
    return { success: false, error: "O nome do produto é obrigatório." };
  }

  if (name.length > 150) {
    return { success: false, error: "O nome do produto é muito longo." };
  }

  if (description === null) {
    return { success: false, error: "A descrição do produto é inválida." };
  }

  if (
    typeof input.price !== "number" ||
    !Number.isFinite(input.price) ||
    input.price < 0
  ) {
    return { success: false, error: "O preço deve ser um número válido." };
  }

  if (
    typeof input.stock !== "number" ||
    !Number.isInteger(input.stock) ||
    input.stock < 0
  ) {
    return { success: false, error: "O estoque deve ser um número inteiro válido." };
  }

  return {
    success: true,
    data: { name, description, price: input.price, stock: input.stock },
  };
}

function revalidateProducts() {
  revalidatePath("/");
}

function isValidProductId(id: unknown): id is string {
  return typeof id === "string" && id.trim().length > 0 && id.length <= 100;
}

export async function createProductAction(data: ProductFormData) {
  const validation = validateProductData(data);
  if (!validation.success) return validation;

  try {
    const product = await createProduct(validation.data);
    revalidateProducts();
    return { success: true as const, data: product };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Erro ao criar produto.",
    };
  }
}

export async function updateProductAction(
  id: string,
  data: Partial<ProductFormData>,
) {
  const validation = validateProductData(data);
  if (!validation.success) return validation;

  try {
    const product = await updateProduct(id, validation.data);
    revalidateProducts();
    return { success: true as const, data: product };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Erro ao atualizar produto.",
    };
  }
}

export async function deleteProductAction(id: string) {
  if (!isValidProductId(id)) {
    return { success: false as const, error: "Produto inválido." };
  }

  try {
    await deleteProduct(id);
    revalidateProducts();
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Erro ao excluir produto.",
    };
  }
}

export async function deleteProductsAction(ids: string[]) {
  if (!Array.isArray(ids) || ids.length === 0 || !ids.every(isValidProductId)) {
    return { success: false as const, error: "Produtos inválidos." };
  }

  try {
    await Promise.all(ids.map((id) => deleteProduct(id)));
    revalidateProducts();
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Erro ao excluir produtos.",
    };
  }
}
