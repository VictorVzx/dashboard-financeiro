import { useState, type ReactNode } from "react"
import { Bell, Globe, Lock, Settings2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/api"
import {
  getSettings,
  updateSettings,
  type SettingsPreferences,
  type ThemePreference,
} from "@/lib/dashboard-api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type SettingsModalProps = {
  children: ReactNode
}

const defaultSettings: SettingsPreferences = {
  themePreference: "system",
  notificationsEnabled: true,
  twoFactorEnabled: false,
}

function applyThemePreference(themePreference: ThemePreference) {
  const root = document.documentElement
  if (themePreference === "system") {
    localStorage.removeItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    root.classList.toggle("dark", prefersDark)
    return
  }

  localStorage.setItem("theme", themePreference)
  root.classList.toggle("dark", themePreference === "dark")
}

function SettingsModal({ children }: SettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<SettingsPreferences>(defaultSettings)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const loadSettings = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await getSettings()
      setSettings(response)
    } catch (apiError) {
      setError(getErrorMessage(apiError, "Nao foi possivel carregar as configuracoes."))
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setIsOpen(nextOpen)
    if (nextOpen) {
      void loadSettings()
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const updated = await updateSettings(settings)
      setSettings(updated)
      applyThemePreference(updated.themePreference)
      setSuccess("Configuracoes salvas com sucesso.")
    } catch (apiError) {
      setError(getErrorMessage(apiError, "Nao foi possivel salvar as configuracoes."))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-h-[80vh] max-w-[calc(100%-1rem)] flex-col overflow-hidden border-border/70 bg-card p-0 sm:max-w-lg">
        <div className="border-b border-border/70 p-4 pr-12 sm:p-6">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Settings2 className="size-5" />
              Configuracoes
            </DialogTitle>
            <DialogDescription>Ajuste preferencias visuais, notificacoes e seguranca.</DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col gap-3 rounded-md border border-border/70 bg-background/70 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-2">
                <Globe className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Tema</p>
                <p className="text-xs text-muted-foreground">Escolha claro, escuro ou sistema.</p>
              </div>
            </div>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={settings.themePreference}
              disabled={isLoading || isSaving}
              onChange={(event) =>
                setSettings((previous) => ({
                  ...previous,
                  themePreference: event.target.value as ThemePreference,
                }))
              }
            >
              <option value="system">Sistema</option>
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
            </select>
          </div>

          <label className="flex cursor-pointer items-center justify-between rounded-md border border-border/70 bg-background/70 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-2">
                <Bell className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Notificacoes por email</p>
                <p className="text-xs text-muted-foreground">Receba alertas e resumos mensais.</p>
              </div>
            </div>
            <input
              type="checkbox"
              className="size-4"
              checked={settings.notificationsEnabled}
              disabled={isLoading || isSaving}
              onChange={(event) =>
                setSettings((previous) => ({
                  ...previous,
                  notificationsEnabled: event.target.checked,
                }))
              }
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-md border border-border/70 bg-background/70 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-2">
                <Lock className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Autenticacao em dois fatores</p>
                <p className="text-xs text-muted-foreground">Adicione uma camada extra de seguranca.</p>
              </div>
            </div>
            <input
              type="checkbox"
              className="size-4"
              checked={settings.twoFactorEnabled}
              disabled={isLoading || isSaving}
              onChange={(event) =>
                setSettings((previous) => ({
                  ...previous,
                  twoFactorEnabled: event.target.checked,
                }))
              }
            />
          </label>

          {error && <p className="text-xs text-destructive">{error}</p>}
          {success && <p className="text-xs text-emerald-600">{success}</p>}
        </div>

        <DialogFooter className="border-t border-border/70 bg-muted/40 p-4">
          <Button className="w-full cursor-pointer sm:w-auto" onClick={handleSave} disabled={isSaving || isLoading}>
            <Save className="size-4" />
            {isSaving ? "Salvando..." : "Salvar configuracoes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsModal
