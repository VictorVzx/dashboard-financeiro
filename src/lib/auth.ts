import { ApiError, apiRequest } from "@/lib/api"

const AUTH_TOKEN_STORAGE_KEY = "auth_access_token"
const AUTH_USER_STORAGE_KEY = "auth_user"
const PROFILE_STORAGE_KEY = "auth_profile"

const AUTH_UPDATED_EVENT = "dashboard-auth-updated"
const PROFILE_UPDATED_EVENT = "dashboard-profile-updated"

export type AuthUser = {
  id: number
  name: string
  email: string
}

export type UserProfile = {
  id: number
  name: string
  email: string
  birthdate: string
  cpf: string
  phone: string | null
  address: string | null
  avatarUrl: string | null
  role: string
  plan: string
}

type AuthResponse = {
  accessToken: string
  user: AuthUser
}

type LoginRequest = {
  email: string
  password: string
}

type RegisterRequest = {
  name: string
  email: string
  birthdate: string
  cpf: string
  password: string
}

type ForgotPasswordRequest = {
  email: string
}

type ForgotPasswordResponse = {
  message: string
}

type ResetPasswordRequest = {
  email: string
  code: string
  newPassword: string
}

type MessageResponse = {
  message: string
}

function hasBrowserStorage() {
  return typeof window !== "undefined"
}

function emitEvent(eventName: string) {
  if (!hasBrowserStorage()) return
  window.dispatchEvent(new Event(eventName))
}

function persistAuth(response: AuthResponse) {
  if (!hasBrowserStorage()) return

  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.accessToken)
  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(response.user))
  localStorage.removeItem(PROFILE_STORAGE_KEY)
  emitEvent(AUTH_UPDATED_EVENT)
  emitEvent(PROFILE_UPDATED_EVENT)
}

export function getAccessToken() {
  if (!hasBrowserStorage()) return null

  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  return token && token.trim().length > 0 ? token : null
}

export function getStoredUser(): AuthUser | null {
  if (!hasBrowserStorage()) return null

  const rawUser = localStorage.getItem(AUTH_USER_STORAGE_KEY)
  if (!rawUser) return null

  try {
    const parsedUser = JSON.parse(rawUser) as Partial<AuthUser>
    if (
      typeof parsedUser.id === "number" &&
      typeof parsedUser.name === "string" &&
      typeof parsedUser.email === "string"
    ) {
      return {
        id: parsedUser.id,
        name: parsedUser.name,
        email: parsedUser.email,
      }
    }
  } catch {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY)
  }

  return null
}

export function getStoredProfile(): UserProfile | null {
  if (!hasBrowserStorage()) return null

  const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as UserProfile
  } catch {
    localStorage.removeItem(PROFILE_STORAGE_KEY)
    return null
  }
}

export function setStoredProfile(profile: UserProfile) {
  if (!hasBrowserStorage()) return

  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
  localStorage.setItem(
    AUTH_USER_STORAGE_KEY,
    JSON.stringify({
      id: profile.id,
      name: profile.name,
      email: profile.email,
    } satisfies AuthUser),
  )
  emitEvent(PROFILE_UPDATED_EVENT)
  emitEvent(AUTH_UPDATED_EVENT)
}

export function isAuthenticated() {
  return getAccessToken() !== null
}

export function setAuthenticated(isLoggedIn: boolean) {
  if (isLoggedIn) return
  logout()
}

export function logout() {
  if (!hasBrowserStorage()) return

  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
  localStorage.removeItem(AUTH_USER_STORAGE_KEY)
  localStorage.removeItem(PROFILE_STORAGE_KEY)
  emitEvent(AUTH_UPDATED_EVENT)
  emitEvent(PROFILE_UPDATED_EVENT)
}

export async function login(payload: LoginRequest): Promise<AuthUser> {
  const response = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  })

  persistAuth(response)
  return response.user
}

export async function register(payload: RegisterRequest): Promise<AuthUser> {
  const user = await apiRequest<AuthUser>("/auth/register", {
    method: "POST",
    body: payload,
  })
  return user
}

export async function fetchCurrentUser() {
  const token = getAccessToken()
  if (!token) {
    throw new ApiError(401, "Usuário não autenticado.")
  }

  const user = await apiRequest<AuthUser>("/auth/me", { token })
  if (hasBrowserStorage()) {
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user))
    emitEvent(AUTH_UPDATED_EVENT)
  }
  return user
}

export async function requestPasswordReset(payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  return apiRequest<ForgotPasswordResponse>("/auth/forgot-password/request", {
    method: "POST",
    body: payload,
  })
}

export async function resetPassword(payload: ResetPasswordRequest): Promise<MessageResponse> {
  return apiRequest<MessageResponse>("/auth/forgot-password/reset", {
    method: "POST",
    body: payload,
  })
}

export function onAuthUpdated(listener: () => void) {
  if (!hasBrowserStorage()) return () => {}

  const handler = () => listener()
  window.addEventListener(AUTH_UPDATED_EVENT, handler)
  return () => window.removeEventListener(AUTH_UPDATED_EVENT, handler)
}

export function onProfileUpdated(listener: () => void) {
  if (!hasBrowserStorage()) return () => {}

  const handler = () => listener()
  window.addEventListener(PROFILE_UPDATED_EVENT, handler)
  return () => window.removeEventListener(PROFILE_UPDATED_EVENT, handler)
}
