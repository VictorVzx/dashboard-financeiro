import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Pencil, Plus, Trash2 } from "lucide-react"
import PageShell from "@/components/PageShell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ApiError, getErrorMessage } from "@/lib/api"
import { logout } from "@/lib/auth"
import {
  createGoal,
  deleteGoal,
  getGoals,
  updateGoal,
  type CreateGoalPayload,
  type Goal,
} from "@/lib/dashboard-api"

type GoalForm = {
  titulo: string
  atual: string
  alvo: string
  prazo: string
}

const initialForm: GoalForm = {
  titulo: "",
  atual: "0",
  alvo: "",
  prazo: "",
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR")
}

function Goals() {
  const navigate = useNavigate()
  const [goals, setGoals] = useState<Goal[]>([])
  const [form, setForm] = useState<GoalForm>(initialForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [formError, setFormError] = useState("")

  useEffect(() => {
    let active = true

    const loadGoals = async () => {
      setIsLoading(true)
      setError("")

      try {
        const response = await getGoals()
        if (!active) return
        setGoals(response)
      } catch (apiError) {
        if (!active) return

        if (apiError instanceof ApiError && (apiError.status === 401 || apiError.status === 403)) {
          logout()
          navigate("/login", { replace: true })
          return
        }

        setError(getErrorMessage(apiError, "Não foi possível carregar as metas."))
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void loadGoals()
    return () => {
      active = false
    }
  }, [navigate])

  const openCreateDialog = () => {
    setEditingId(null)
    setForm(initialForm)
    setFormError("")
    setIsDialogOpen(true)
  }

  const openEditDialog = (goal: Goal) => {
    setEditingId(goal.id)
    setForm({
      titulo: goal.titulo,
      atual: String(goal.atual),
      alvo: String(goal.alvo),
      prazo: goal.prazo,
    })
    setFormError("")
    setIsDialogOpen(true)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError("")

    const atual = Number(form.atual.replace(",", "."))
    if (!Number.isFinite(atual) || atual < 0) {
      setFormError("Informe o valor atual corretamente.")
      return
    }

    const alvo = Number(form.alvo.replace(",", "."))
    if (!Number.isFinite(alvo) || alvo <= 0) {
      setFormError("Informe o valor alvo maior que zero.")
      return
    }

    if (!form.prazo) {
      setFormError("Informe o prazo da meta.")
      return
    }

    const payload: CreateGoalPayload = {
      titulo: form.titulo.trim(),
      atual,
      alvo,
      prazo: form.prazo,
    }

    setIsSaving(true)

    try {
      if (editingId === null) {
        const created = await createGoal(payload)
        setGoals((previous) => [created, ...previous])
      } else {
        const updated = await updateGoal(editingId, payload)
        setGoals((previous) => previous.map((goal) => (goal.id === updated.id ? updated : goal)))
      }
      setIsDialogOpen(false)
      setForm(initialForm)
    } catch (apiError) {
      if (apiError instanceof ApiError && (apiError.status === 401 || apiError.status === 403)) {
        logout()
        navigate("/login", { replace: true })
        return
      }

      setFormError(getErrorMessage(apiError, "Não foi possível salvar a meta."))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Deseja realmente excluir esta meta?")
    if (!confirmed) return

    try {
      await deleteGoal(id)
      setGoals((previous) => previous.filter((goal) => goal.id !== id))
    } catch (apiError) {
      if (apiError instanceof ApiError && (apiError.status === 401 || apiError.status === 403)) {
        logout()
        navigate("/login", { replace: true })
        return
      }

      setError(getErrorMessage(apiError, "Não foi possível excluir a meta."))
    }
  }

  return (
    <PageShell>
      <section className="space-y-4 rounded-2xl border border-border/80 bg-card/95 p-4 shadow-sm md:p-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">Metas</h2>
            <p className="text-sm text-muted-foreground">Acompanhe seu progresso financeiro por objetivo.</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer" onClick={openCreateDialog}>
                <Plus className="size-4" />
                Nova meta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId === null ? "Nova meta" : "Editar meta"}</DialogTitle>
                <DialogDescription>Preencha os dados para salvar.</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  placeholder="Título da meta"
                  value={form.titulo}
                  onChange={(event) => setForm((previous) => ({ ...previous, titulo: event.target.value }))}
                  required
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Valor atual"
                    value={form.atual}
                    onChange={(event) => setForm((previous) => ({ ...previous, atual: event.target.value }))}
                    required
                  />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Valor alvo"
                    value={form.alvo}
                    onChange={(event) => setForm((previous) => ({ ...previous, alvo: event.target.value }))}
                    required
                  />
                </div>
                <Input
                  type="date"
                  value={form.prazo}
                  onChange={(event) => setForm((previous) => ({ ...previous, prazo: event.target.value }))}
                  required
                />

                {formError && <p className="text-xs text-destructive">{formError}</p>}

                <DialogFooter>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Salvando..." : "Salvar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        {error && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {isLoading && <p className="text-sm text-muted-foreground">Carregando metas...</p>}

          {!isLoading && goals.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma meta cadastrada.</p>}

          {!isLoading &&
            goals.map((goal) => {
              const percentual = goal.alvo > 0 ? Math.round((goal.atual / goal.alvo) * 100) : 0
              return (
                <article key={goal.id} className="rounded-xl border border-border/70 bg-background/80 p-4">
                  <h3 className="text-lg font-semibold">{goal.titulo}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">Prazo: {formatDate(goal.prazo)}</p>

                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-sky-500" style={{ width: `${Math.min(percentual, 100)}%` }} />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span>{formatCurrency(goal.atual)}</span>
                    <span className="text-muted-foreground">Meta: {formatCurrency(goal.alvo)}</span>
                  </div>
                  <p className="mt-1 text-xs text-sky-600 dark:text-sky-400">{percentual}% concluído</p>

                  <div className="mt-3 flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(goal)}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(goal.id)}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </article>
              )
            })}
        </div>
      </section>
    </PageShell>
  )
}

export default Goals
