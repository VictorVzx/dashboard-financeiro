import type { ReactNode } from "react"
import { Bell, Globe, Lock, Settings2 } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
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

function SettingsModal({ children }: SettingsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-h-[80vh] max-w-[calc(100%-1rem)] flex-col overflow-hidden border-border/70 bg-card p-0 sm:max-w-lg">
        <div className="border-b border-border/70 p-4 pr-12 sm:p-6">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Settings2 className="size-5" />
              Configuracoes
            </DialogTitle>
            <DialogDescription>
              Ajuste preferencias visuais, conta e notificacoes.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col items-start gap-3 rounded-md border border-border/70 bg-background/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-2">
                <Globe className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Tema</p>
                <p className="text-xs text-muted-foreground">Claro ou escuro</p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex flex-col items-start gap-3 rounded-md border border-border/70 bg-background/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-2">
                <Bell className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Notificacoes</p>
                <p className="text-xs text-muted-foreground">Ativas por email</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Ativado
            </span>
          </div>

          <div className="flex flex-col items-start gap-3 rounded-md border border-border/70 bg-background/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-2">
                <Lock className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Privacidade</p>
                <p className="text-xs text-muted-foreground">2FA habilitado</p>
              </div>
            </div>
            <span className="rounded-full bg-sky-500/15 px-2 py-1 text-xs font-medium text-sky-600 dark:text-sky-400">
              Seguro
            </span>
          </div>
        </div>

        <DialogFooter className="border-t border-border/70 bg-muted/40 p-4">
          <Button className="w-full cursor-pointer sm:w-auto">Salvar configuracoes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsModal
