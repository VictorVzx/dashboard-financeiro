import type { ReactNode } from "react"
import SidebarTG from "@/components/SidebarTG"
import Navigation from "@/components/Navigation"
import { SidebarProvider } from "@/components/ui/sidebar"

type PageShellProps = {
  children: ReactNode
}

function PageShell({ children }: PageShellProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <div className="flex h-full">
          <SidebarTG />
        </div>

        <div className="flex min-h-screen flex-1 flex-col overflow-y-auto bg-background">
          <div className="h-full w-full">
            <Navigation />
            <div className="relative p-4 pt-[4.5rem] sm:p-5 sm:pt-20 md:p-6 md:pt-24">
              <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle,_var(--border)_1px,_transparent_1px)] [background-size:16px_16px]" />
              <div className="relative">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default PageShell
