export type ThemePreference = "light" | "dark" | "system"

const THEME_STORAGE_KEY = "theme"

function hasBrowserStorage() {
  return typeof window !== "undefined"
}

export function getStoredThemePreference(): ThemePreference {
  if (!hasBrowserStorage()) return "system"

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme
  }

  return "system"
}

export function applyThemePreference(themePreference: ThemePreference) {
  if (!hasBrowserStorage()) return

  const root = document.documentElement

  if (themePreference === "system") {
    localStorage.removeItem(THEME_STORAGE_KEY)
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    root.classList.toggle("dark", prefersDark)
    return
  }

  localStorage.setItem(THEME_STORAGE_KEY, themePreference)
  root.classList.toggle("dark", themePreference === "dark")
}

export function initializeTheme() {
  applyThemePreference(getStoredThemePreference())
}
