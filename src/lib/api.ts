function getDefaultApiBaseUrl() {
  if (typeof window === "undefined") {
    return "http://localhost:8080"
  }

  const host = window.location.hostname.trim()
  if (host.length === 0) {
    return "http://localhost:8080"
  }

  return `${window.location.protocol}//${host}:8080`
}

const DEFAULT_API_BASE_URL = getDefaultApiBaseUrl()

const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim()
const API_BASE_URL = (configuredBaseUrl && configuredBaseUrl.length > 0
  ? configuredBaseUrl
  : DEFAULT_API_BASE_URL
).replace(/\/+$/, "")

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
  token?: string | null
}

type ErrorDetails = Record<string, unknown> | string | null

export class ApiError extends Error {
  status: number
  details: ErrorDetails

  constructor(status: number, message: string, details: ErrorDetails = null) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function extractStringField(record: Record<string, unknown>, key: string): string | null {
  const value = record[key]
  if (typeof value !== "string") return null

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function extractValidationMessage(record: Record<string, unknown>): string | null {
  const errors = record.errors
  if (!Array.isArray(errors) || errors.length === 0) return null

  const firstError = errors[0]
  if (!isRecord(firstError)) return null

  return (
    extractStringField(firstError, "defaultMessage") ||
    extractStringField(firstError, "message") ||
    null
  )
}

function getErrorMessageFromPayload(payload: unknown, fallback: string): string {
  if (typeof payload === "string") {
    const trimmed = payload.trim()
    if (trimmed.length > 0) return trimmed
  }

  if (isRecord(payload)) {
    const knownFields = ["message", "error", "detail", "title"]
    for (const field of knownFields) {
      const message = extractStringField(payload, field)
      if (message) return message
    }

    const validationMessage = extractValidationMessage(payload)
    if (validationMessage) return validationMessage
  }

  return fallback
}

function resolvePath(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, token, headers: customHeaders, ...rest } = options
  const headers = new Headers(customHeaders)

  if (body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(resolvePath(path), {
    ...rest,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const contentType = response.headers.get("content-type") || ""
  const isJson = contentType.includes("application/json")

  let payload: unknown = null
  if (response.status !== 204) {
    payload = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null)
  }

  if (!response.ok) {
    const fallbackMessage = response.statusText || "Erro na requisicao"
    const message = getErrorMessageFromPayload(payload, fallbackMessage)
    const details = typeof payload === "string" || isRecord(payload) ? payload : null
    throw new ApiError(response.status, message, details)
  }

  return payload as T
}

export function getErrorMessage(error: unknown, fallback = "Nao foi possivel completar a operacao."): string {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error) {
    const message = error.message.trim()
    if (message.length > 0) return message
  }

  return fallback
}
