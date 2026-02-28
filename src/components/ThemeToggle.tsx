import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { applyThemePreference, getStoredThemePreference } from "@/lib/theme"

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = getStoredThemePreference()
    if (storedTheme === "dark") return true
    if (storedTheme === "light") return false
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  useEffect(() => {
    applyThemePreference(isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode((previous) => !previous)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="cursor-pointer"
      title="Alternar tema"
      aria-label="Alternar tema"
    >
      {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}
