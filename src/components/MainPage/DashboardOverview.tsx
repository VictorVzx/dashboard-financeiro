import {
  ArrowDown,
  ArrowUp,
  Hand,
  Plus,
  TrendingUp,
  Wallet,
  CheckCircle2,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const monthlyBalance = [
  { month: "Out", value: 320 },
  { month: "Nov", value: 820 },
  { month: "Dez", value: 740 },
  { month: "Jan", value: 1260 },
  { month: "Fev", value: 1450 },
  { month: "Mar", value: 2280 },
]

const chartMax = 2500
const points = monthlyBalance.map((entry, index) => {
  const x = index * 120 + 36
  const y = 220 - (entry.value / chartMax) * 180
  return `${x},${y}`
})

function DashboardOverview() {
  return (
    <section className="space-y-4 rounded-2xl border border-border/80 bg-card/95 p-3 shadow-sm sm:p-4 md:p-6">
      <header className="flex flex-col gap-4 rounded-xl border border-border/70 bg-background/80 p-4 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-2 text-base font-semibold sm:text-lg">
          <Hand className="mt-0.5 size-5 shrink-0" />
          <h2>Ola, Victor! Aqui esta o resumo do seu mes</h2>
        </div>
        <Button className="w-full cursor-pointer md:w-auto" variant="outline">
          <Plus className="size-4" />
          Adicionar movimentacao
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <article className="space-y-1 rounded-xl border border-border/70 bg-background/80 p-4 xl:col-span-4">
          <p className="text-sm text-muted-foreground">Saldo atual</p>
          <p className="text-2xl font-semibold">R$ 1.450,00</p>
          <p className="text-sm text-muted-foreground">Disponivel: R$ 1.120,00</p>
          <p className="text-sm text-muted-foreground">Guardado: R$ 330,00</p>
        </article>

        <article className="rounded-xl border border-border/70 bg-background/80 p-4 xl:col-span-8">
          <p className="text-sm text-muted-foreground">
            Cartoes dinamicos com retorno visual em tempo real
          </p>
        </article>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-border/70 bg-background/80 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Wallet className="size-4 text-sky-500" />
            Saldo atual
          </div>
          <p className="text-2xl font-semibold sm:text-3xl">R$ 1.450,00</p>
          <p className="mt-1 text-sm text-sky-600 dark:text-sky-400">+12% vs mes passado</p>
        </article>

        <article className="rounded-xl border border-border/70 bg-background/80 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <ArrowDown className="size-4 text-rose-500" />
            Gastos do mes
          </div>
          <p className="text-2xl font-semibold sm:text-3xl">R$ 830,00</p>
          <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">82% do orcamento</p>
        </article>

        <article className="rounded-xl border border-border/70 bg-background/80 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <ArrowUp className="size-4 text-emerald-500" />
            Receita do mes
          </div>
          <p className="text-2xl font-semibold sm:text-3xl">R$ 2.280,00</p>
          <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">+18%</p>
        </article>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <article className="rounded-xl border border-border/70 bg-background/80 p-4 xl:col-span-8">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-base font-semibold">Evolucao do saldo - ultimos 6 meses</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="size-4 text-sky-500" />
              Saldo
            </div>
          </div>

          <div className="overflow-x-auto">
            <svg viewBox="0 0 640 260" className="h-[220px] min-w-[560px] w-full">
              <defs>
                <linearGradient id="balance-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              <g className="text-border">
                <line x1="36" y1="220" x2="620" y2="220" stroke="currentColor" />
                <line x1="36" y1="160" x2="620" y2="160" stroke="currentColor" strokeDasharray="4 4" />
                <line x1="36" y1="100" x2="620" y2="100" stroke="currentColor" strokeDasharray="4 4" />
                <line x1="36" y1="40" x2="620" y2="40" stroke="currentColor" strokeDasharray="4 4" />
              </g>

              <polyline
                points={`${points.join(" ")} 620,220 36,220`}
                className="text-sky-500 dark:text-sky-400"
                fill="url(#balance-fill)"
                stroke="none"
              />
              <polyline
                points={points.join(" ")}
                className="text-sky-600 dark:text-sky-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {monthlyBalance.map((entry, index) => {
                const x = index * 120 + 36
                const y = 220 - (entry.value / chartMax) * 180
                return (
                  <g key={entry.month}>
                    <circle cx={x} cy={y} r="5" className="fill-background stroke-sky-600 dark:stroke-sky-400" strokeWidth="2" />
                    <text x={x} y="246" textAnchor="middle" className="fill-muted-foreground text-[12px]">
                      {entry.month}
                    </text>
                  </g>
                )
              })}

              <text x="488" y="78" className="fill-foreground text-[14px] font-semibold">
                R$ 1.450,00
              </text>
            </svg>
          </div>
        </article>

        <div className="space-y-4 xl:col-span-4">
          <article className="rounded-xl border border-border/70 bg-background/80 p-4">
            <h3 className="mb-3 text-base font-semibold">Metas do mes</h3>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Economizar</span>
                  <span>R$ 300,00</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 w-1/2 rounded-full bg-emerald-500" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">R$ 150,00 / R$ 300,00</p>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Pagar cartao</span>
                  <span>R$ 1.200,00</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 w-[54%] rounded-full bg-sky-500" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">R$ 650,00 / R$ 1.200,00</p>
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-border/70 bg-background/80 p-4">
            <h3 className="mb-2 text-base font-semibold">Controle e atividade</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                Economizar R$ 300,00
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="size-4 text-sky-500" />
                R$ 650,00 de R$ 1.200,00
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default DashboardOverview
