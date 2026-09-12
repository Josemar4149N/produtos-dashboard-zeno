# Produtos Dashboard

Dashboard de gestão de produtos desenvolvido como teste técnico para a Zeno.

## Stack

- **Next.js 16** (App Router)
- **React Server Components** + **Server Actions**
- **Tailwind CSS 4**
- **TypeScript**

## Funcionalidades

- Listagem de produtos com paginação
- Busca por nome e descrição
- Filtros por estado de estoque
- Ordenação por colunas
- Criar, visualizar, editar e excluir produtos
- Seleção múltipla e exclusão em lote

## Arquitetura

```
src/
├── app/                    # Rotas e Server Components
├── components/
│   ├── icons/              # Ícones SVG
│   └── products/           # Componentes da página de produtos
└── lib/
    ├── actions/            # Server Actions (mutations)
    ├── api/                # Camada de acesso à API (server-side)
    ├── constants.ts
    ├── types.ts
    └── utils/
```

- **Server Components** (`page.tsx`): buscam dados da API no servidor
- **Server Actions** (`lib/actions/products.ts`): mutations com revalidação
- **Client Components**: interatividade (modais, busca, paginação via URL)

## Configuração

```bash
npm install
cp .env.example .env.local
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | URL base da API |
| `NEXT_PUBLIC_USER_ID` | ID do usuário para autenticação na API |

## Deploy

Produção:

- **GitHub:** https://github.com/Josemar4149N/produtos-dashboard-zeno
- **Render:** https://produtos-dashboard-zeno.onrender.com

### Render

1. Conecte o repositório GitHub
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`
4. Adicione as variáveis de ambiente

### Netlify

1. Conecte o repositório
2. Build command: `npm run build`
3. Publish directory: `.next` (use o plugin `@netlify/plugin-nextjs`)

## Scripts

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # ESLint
```
