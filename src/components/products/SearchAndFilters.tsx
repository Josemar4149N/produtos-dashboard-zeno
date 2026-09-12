"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDownIcon, FilterIcon, SearchIcon } from "@/components/icons";
import { PAGE_SIZE_OPTIONS } from "@/lib/constants";
import type { StockFilter } from "@/lib/types";

const STOCK_FILTER_OPTIONS: { value: StockFilter; label: string }[] = [
  { value: "all", label: "Todos os estoques" },
  { value: "in_stock", label: "Em estoque (> 10)" },
  { value: "low_stock", label: "Estoque baixo (1-10)" },
  { value: "out_of_stock", label: "Sem estoque" },
];

export function SearchAndFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const currentFilter = (searchParams.get("stockFilter") ??
    "all") as StockFilter;
  const pageSize = searchParams.get("pageSize") ?? "10";

  useEffect(() => {
    // Sincroniza o campo local quando a URL muda por navegação ou histórico.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(searchParams.get("search") ?? "");
  }, [searchParams]);

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    if (!("page" in updates)) {
      params.delete("page");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentSearch = searchParams.get("search") ?? "";
      if (search !== currentSearch) {
        updateParams({ search: search || null });
      }
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center lg:flex-none">
        <div className="relative min-w-0 flex-1 lg:w-64 lg:flex-none xl:w-72">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome, descrição..."
            className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-sm text-[#1E293B] outline-none transition-shadow placeholder:text-[#94A3B8] focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20"
          />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-medium text-[#475569] transition-colors hover:bg-[#F8FAFC] sm:w-auto"
          >
            <FilterIcon className="h-4 w-4" />
            Filtros
            <ChevronDownIcon className="h-4 w-4" />
          </button>

          {filtersOpen && (
            <>
              <button
                type="button"
                aria-label="Fechar filtros"
                className="fixed inset-0 z-10"
                onClick={() => setFiltersOpen(false)}
              />
              <div className="absolute left-0 z-20 mt-2 w-56 rounded-lg border border-[#E2E8F0] bg-white p-2 shadow-lg">
                {STOCK_FILTER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      updateParams({
                        stockFilter:
                          option.value === "all" ? null : option.value,
                      });
                      setFiltersOpen(false);
                    }}
                    className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      currentFilter === option.value
                        ? "bg-[#F1EEFF] font-medium text-[#6C5CE7]"
                        : "text-[#475569] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 self-start text-sm text-[#64748B] lg:self-auto">
        <span>Mostrar</span>
        <select
          value={pageSize}
          onChange={(event) =>
            updateParams({ pageSize: event.target.value, page: null })
          }
          className="rounded-lg border border-[#E2E8F0] bg-white px-2 py-1.5 text-sm text-[#1E293B] outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20"
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span>por página</span>
      </div>
    </div>
  );
}
