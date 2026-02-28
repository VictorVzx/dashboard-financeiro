import { useEffect, useMemo, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import PageShell from "@/components/PageShell"
import { Landmark, CreditCard, PiggyBank, Plus, ArrowUpRight, ArrowDownLeft, Pencil, Trash2 } from "lucide-react"
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
import { ApiError, apiRequest, getErrorMessage } from "@/lib/api"
import { getAccessToken, getStoredUser, logout } from "@/lib/auth"

type AccountType = "corrente" | "poupanca" | "cartao"
type BackendAccountType = "CORRENTE" | "POUPANCA" | "CARTAO"

type BackendAccount = {
  id: number
  tipo: BackendAccountType
  nome: string
  banco: string
  finalConta: string
  saldoAtual: number | string
  limiteCartao: number | string | null
}

type CreateBackendAccountRequest = {
  tipo: BackendAccountType
  nome: string
  banco: string
  finalConta: string
  saldoInicial: number
  limiteCartao: number | null
}

type UpdateBackendAccountRequest = {
  tipo: BackendAccountType
  nome: string
  banco: string
  finalConta: string
  saldoAtual: number
  limiteCartao: number | null
}

type Account = {
  id: number
  nome: string
  banco: string
  final: string
  saldo: number
  entradas: number
  saidas: number
  tipo: AccountType
  limite?: number
}

type NewAccountForm = {
  tipo: AccountType
  nome: string
  banco: string
  final: string
  saldoInicial: string
  limite: string
}

const ACCOUNTS_CACHE_TTL_MS = 30 * 60_000
let accountsInFlight: Promise<BackendAccount[]> | null = null

const accountTypeToBackend: Record<AccountType, BackendAccountType> = {
  corrente: "CORRENTE",
  poupanca: "POUPANCA",
  cartao: "CARTAO",
}

const accountTypeFromBackend: Record<BackendAccountType, AccountType> = {
  CORRENTE: "corrente",
  POUPANCA: "poupanca",
  CARTAO: "cartao",
}

const initialForm: NewAccountForm = {
  tipo: "corrente",
  nome: "",
  banco: "",
  final: "",
  saldoInicial: "",
  limite: "",
}

function contaIcon(tipo: AccountType) {
  if (tipo === "poupanca") return PiggyBank
  if (tipo === "cartao") return CreditCard
  return Landmark
}

function parseCurrencyValue(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(",", "."))
    return Number.isFinite(parsed) ? parsed : 0
  }

  return 0
}

function mapBackendAccountToView(account: BackendAccount): Account {
  const tipo = accountTypeFromBackend[account.tipo]
  const saldo = parseCurrencyValue(account.saldoAtual)
  const limite = account.limiteCartao == null ? undefined : parseCurrencyValue(account.limiteCartao)

  return {
    id: account.id,
    nome: account.nome,
    banco: account.banco,
    final: account.finalConta,
    saldo,
    entradas: tipo === "cartao" ? 0 : saldo,
    saidas: tipo === "cartao" ? saldo : 0,
    tipo,
    limite,
  }
}

function hasBrowserStorage() {
  return typeof window !== "undefined"
}

function getAccountsCacheKey() {
  const userId = getStoredUser()?.id
  return `dashboard_accounts_cache_v1_${userId ?? "anonymous"}`
}

function extractAccountsPayload(payload: unknown): BackendAccount[] {
  if (Array.isArray(payload)) {
    return payload as BackendAccount[]
  }

  if (payload && typeof payload === "object") {
    const record = payload as {
      data?: unknown
      content?: unknown
      accounts?: unknown
    }

    if (Array.isArray(record.data)) return record.data as BackendAccount[]
    if (Array.isArray(record.content)) return record.content as BackendAccount[]
    if (Array.isArray(record.accounts)) return record.accounts as BackendAccount[]
  }

  throw new Error("Formato de resposta invalido ao carregar as contas.")
}

function readCachedAccounts(maxAgeMs = ACCOUNTS_CACHE_TTL_MS): Account[] {
  if (!hasBrowserStorage()) return []

  const raw = localStorage.getItem(getAccountsCacheKey())
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw) as { cachedAt?: number; data?: Account[] }
    if (!Array.isArray(parsed.data)) return []
    if (typeof parsed.cachedAt !== "number") return []
    if (Date.now() - parsed.cachedAt > maxAgeMs) return []
    return parsed.data
  } catch {
    localStorage.removeItem(getAccountsCacheKey())
    return []
  }
}

function writeCachedAccounts(accounts: Account[]) {
  if (!hasBrowserStorage()) return

  localStorage.setItem(
    getAccountsCacheKey(),
    JSON.stringify({
      cachedAt: Date.now(),
      data: accounts,
    }),
  )
}

async function fetchAccounts(token: string) {
  if (!accountsInFlight) {
    accountsInFlight = apiRequest<unknown>("/accounts", { token })
      .then(extractAccountsPayload)
      .finally(() => {
        accountsInFlight = null
      })
  }

  return accountsInFlight
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function Accounts() {
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState<Account[]>(() => readCachedAccounts())
  const [isLoading, setIsLoading] = useState(() => readCachedAccounts().length === 0)
  const [loadError, setLoadError] = useState("")
  const [formData, setFormData] = useState<NewAccountForm>(initialForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")

  const summary = useMemo(() => {
    const saldoTotal = accounts.reduce((acc, account) => {
      if (account.tipo === "cartao") return acc
      return acc + account.saldo
    }, 0)

    const entradasPrevistas = accounts.reduce((acc, account) => acc + account.entradas, 0)
    const saidasPrevistas = accounts.reduce((acc, account) => acc + account.saidas, 0)

    return { saldoTotal, entradasPrevistas, saidasPrevistas }
  }, [accounts])

  useEffect(() => {
    let isActive = true

    const loadAccounts = async () => {
      const token = getAccessToken()
      if (!token) {
        logout()
        navigate("/login", { replace: true })
        return
      }

      const hasCachedAccounts = readCachedAccounts().length > 0
      if (!hasCachedAccounts) {
        setIsLoading(true)
      }

      try {
        const response = await fetchAccounts(token)
        if (!isActive) return

        const mapped = response.map(mapBackendAccountToView)
        setAccounts(mapped)
        writeCachedAccounts(mapped)
        setLoadError("")
      } catch (apiError) {
        if (!isActive) return

        if (apiError instanceof ApiError && apiError.status === 401) {
          logout()
          navigate("/login", { replace: true })
          return
        }

        setLoadError(getErrorMessage(apiError, "Nao foi possivel carregar as contas."))
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadAccounts()

    return () => {
      isActive = false
    }
  }, [navigate])

  const handleChange = (field: keyof NewAccountForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const openCreateModal = () => {
    setEditingId(null)
    setFormData(initialForm)
    setFormError("")
    setIsModalOpen(true)
  }

  const openEditModal = (account: Account) => {
    setEditingId(account.id)
    setFormData({
      tipo: account.tipo,
      nome: account.nome,
      banco: account.banco,
      final: account.final,
      saldoInicial: String(account.saldo),
      limite: account.limite ? String(account.limite) : "",
    })
    setFormError("")
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError("")

    const finalDigits = formData.final.replace(/\D/g, "").slice(0, 4)
    if (finalDigits.length !== 4) {
      setFormError("Informe os 4 digitos finais da conta.")
      return
    }

    const saldoInicial = Number(formData.saldoInicial.replace(",", "."))
    if (Number.isNaN(saldoInicial) || saldoInicial < 0) {
      setFormError("Informe um saldo inicial valido.")
      return
    }

    let limiteCartao: number | null = null
    if (formData.tipo === "cartao") {
      const limitValue = Number(formData.limite.replace(",", "."))
      if (Number.isNaN(limitValue) || limitValue <= 0) {
        setFormError("Para cartao, informe um limite valido maior que zero.")
        return
      }
      limiteCartao = limitValue
    }

    const token = getAccessToken()
    if (!token) {
      logout()
      navigate("/login", { replace: true })
      return
    }

    const payload: CreateBackendAccountRequest = {
      tipo: accountTypeToBackend[formData.tipo],
      nome: formData.nome.trim(),
      banco: formData.banco.trim(),
      finalConta: finalDigits,
      saldoInicial,
      limiteCartao,
    }

    setIsSubmitting(true)

    try {
      if (editingId === null) {
        const created = await apiRequest<BackendAccount>("/accounts", {
          method: "POST",
          token,
          body: payload,
        })
        setAccounts((prev) => {
          const next = [mapBackendAccountToView(created), ...prev]
          writeCachedAccounts(next)
          return next
        })
      } else {
        const updatePayload: UpdateBackendAccountRequest = {
          tipo: payload.tipo,
          nome: payload.nome,
          banco: payload.banco,
          finalConta: payload.finalConta,
          saldoAtual: payload.saldoInicial,
          limiteCartao: payload.limiteCartao,
        }
        const updated = await apiRequest<BackendAccount>(`/accounts/${editingId}`, {
          method: "PUT",
          token,
          body: updatePayload,
        })
        setAccounts((prev) => {
          const next = prev.map((item) => (item.id === updated.id ? mapBackendAccountToView(updated) : item))
          writeCachedAccounts(next)
          return next
        })
      }

      setFormData(initialForm)
      setEditingId(null)
      setIsModalOpen(false)
      setLoadError("")
    } catch (apiError) {
      if (apiError instanceof ApiError && apiError.status === 401) {
        logout()
        navigate("/login", { replace: true })
        return
      }

      setFormError(getErrorMessage(apiError, "Nao foi possivel salvar a conta."))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (accountId: number) => {
    const confirmed = window.confirm("Deseja realmente excluir esta conta?")
    if (!confirmed) return

    const token = getAccessToken()
    if (!token) {
      logout()
      navigate("/login", { replace: true })
      return
    }

    try {
      await apiRequest<void>(`/accounts/${accountId}`, {
        method: "DELETE",
        token,
      })
      setAccounts((prev) => {
        const next = prev.filter((account) => account.id !== accountId)
        writeCachedAccounts(next)
        return next
      })
    } catch (apiError) {
      if (apiError instanceof ApiError && apiError.status === 401) {
        logout()
        navigate("/login", { replace: true })
        return
      }

      setLoadError(getErrorMessage(apiError, "Nao foi possivel excluir a conta."))
    }
  }

  return (
    <PageShell>
      <section className="space-y-4 rounded-2xl border border-border/80 bg-card/95 p-4 shadow-sm md:p-6">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">Contas</h2>
            <p className="text-sm text-muted-foreground">
              Visualize e gerencie todas as suas contas em um unico lugar.
            </p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full cursor-pointer sm:w-auto" onClick={openCreateModal}>
                <Plus className="size-4" />
                Adicionar conta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[calc(100%-1rem)] border-border/70 bg-card sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingId === null ? "Adicionar conta" : "Editar conta"}</DialogTitle>
                <DialogDescription>
                  Preencha os dados abaixo para {editingId === null ? "criar" : "atualizar"} a conta.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="account-type">
                    Tipo de conta
                  </label>
                  <select
                    id="account-type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.tipo}
                    onChange={(e) => handleChange("tipo", e.target.value as AccountType)}
                    required
                  >
                    <option value="corrente">Conta corrente</option>
                    <option value="poupanca">Conta poupanca</option>
                    <option value="cartao">Cartao de credito</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="account-name">
                    Nome da conta
                  </label>
                  <Input
                    id="account-name"
                    placeholder="Ex: Conta principal"
                    value={formData.nome}
                    onChange={(e) => handleChange("nome", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="account-bank">
                      Banco
                    </label>
                    <Input
                      id="account-bank"
                      placeholder="Ex: Banco Inter"
                      value={formData.banco}
                      onChange={(e) => handleChange("banco", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="account-final">
                      Final da conta
                    </label>
                    <Input
                      id="account-final"
                      placeholder="1234"
                      value={formData.final}
                      onChange={(e) => handleChange("final", e.target.value)}
                      inputMode="numeric"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="account-balance">
                      Saldo inicial
                    </label>
                    <Input
                      id="account-balance"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      value={formData.saldoInicial}
                      onChange={(e) => handleChange("saldoInicial", e.target.value)}
                      required
                    />
                  </div>

                  {formData.tipo === "cartao" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="account-limit">
                        Limite do cartao
                      </label>
                      <Input
                        id="account-limit"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="1000,00"
                        value={formData.limite}
                        onChange={(e) => handleChange("limite", e.target.value)}
                        required
                      />
                    </div>
                  )}
                </div>

                {formError && <p className="text-xs text-destructive">{formError}</p>}

                <DialogFooter>
                  <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : editingId === null ? "Salvar conta" : "Atualizar conta"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        {loadError && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {loadError}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-border/70 bg-background/80 p-4">
            <p className="text-sm text-muted-foreground">Saldo total</p>
            <p className="text-xl font-semibold sm:text-2xl">{formatCurrency(summary.saldoTotal)}</p>
          </article>
          <article className="rounded-xl border border-border/70 bg-background/80 p-4">
            <p className="text-sm text-muted-foreground">Entradas previstas</p>
            <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 sm:text-2xl">
              {formatCurrency(summary.entradasPrevistas)}
            </p>
          </article>
          <article className="rounded-xl border border-border/70 bg-background/80 p-4">
            <p className="text-sm text-muted-foreground">Saidas previstas</p>
            <p className="text-xl font-semibold text-rose-600 dark:text-rose-400 sm:text-2xl">
              {formatCurrency(summary.saidasPrevistas)}
            </p>
          </article>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {isLoading && (
            <article className="rounded-xl border border-border/70 bg-background/80 p-4">
              <p className="text-sm text-muted-foreground">Carregando contas...</p>
            </article>
          )}

          {!isLoading && accounts.length === 0 && (
            <article className="rounded-xl border border-border/70 bg-background/80 p-4">
              <p className="text-sm text-muted-foreground">
                Nenhuma conta cadastrada ainda. Adicione uma conta para comecar.
              </p>
            </article>
          )}

          {!isLoading &&
            accounts.map((account) => {
              const Icon = contaIcon(account.tipo)
              const isCartao = account.tipo === "cartao"
              const usoDoLimite =
                isCartao && account.limite
                  ? Math.min(Math.round((account.saldo / account.limite) * 100), 999)
                  : 0

              return (
                <article key={account.id} className="rounded-xl border border-border/70 bg-background/80 p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-md bg-muted p-2">
                        <Icon className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">{account.nome}</h3>
                        <p className="text-xs text-muted-foreground">
                          {account.banco} - final {account.final}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        isCartao
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {isCartao ? "Atencao" : "Saudavel"}
                    </span>
                  </div>

                  <p className="text-2xl font-semibold">{formatCurrency(account.saldo)}</p>
                  <p
                    className={`mt-1 text-sm ${
                      isCartao ? "text-amber-600 dark:text-amber-400" : "text-sky-600 dark:text-sky-400"
                    }`}
                  >
                    {isCartao ? `${usoDoLimite}% do limite` : "+0% no mes"}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-md border border-border/70 bg-card/60 p-2">
                      <p className="mb-1 text-muted-foreground">Entradas</p>
                      <p className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                        <ArrowDownLeft className="size-3.5" />
                        {formatCurrency(account.entradas)}
                      </p>
                    </div>
                    <div className="rounded-md border border-border/70 bg-card/60 p-2">
                      <p className="mb-1 text-muted-foreground">Saidas</p>
                      <p className="inline-flex items-center gap-1 font-medium text-rose-600 dark:text-rose-400">
                        <ArrowUpRight className="size-3.5" />
                        {formatCurrency(account.saidas)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(account)}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(account.id)}>
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

export default Accounts
