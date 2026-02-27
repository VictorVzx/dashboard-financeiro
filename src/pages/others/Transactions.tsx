import { useEffect, useMemo, useState, type FormEvent } from "react"
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
  createTransaction,
  deleteTransaction,
  getAccountOptions,
  getTransactions,
  updateTransaction,
  type CreateTransactionPayload,
  type Transaction,
  type TransactionType,
} from "@/lib/dashboard-api"

type TransactionForm = {
  descricao: string
  categoria: string
  tipo: TransactionType
  valor: string
  data: string
  contaId: string
  observacao: string
}

const initialForm: TransactionForm = {
  descricao: "",
  categoria: "",
  tipo: "SAIDA",
  valor: "",
  data: new Date().toISOString().slice(0, 10),
  contaId: "",
  observacao: "",
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR")
}

function Transactions() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [accountOptions, setAccountOptions] = useState<Array<{ id: number; nome: string }>>([])
  const [form, setForm] = useState<TransactionForm>(initialForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [formError, setFormError] = useState("")

  const summary = useMemo(() => {
    const entradas = transactions
      .filter((transaction) => transaction.tipo === "ENTRADA")
      .reduce((acc, transaction) => acc + transaction.valor, 0)
    const saidas = transactions
      .filter((transaction) => transaction.tipo === "SAIDA")
      .reduce((acc, transaction) => acc + transaction.valor, 0)
    return {
      entradas,
      saidas,
      saldo: entradas - saidas,
    }
  }, [transactions])

  useEffect(() => {
    let active = true

    const loadData = async () => {
      setIsLoading(true)
      setError("")

      try {
        const [transactionsResponse, accountsResponse] = await Promise.all([getTransactions(), getAccountOptions()])
        if (!active) return

        setTransactions(transactionsResponse)
        setAccountOptions(accountsResponse)
      } catch (apiError) {
        if (!active) return

        if (apiError instanceof ApiError && apiError.status === 401) {
          logout()
          navigate("/login", { replace: true })
          return
        }

        setError(getErrorMessage(apiError, "Nao foi possivel carregar as transacoes."))
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void loadData()
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

  const openEditDialog = (transaction: Transaction) => {
    setEditingId(transaction.id)
    setForm({
      descricao: transaction.descricao,
      categoria: transaction.categoria,
      tipo: transaction.tipo,
      valor: String(transaction.valor),
      data: transaction.data,
      contaId: transaction.contaId ? String(transaction.contaId) : "",
      observacao: transaction.observacao ?? "",
    })
    setFormError("")
    setIsDialogOpen(true)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError("")

    const valor = Number(form.valor.replace(",", "."))
    if (!Number.isFinite(valor) || valor <= 0) {
      setFormError("Informe um valor valido maior que zero.")
      return
    }

    if (!form.data) {
      setFormError("Informe uma data valida.")
      return
    }

    const payload: CreateTransactionPayload = {
      descricao: form.descricao.trim(),
      categoria: form.categoria.trim(),
      tipo: form.tipo,
      valor,
      data: form.data,
      contaId: form.contaId ? Number(form.contaId) : null,
      observacao: form.observacao.trim() || null,
    }

    setIsSaving(true)

    try {
      if (editingId === null) {
        const created = await createTransaction(payload)
        setTransactions((previous) => [created, ...previous])
      } else {
        const updated = await updateTransaction(editingId, payload)
        setTransactions((previous) =>
          previous.map((transaction) => (transaction.id === updated.id ? updated : transaction)),
        )
      }

      setIsDialogOpen(false)
      setForm(initialForm)
    } catch (apiError) {
      if (apiError instanceof ApiError && apiError.status === 401) {
        logout()
        navigate("/login", { replace: true })
        return
      }

      setFormError(getErrorMessage(apiError, "Nao foi possivel salvar a transacao."))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Deseja realmente excluir esta transacao?")
    if (!confirmed) return

    try {
      await deleteTransaction(id)
      setTransactions((previous) => previous.filter((transaction) => transaction.id !== id))
    } catch (apiError) {
      if (apiError instanceof ApiError && apiError.status === 401) {
        logout()
        navigate("/login", { replace: true })
        return
      }
      setError(getErrorMessage(apiError, "Nao foi possivel excluir a transacao."))
    }
  }

  return (
    <PageShell>
      <section className="space-y-4 rounded-2xl border border-border/80 bg-card/95 p-4 shadow-sm md:p-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">Transacoes</h2>
            <p className="text-sm text-muted-foreground">Historico recente de entradas e saidas.</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer" onClick={openCreateDialog}>
                <Plus className="size-4" />
                Nova transacao
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId === null ? "Nova transacao" : "Editar transacao"}</DialogTitle>
                <DialogDescription>Preencha os dados para salvar.</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  placeholder="Descricao"
                  value={form.descricao}
                  onChange={(event) => setForm((prev) => ({ ...prev, descricao: event.target.value }))}
                  required
                />
                <Input
                  placeholder="Categoria"
                  value={form.categoria}
                  onChange={(event) => setForm((prev) => ({ ...prev, categoria: event.target.value }))}
                  required
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={form.tipo}
                    onChange={(event) => setForm((prev) => ({ ...prev, tipo: event.target.value as TransactionType }))}
                  >
                    <option value="SAIDA">Saida</option>
                    <option value="ENTRADA">Entrada</option>
                  </select>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Valor"
                    value={form.valor}
                    onChange={(event) => setForm((prev) => ({ ...prev, valor: event.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input
                    type="date"
                    value={form.data}
                    onChange={(event) => setForm((prev) => ({ ...prev, data: event.target.value }))}
                    required
                  />
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={form.contaId}
                    onChange={(event) => setForm((prev) => ({ ...prev, contaId: event.target.value }))}
                  >
                    <option value="">Sem conta vinculada</option>
                    {accountOptions.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  placeholder="Observacao (opcional)"
                  value={form.observacao}
                  onChange={(event) => setForm((prev) => ({ ...prev, observacao: event.target.value }))}
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-border/70 bg-background/80 p-4">
            <p className="text-sm text-muted-foreground">Entradas no mes</p>
            <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 sm:text-2xl">
              {formatCurrency(summary.entradas)}
            </p>
          </article>
          <article className="rounded-xl border border-border/70 bg-background/80 p-4">
            <p className="text-sm text-muted-foreground">Saidas no mes</p>
            <p className="text-xl font-semibold text-rose-600 dark:text-rose-400 sm:text-2xl">
              {formatCurrency(summary.saidas)}
            </p>
          </article>
          <article className="rounded-xl border border-border/70 bg-background/80 p-4">
            <p className="text-sm text-muted-foreground">Saldo de transacoes</p>
            <p className="text-xl font-semibold sm:text-2xl">{formatCurrency(summary.saldo)}</p>
          </article>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border/70 bg-background/80">
          <table className="min-w-[760px] w-full text-left">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Descricao</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Conta</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td className="px-4 py-3 text-sm text-muted-foreground" colSpan={7}>
                    Carregando transacoes...
                  </td>
                </tr>
              )}

              {!isLoading && transactions.length === 0 && (
                <tr>
                  <td className="px-4 py-3 text-sm text-muted-foreground" colSpan={7}>
                    Nenhuma transacao cadastrada.
                  </td>
                </tr>
              )}

              {!isLoading &&
                transactions.map((item) => (
                  <tr key={item.id} className="border-t border-border/60 text-sm">
                    <td className="px-4 py-3">{item.descricao}</td>
                    <td className="px-4 py-3">{item.categoria}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.nomeConta ?? "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          item.tipo === "ENTRADA"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {item.tipo === "ENTRADA" ? "Entrada" : "Saida"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(item.valor)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(item.data)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  )
}

export default Transactions
