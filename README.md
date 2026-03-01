# Dashboard Financeiro Pessoal

Projeto frontend de controle financeiro com foco em:
- visualização de saldos, gastos, receitas e metas
- navegação por seções (painel, contas, transações, orçamentos e metas)
- experiência com tema claro/escuro
- uso de componentes modernos com shadcn + Radix UI

## Stack
- React 19
- Vite 7
- TypeScript
- Tailwind CSS v4
- React Router
- shadcn/ui + Radix UI
- Lucide Icons

## Funcionalidades atuais
- Painel principal com cards de resumo e gráfico de evolução
- Seção de contas com cards e indicadores de movimentação
- Seções dedicadas para:
  - Transações
  - Orçamentos
  - Metas
- Navbar fixa com:
  - notificações reais
  - modal de perfil
- Sidebar com:
  - links de navegação
  - botão de configurações em modal
- Modais responsivos (perfil e configurações)
- Páginas de autenticação:
  - Login
  - Registro
  - Recuperação de senha

## Rotas principais
- `/` - Painel
- `/contas` - Contas
- `/transacoes` - Transações
- `/orcamentos` - Orçamentos
- `/metas` - Metas
- `/login` - Login
- `/register` - Registro
- `/forgot` - Recuperar senha

Rotas legadas em inglês também estão mapeadas:
- `/accounts`, `/transactions`, `/budgets`, `/goals`

## Estrutura resumida
- `src/pages` - páginas por domínio (`main`, `others`, `auth`)
- `src/components` - componentes de layout e UI de negócio
- `src/components/ui` - componentes base do shadcn
- `src/index.css` - tokens de tema e estilos globais

## Como rodar localmente
```bash
npm install
npm run dev
```

App em desenvolvimento:
- `http://localhost:5173`

## Scripts
- `npm run dev` - inicia ambiente de desenvolvimento
- `npm run build` - build de produção (TypeScript + Vite)
- `npm run preview` - preview do build de produção
- `npm run lint` - executa lint do projeto

## Tema e design
- Tema claro/escuro via classe `dark` no `documentElement`
- Paleta baseada em tokens (`--background`, `--card`, `--border`, etc.)
- Layout responsivo com foco em desktop e adaptação mobile
