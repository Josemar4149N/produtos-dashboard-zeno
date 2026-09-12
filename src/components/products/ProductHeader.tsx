import { CubeIcon, PlusIcon } from "@/components/icons";

type ProductHeaderProps = {
  onNewProduct: () => void;
};

export function ProductHeader({ onNewProduct }: ProductHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#6C5CE7] text-white">
          <CubeIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Produtos</h1>
          <p className="mt-1 max-w-none text-sm text-[#64748B] lg:whitespace-nowrap">
            Gerencie os produtos da sua loja. Aqui você pode visualizar, editar,
            adicionar ou remover produtos.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onNewProduct}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#6C5CE7] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5B4BD4]"
      >
        <PlusIcon className="h-4 w-4" />
        Novo Produto
      </button>
    </header>
  );
}
