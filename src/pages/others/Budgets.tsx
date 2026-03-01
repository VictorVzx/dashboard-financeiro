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
  createBudget,
  deleteBudget,
  getBudgets,
  updateBudget,
  type Budget,
  type CreateBudgetPayload,
} from "@/lib/dashboard-api"

type BudgetForm = {
  nome: string
  gastoAtual: string
  limite: string
  competencia: string
}

const initialForm: BudgetForm = {
  nome: "",
  gastoAtual: "0",
  limite: "",
  competencia: new Date().toISOString().slice(0, 7),
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function Budgets() {
  const navigate = useNavigate()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [form, setForm] = useState<BudgetForm>(initialForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [formError, setFormError] = useState("")

  useEffect(() => {
    let active = true

    const loadBudgets = async () => {
      setIsLoading(true)
      setError("")

      try {
        const response = await getBudgets()
        if (!active) return
        setBudgets(response)
      } catch (apiError) {
        if (!active) return

        if (apiError instanceof ApiError && (apiError.status === 401 || apiError.status === 403)) {
          logout()
          navigate("/login", { replace: true })
          return
        }

        setError(getErrorMessage(apiError, "Nao foi possivel carregar os orcamentos."))
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void loadBudgets()
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

  const openEditDialog = (budget: Budget) => {
    setEditingId(budget.id)
    setForm({
      nome: budget.nome,
      gastoAtual: String(budget.gastoAtual),
      limite: String(budget.limite),
      competencia: budget.competencia,
    })
    setFormError("")
    setIsDialogOpen(true)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError("")

    const limite = Number(form.limite.replace(",", "."))
    if (!Number.isFinite(limite) || limite <= 0) {
      setFormError("Informe um limite valido maior que zero.")
      return
    }

    const gastoAtual = Number(form.gastoAtual.replace(",", "."))
    if (!Number.isFinite(gastoAtual) || gastoAtual < 0) {
      setFormError("Informe um gasto atual valido.")
      return
    }

    if (!form.competencia) {
      setFormError("Informe a competencia no formato AAAA-MM.")
      return
    }

    const payload: CreateBudgetPayload = {
      nome: form.nome.trim(),
      gastoAtual,
      limite,
      competencia: form.competencia,
    }

    setIsSaving(true)

    try {
      if (editingId === null) {
        const created = await createBudget(payload)
        setBudgets((previous) => [created, ...previous])
      } else {
        const updated = await updateBudget(editingId, payload)
        setBudgets((previous) => previous.map((budget) => (budget.id === updated.id ? updated : budget)))
      }

      setIsDialogOpen(false)
      setForm(initialForm)
    } catch (apiError) {
      if (apiError instanceof ApiError && (apiError.status === 401 || apiError.status === 403)) {
        logout()
        navigate("/login", { replace: true })
        return
      }

      setFormError(getErrorMessage(apiError, "Nao foi possivel salvar o orcamento."))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Deseja realmente excluir este orcamento?")
    if (!confirmed) return

    try {
      await deleteBudget(id)
      setBudgets((previous) => previous.filter((budget) => budget.id !== id))
    } catch (apiError) {
      if (apiError instanceof ApiError && (apiError.status === 401 || apiError.status === 403)) {
        logout()
        navigate("/login", { replace: true })
        return
      }
      setError(getErrorMessage(apiError, "Nao foi possivel excluir o orcamento."))
    }
  }

  return (
    <PageShell>
      <section className="space-y-4 rounded-2xl border border-border/80 bg-card/95 p-4 shadow-sm md:p-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">Orcamentos</h2>
            <p className="text-sm text-muted-foreground">Controle seus limites mensais por categoria.</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer" onClick={openCreateDialog}>
                <Plus className="size-4" />
                Novo orcamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId === null ? "Novo orcamento" : "Editar orcamento"}</DialogTitle>
                <DialogDescription>Preencha os dados para salvar.</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  placeholder="Nome da categoria"
                  value={form.nome}
                  onChange={(event) => setForm((previous) => ({ ...previous, nome: event.target.value }))}
                  required
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Gasto atual"
                    value={form.gastoAtual}
                    onChange={(event) => setForm((previous) => ({ ...previous, gastoAtual: event.target.value }))}
                    required
                  />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Limite"
                    value={form.limite}
                    onChange={(event) => setForm((previous) => ({ ...previous, limite: event.target.value }))}
                    required
                  />
                </div>
                <Input
                  type="month"
                  value={form.competencia}
                  onChange={(event) => setForm((previous) => ({ ...previous, competencia: event.target.value }))}
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
          {isLoading && <p className="text-sm text-muted-foreground">Carregando orcamentos...</p>}

          {!isLoading && budgets.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum orcamento cadastrado ainda.</p>
          )}

          {!isLoading &&
            budgets.map((item) => {
              const porcentagem = item.limite > 0 ? Math.round((item.gastoAtual / item.limite) * 100) : 0
              return (
                <article key={item.id} className="rounded-xl border border-border/70 bg-background/80 p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="font-medium">{item.nome}</h3>
                    <span className="text-sm text-muted-foreground">{porcentagem}% usado</span>
                  </div>

                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full ${
                        porcentagem >= 85 ? "bg-rose-500" : porcentagem >= 70 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(porcentagem, 100)}%` }}
                    />
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {formatCurrency(item.gastoAtual)} / {formatCurrency(item.limite)}
                  </p>
                  <p className="text-xs text-muted-foreground">Competencia: {item.competencia}</p>

                  <div className="mt-3 flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
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

export default Budgets
