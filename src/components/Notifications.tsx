import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ApiError, getErrorMessage } from "@/lib/api"
import { logout } from "@/lib/auth"
import { getCachedDashboardOverview, getDashboardOverview, type DashboardOverview } from "@/lib/dashboard-api"

type NotificationItem = {
  titulo: string
  descricao: string
  tempo: string
  tipo: "alerta" | "meta" | "entrada" | "saida"
}

const NOTIFICATION_REFRESH_INTERVAL_MS = 30_000

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR")
}

function buildNotificationItems(overview: DashboardOverview): NotificationItem[] {
  const generated: NotificationItem[] = []

  if (overview.budgetUsagePercent >= 80) {
    generated.push({
      titulo: "Orcamento proximo do limite",
      descricao: `Uso atual de ${Math.round(overview.budgetUsagePercent)}% do orcamento mensal.`,
      tempo: "Agora",
      tipo: "alerta",
    })
  }

  if (overview.goals.length > 0) {
    const goal = overview.goals[0]
    generated.push({
      titulo: "Meta atualizada",
      descricao: `${goal.title}: ${Math.round(goal.progressPercent)}% concluido.`,
      tempo: `Prazo ${formatDate(goal.deadline)}`,
      tipo: "meta",
    })
  }

  generated.push(
    ...overview.activities.slice(0, 3).map(
      (activity): NotificationItem => ({
        titulo: activity.type === "ENTRADA" ? "Entrada registrada" : "Saida registrada",
        descricao: `${activity.title}: ${formatCurrency(activity.amount)}.`,
        tempo: formatDate(activity.date),
        tipo: activity.type === "ENTRADA" ? "entrada" : "saida",
      }),
    ),
  )

  return generated
}

export function Notification() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<NotificationItem[]>(() => {
    const cachedOverview = getCachedDashboardOverview()
    return cachedOverview ? buildNotificationItems(cachedOverview) : []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(() =>
    getCachedDashboardOverview() ? Date.now() : null,
  )
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open) return

    const hasFreshData =
      lastFetchedAt !== null && Date.now() - lastFetchedAt < NOTIFICATION_REFRESH_INTERVAL_MS
    if (hasFreshData) return

    let active = true

    const loadNotifications = async () => {
      setIsLoading(true)

      try {
        const overview = await getDashboardOverview()
        if (!active) return

        setItems(buildNotificationItems(overview))
        setLastFetchedAt(Date.now())
        setError("")
      } catch (apiError) {
        if (!active) return

        if (apiError instanceof ApiError && (apiError.status === 401 || apiError.status === 403)) {
          logout()
          navigate("/login", { replace: true })
          return
        }

        setError(getErrorMessage(apiError, "Nao foi possivel carregar notificacoes."))
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void loadNotifications()

    return () => {
      active = false
    }
  }, [navigate, open, lastFetchedAt])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-fit cursor-pointer px-2 sm:px-3">
          <Bell className="size-4" />
          <span className="hidden sm:inline">Notificacoes</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <PopoverHeader>
          <PopoverTitle>Notificacoes</PopoverTitle>
          <PopoverDescription>Atualizacoes recentes da sua conta.</PopoverDescription>
        </PopoverHeader>

        {error && <p className="mt-3 text-xs text-destructive">{error}</p>}

        <div className="mt-3 space-y-2">
          {isLoading && (
            <p className="text-xs text-muted-foreground">Atualizando notificacoes...</p>
          )}

          {!error && items.length === 0 && (
            <p className="text-xs text-muted-foreground">Sem notificacoes no momento.</p>
          )}

          {items.map((item) => (
            <div key={`${item.titulo}-${item.tempo}`} className="rounded-md border border-border/70 bg-background/70 p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{item.titulo}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    item.tipo === "alerta"
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : item.tipo === "meta"
                        ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                        : item.tipo === "entrada"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {item.tipo}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{item.descricao}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">{item.tempo}</p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
