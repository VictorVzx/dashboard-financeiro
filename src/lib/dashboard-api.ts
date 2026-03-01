import { ApiError, apiRequest } from "@/lib/api"
import { getAccessToken, getStoredUser, setStoredProfile, type UserProfile } from "@/lib/auth"

export type ThemePreference = "light" | "dark" | "system"
export type TransactionType = "ENTRADA" | "SAIDA"

export type SettingsPreferences = {
  themePreference: ThemePreference
  notificationsEnabled: boolean
  twoFactorEnabled: boolean
}

export type Transaction = {
  id: number
  descricao: string
  categoria: string
  tipo: TransactionType
  valor: number
  data: string
  contaId: number | null
  nomeConta: string | null
  observacao: string | null
}

export type CreateTransactionPayload = {
  descricao: string
  categoria: string
  tipo: TransactionType
  valor: number
  data: string
  contaId: number | null
  observacao: string | null
}

export type Budget = {
  id: number
  nome: string
  gastoAtual: number
  limite: number
  competencia: string
}

export type CreateBudgetPayload = {
  nome: string
  gastoAtual: number
  limite: number
  competencia: string
}

export type Goal = {
  id: number
  titulo: string
  atual: number
  alvo: number
  prazo: string
}

export type CreateGoalPayload = {
  titulo: string
  atual: number
  alvo: number
  prazo: string
}

export type DashboardOverview = {
  userName: string
  currentBalance: number
  availableBalance: number
  savedBalance: number
  monthIncome: number
  monthExpense: number
  monthNet: number
  budgetUsagePercent: number
  monthlyBalance: Array<{
    month: string
    value: number
  }>
  goals: Array<{
    id: number
    title: string
    currentAmount: number
    targetAmount: number
    progressPercent: number
    deadline: string
  }>
  activities: Array<{
    id: number
    title: string
    type: string
    amount: number
    date: string
  }>
}

type AccountOption = {
  id: number
  nome: string
}

type RawAccountOption = {
  id: number
  nome: string
}

type RawTransaction = {
  id: number
  descricao: string
  categoria: string
  tipo: TransactionType
  valor: number | string
  data: string
  contaId: number | null
  nomeConta: string | null
  observacao: string | null
}

type RawBudget = {
  id: number
  nome: string
  gastoAtual: number | string
  limite: number | string
  competencia: string
}

type RawGoal = {
  id: number
  titulo: string
  atual: number | string
  alvo: number | string
  prazo: string
}

type RawOverview = {
  userName: string
  currentBalance: number | string
  availableBalance: number | string
  savedBalance: number | string
  monthIncome: number | string
  monthExpense: number | string
  monthNet: number | string
  budgetUsagePercent: number | string
  monthlyBalance: Array<{ month: string; value: number | string }>
  goals: Array<{
    id: number
    title: string
    currentAmount: number | string
    targetAmount: number | string
    progressPercent: number | string
    deadline: string
  }>
  activities: Array<{
    id: number
    title: string
    type: string
    amount: number | string
    date: string
  }>
}

const DASHBOARD_OVERVIEW_CACHE_TTL_MS = 10 * 60_000
const ACCOUNTS_CACHE_KEY_PREFIX = "dashboard_accounts_cache_v1_"
let dashboardOverviewInFlight: Promise<DashboardOverview> | null = null

function requireToken() {
  const token = getAccessToken()
  if (!token) {
    throw new ApiError(401, "Usuário não autenticado.")
  }
  return token
}

function hasBrowserStorage() {
  return typeof window !== "undefined"
}

function getDashboardOverviewCacheKey() {
  const userId = getStoredUser()?.id
  return `dashboard_overview_cache_v1_${userId ?? "anonymous"}`
}

function getAccountsCacheKey() {
  const userId = getStoredUser()?.id
  return `${ACCOUNTS_CACHE_KEY_PREFIX}${userId ?? "anonymous"}`
}

function saveDashboardOverviewCache(overview: DashboardOverview) {
  if (!hasBrowserStorage()) return

  const payload = {
    cachedAt: Date.now(),
    data: overview,
  }

  localStorage.setItem(getDashboardOverviewCacheKey(), JSON.stringify(payload))
}

function clearDashboardOverviewCache() {
  if (!hasBrowserStorage()) return
  localStorage.removeItem(getDashboardOverviewCacheKey())
}

function clearAccountsCache() {
  if (!hasBrowserStorage()) return
  localStorage.removeItem(getAccountsCacheKey())
}

function invalidateFinanceCaches() {
  clearDashboardOverviewCache()
  clearAccountsCache()
}

export function getCachedDashboardOverview(maxAgeMs = DASHBOARD_OVERVIEW_CACHE_TTL_MS) {
  if (!hasBrowserStorage()) return null

  const raw = localStorage.getItem(getDashboardOverviewCacheKey())
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as { cachedAt?: number; data?: RawOverview }
    if (typeof parsed.cachedAt !== "number") return null
    if (Date.now() - parsed.cachedAt > maxAgeMs) return null
    if (!parsed.data) return null
    return mapOverview(parsed.data)
  } catch {
    localStorage.removeItem(getDashboardOverviewCacheKey())
    return null
  }
}

function toNumber(value: unknown) {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function mapTransaction(raw: RawTransaction): Transaction {
  return {
    id: raw.id,
    descricao: raw.descricao,
    categoria: raw.categoria,
    tipo: raw.tipo,
    valor: toNumber(raw.valor),
    data: raw.data,
    contaId: raw.contaId ?? null,
    nomeConta: raw.nomeConta ?? null,
    observacao: raw.observacao ?? null,
  }
}

function mapBudget(raw: RawBudget): Budget {
  return {
    id: raw.id,
    nome: raw.nome,
    gastoAtual: toNumber(raw.gastoAtual),
    limite: toNumber(raw.limite),
    competencia: raw.competencia,
  }
}

function mapGoal(raw: RawGoal): Goal {
  return {
    id: raw.id,
    titulo: raw.titulo,
    atual: toNumber(raw.atual),
    alvo: toNumber(raw.alvo),
    prazo: raw.prazo,
  }
}

function mapOverview(raw: RawOverview): DashboardOverview {
  return {
    userName: raw.userName,
    currentBalance: toNumber(raw.currentBalance),
    availableBalance: toNumber(raw.availableBalance),
    savedBalance: toNumber(raw.savedBalance),
    monthIncome: toNumber(raw.monthIncome),
    monthExpense: toNumber(raw.monthExpense),
    monthNet: toNumber(raw.monthNet),
    budgetUsagePercent: toNumber(raw.budgetUsagePercent),
    monthlyBalance: Array.isArray(raw.monthlyBalance)
      ? raw.monthlyBalance.map((item) => ({
          month: item.month,
          value: toNumber(item.value),
        }))
      : [],
    goals: Array.isArray(raw.goals)
      ? raw.goals.map((item) => ({
          id: item.id,
          title: item.title,
          currentAmount: toNumber(item.currentAmount),
          targetAmount: toNumber(item.targetAmount),
          progressPercent: toNumber(item.progressPercent),
          deadline: item.deadline,
        }))
      : [],
    activities: Array.isArray(raw.activities)
      ? raw.activities.map((item) => ({
          id: item.id,
          title: item.title,
          type: item.type,
          amount: toNumber(item.amount),
          date: item.date,
        }))
      : [],
  }
}

export async function getProfile() {
  const profile = await apiRequest<UserProfile>("/profile/me", {
    token: requireToken(),
  })
  setStoredProfile(profile)
  return profile
}

export async function updateProfile(payload: {
  name: string
  phone: string | null
  address: string | null
  avatarUrl: string | null
}) {
  const profile = await apiRequest<UserProfile>("/profile/me", {
    method: "PUT",
    token: requireToken(),
    body: payload,
  })
  setStoredProfile(profile)
  return profile
}

export function getSettings() {
  return apiRequest<SettingsPreferences>("/settings/me", {
    token: requireToken(),
  })
}

export function updateSettings(payload: SettingsPreferences) {
  return apiRequest<SettingsPreferences>("/settings/me", {
    method: "PUT",
    token: requireToken(),
    body: payload,
  })
}

export async function getTransactions() {
  const data = await apiRequest<RawTransaction[]>("/transactions", {
    token: requireToken(),
  })
  return data.map(mapTransaction)
}

export async function createTransaction(payload: CreateTransactionPayload) {
  const data = await apiRequest<RawTransaction>("/transactions", {
    method: "POST",
    token: requireToken(),
    body: payload,
  })
  invalidateFinanceCaches()
  return mapTransaction(data)
}

export async function updateTransaction(id: number, payload: CreateTransactionPayload) {
  const data = await apiRequest<RawTransaction>(`/transactions/${id}`, {
    method: "PUT",
    token: requireToken(),
    body: payload,
  })
  invalidateFinanceCaches()
  return mapTransaction(data)
}

export function deleteTransaction(id: number) {
  return apiRequest<void>(`/transactions/${id}`, {
    method: "DELETE",
    token: requireToken(),
  }).then(() => {
    invalidateFinanceCaches()
  })
}

export async function getBudgets() {
  const data = await apiRequest<RawBudget[]>("/budgets", {
    token: requireToken(),
  })
  return data.map(mapBudget)
}

export async function createBudget(payload: CreateBudgetPayload) {
  const data = await apiRequest<RawBudget>("/budgets", {
    method: "POST",
    token: requireToken(),
    body: payload,
  })
  return mapBudget(data)
}

export async function updateBudget(id: number, payload: CreateBudgetPayload) {
  const data = await apiRequest<RawBudget>(`/budgets/${id}`, {
    method: "PUT",
    token: requireToken(),
    body: payload,
  })
  return mapBudget(data)
}

export function deleteBudget(id: number) {
  return apiRequest<void>(`/budgets/${id}`, {
    method: "DELETE",
    token: requireToken(),
  })
}

export async function getGoals() {
  const data = await apiRequest<RawGoal[]>("/goals", {
    token: requireToken(),
  })
  return data.map(mapGoal)
}

export async function createGoal(payload: CreateGoalPayload) {
  const data = await apiRequest<RawGoal>("/goals", {
    method: "POST",
    token: requireToken(),
    body: payload,
  })
  return mapGoal(data)
}

export async function updateGoal(id: number, payload: CreateGoalPayload) {
  const data = await apiRequest<RawGoal>(`/goals/${id}`, {
    method: "PUT",
    token: requireToken(),
    body: payload,
  })
  return mapGoal(data)
}

export function deleteGoal(id: number) {
  return apiRequest<void>(`/goals/${id}`, {
    method: "DELETE",
    token: requireToken(),
  })
}

export async function getDashboardOverview() {
  if (!dashboardOverviewInFlight) {
    dashboardOverviewInFlight = apiRequest<RawOverview>("/dashboard/overview", {
      token: requireToken(),
    })
      .then((data) => {
        const mapped = mapOverview(data)
        saveDashboardOverviewCache(mapped)
        return mapped
      })
      .finally(() => {
        dashboardOverviewInFlight = null
      })
  }

  return dashboardOverviewInFlight
}

export async function getAccountOptions() {
  const data = await apiRequest<RawAccountOption[]>("/accounts", {
    token: requireToken(),
  })

  return data.map((account): AccountOption => ({
    id: account.id,
    nome: account.nome,
  }))
}
