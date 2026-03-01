# Dashboard Financeiro Pessoal

Projeto frontend de controle financeiro com foco em:
- visualizacao de saldos, gastos, receitas e metas
- navegacao por secoes (painel, contas, transacoes, orcamentos e metas)
- experiencia com tema claro/escuro
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
- Painel principal com cards de resumo e grafico de evolucao
- Secao de contas com cards e indicadores de movimentacao
- Secoes dedicadas para:
  - Transacoes
  - Orcamentos
  - Metas
- Navbar fixa com:
  - notificacoes reais
  - modal de perfil
- Sidebar com:
  - links de navegacao
  - botao de configuracoes em modal
- Modais responsivos (perfil e configuracoes)
- Paginas de autenticacao:
  - Login
  - Registro
  - Recuperacao de senha

## Rotas principais
- `/` - Painel
- `/contas` - Contas
- `/transacoes` - Transacoes
- `/orcamentos` - Orcamentos
- `/metas` - Metas
- `/login` - Login
- `/register` - Registro
- `/forgot` - Recuperar senha

Rotas legadas em ingles tambem estao mapeadas:
- `/accounts`, `/transactions`, `/budgets`, `/goals`

## Estrutura resumida
- `src/pages` - paginas por dominio (`main`, `others`, `auth`)
- `src/components` - componentes de layout e UI de negocio
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
- `npm run build` - build de producao (TypeScript + Vite)
- `npm run preview` - preview do build de producao
- `npm run lint` - executa lint do projeto

## Tema e design
- Tema claro/escuro via classe `dark` no `documentElement`
- Paleta baseada em tokens (`--background`, `--card`, `--border`, etc.)
- Layout responsivo com foco em desktop e adaptacao mobile

## Observacoes
- Dados atuais de dashboard/notificacoes sao reals (frontend only)
- Sem integracao backend no estado atual
