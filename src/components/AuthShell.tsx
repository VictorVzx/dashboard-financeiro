import type { ReactNode } from "react"
import { ThemeToggle } from "@/components/ThemeToggle"

type AuthShellProps = {
  title: string
  subtitle: string
  children: ReactNode
}

function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8">
      <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle,_var(--border)_1px,_transparent_1px)] [background-size:18px_18px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-muted/50 via-transparent to-transparent dark:from-muted/20" />

      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border/80 bg-card/95 p-6 shadow-xl sm:p-8">
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  )
}

export default AuthShell
