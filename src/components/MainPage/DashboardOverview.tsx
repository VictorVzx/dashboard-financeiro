import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowDown,
  ArrowUp,
  Hand,
  Plus,
  TrendingUp,
  Wallet,
  CheckCircle2,
  CreditCard,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ApiError, getErrorMessage } from "@/lib/api"
import { getCachedDashboardOverview, getDashboardOverview, type DashboardOverview } from "@/lib/dashboard-api"
import { logout } from "@/lib/auth"

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function DashboardOverviewComponent() {
  const navigate = useNavigate()
  const [overview, setOverview] = useState<DashboardOverview | null>(() => getCachedDashboardOverview())
  const [isLoading, setIsLoading] = useState(() => getCachedDashboardOverview() === null)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    const loadOverview = async () => {
      const hasCachedOverview = getCachedDashboardOverview() !== null
      if (!hasCachedOverview) {
        setIsLoading(true)
      }
      setError("")

      try {
        const response = await getDashboardOverview()
        if (!active) return
        setOverview(response)
      } catch (apiError) {
        if (!active) return

        if (apiError instanceof ApiError && apiError.status === 401) {
          logout()
          navigate("/login", { replace: true })
          return
        }

        setError(getErrorMessage(apiError, "Nao foi possivel carregar o dashboard."))
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void loadOverview()

    return () => {
      active = false
    }
  }, [navigate])

  const monthlyBalance = useMemo(() => overview?.monthlyBalance ?? [], [overview])
  const chartMax = useMemo(() => {
    const maxValue = monthlyBalance.reduce((acc, entry) => Math.max(acc, entry.value), 0)
    return maxValue > 0 ? maxValue * 1.2 : 1
  }, [monthlyBalance])

  const points = useMemo(() => {
    if (monthlyBalance.length === 0) return []

    const space = 584 / Math.max(monthlyBalance.length - 1, 1)
    return monthlyBalance.map((entry, index) => {
      const x = index * space + 36
      const y = 220 - (entry.value / chartMax) * 180
      return `${x},${y}`
    })
  }, [monthlyBalance, chartMax])

  const headlineName = overview?.userName ?? "Usuario"
  const goals = useMemo(() => overview?.goals ?? [], [overview])
  const activities = useMemo(() => overview?.activities ?? [], [overview])

  return (
    <section className="space-y-4 rounded-2xl border border-border/80 bg-card/95 p-3 shadow-sm sm:p-4 md:p-6">
      <header className="flex flex-col gap-4 rounded-xl border border-border/70 bg-background/80 p-4 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-2 text-base font-semibold sm:text-lg">
          <Hand className="mt-0.5 size-5 shrink-0" />
          <h2>Ola, {headlineName}! Aqui esta o resumo do seu mes</h2>
        </div>
        <Button asChild className="w-full cursor-pointer md:w-auto" variant="outline">
          <Link to="/transacoes">
            <Plus className="size-4" />
            Adicionar movimentacao
          </Link>
        </Button>
      </header>

      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <article className="space-y-1 rounded-xl border border-border/70 bg-background/80 p-4 xl:col-span-4">
          <p className="text-sm text-muted-foreground">Saldo atual</p>
          <p className="text-2xl font-semibold">{formatCurrency(overview?.currentBalance ?? 0)}</p>
          <p className="text-sm text-muted-foreground">
            Disponivel: {formatCurrency(overview?.availableBalance ?? 0)}
          </p>
          <p className="text-sm text-muted-foreground">Guardado: {formatCurrency(overview?.savedBalance ?? 0)}</p>
        </article>

        <article className="rounded-xl border border-border/70 bg-background/80 p-4 xl:col-span-8">
          <p className="text-sm text-muted-foreground">
            Dados em tempo real do backend para todas as secoes do dashboard.
          </p>
        </article>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-border/70 bg-background/80 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Wallet className="size-4 text-sky-500" />
            Saldo atual
          </div>
          <p className="text-2xl font-semibold sm:text-3xl">{formatCurrency(overview?.currentBalance ?? 0)}</p>
          <p className="mt-1 text-sm text-sky-600 dark:text-sky-400">
            Liquido do mes: {formatCurrency(overview?.monthNet ?? 0)}
          </p>
        </article>

        <article className="rounded-xl border border-border/70 bg-background/80 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <ArrowDown className="size-4 text-rose-500" />
            Gastos do mes
          </div>
          <p className="text-2xl font-semibold sm:text-3xl">{formatCurrency(overview?.monthExpense ?? 0)}</p>
          <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
            {Math.round(overview?.budgetUsagePercent ?? 0)}% do orcamento
          </p>
        </article>

        <article className="rounded-xl border border-border/70 bg-background/80 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <ArrowUp className="size-4 text-emerald-500" />
            Receita do mes
          </div>
          <p className="text-2xl font-semibold sm:text-3xl">{formatCurrency(overview?.monthIncome ?? 0)}</p>
          <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">Dados atualizados</p>
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

          {isLoading && <p className="text-sm text-muted-foreground">Carregando grafico...</p>}

          {!isLoading && monthlyBalance.length > 0 && (
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
                  const space = 584 / Math.max(monthlyBalance.length - 1, 1)
                  const x = index * space + 36
                  const y = 220 - (entry.value / chartMax) * 180
                  return (
                    <g key={`${entry.month}-${index}`}>
                      <circle
                        cx={x}
                        cy={y}
                        r="5"
                        className="fill-background stroke-sky-600 dark:stroke-sky-400"
                        strokeWidth="2"
                      />
                      <text x={x} y="246" textAnchor="middle" className="fill-muted-foreground text-[12px]">
                        {entry.month}
                      </text>
                    </g>
                  )
                })}

                <text x="470" y="74" className="fill-foreground text-[14px] font-semibold">
                  {formatCurrency(overview?.currentBalance ?? 0)}
                </text>
              </svg>
            </div>
          )}
        </article>

        <div className="space-y-4 xl:col-span-4">
          <article className="rounded-xl border border-border/70 bg-background/80 p-4">
            <h3 className="mb-3 text-base font-semibold">Metas do mes</h3>
            {goals.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma meta cadastrada ainda.</p>
            ) : (
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div key={goal.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>{goal.title}</span>
                      <span>{Math.round(goal.progressPercent)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-sky-500"
                        style={{ width: `${Math.min(Math.round(goal.progressPercent), 100)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="rounded-xl border border-border/70 bg-background/80 p-4">
            <h3 className="mb-2 text-base font-semibold">Controle e atividade</h3>
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem movimentacoes recentes.</p>
            ) : (
              <div className="space-y-2 text-sm">
                {activities.slice(0, 4).map((activityItem) => (
                  <div key={activityItem.id} className="flex items-center gap-2">
                    {activityItem.type === "ENTRADA" ? (
                      <CheckCircle2 className="size-4 text-emerald-500" />
                    ) : (
                      <CreditCard className="size-4 text-rose-500" />
                    )}
                    <span className="truncate">
                      {activityItem.title}: {formatCurrency(activityItem.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="size-3.5" />
              Atualizado automaticamente
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default DashboardOverviewComponent
