import { NavLink } from "react-router-dom"
import {
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
} from "@/components/ui/sidebar"
import {
  PanelLeft,
  LayoutDashboard,
  Users,
  Receipt,
  PiggyBank,
  Target,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import SettingsModal from "@/components/SettingsModal"

const links = [
  { to: "/", label: "Painel", icon: LayoutDashboard },
  { to: "/contas", label: "Contas", icon: Users },
  { to: "/transacoes", label: "Transacoes", icon: Receipt },
  { to: "/orcamentos", label: "Orcamentos", icon: PiggyBank },
  { to: "/metas", label: "Metas", icon: Target },
]

function SidebarTG() {
  return (
    <>
      <Sidebar className="border-r border-sidebar-border/80 bg-sidebar/95 backdrop-blur-sm">
        <SidebarHeader className="flex items-center justify-start gap-2 border-b border-sidebar-border/80 px-4 py-4 text-lg font-semibold">
          <LayoutDashboard className="size-5" />
          Painel financeiro
        </SidebarHeader>

        <SidebarContent className="px-2 py-3">
          <SidebarGroup>
            <div className="space-y-1">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )
                  }
                >
                  <Icon className="size-4" />
                  {label}
                </NavLink>
              ))}
            </div>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border/80 p-2">
          <SettingsModal>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Settings className="size-4" />
              Configuracoes
            </button>
          </SettingsModal>
        </SidebarFooter>
      </Sidebar>

      <SidebarTrigger className="fixed top-3 left-3 z-30 cursor-pointer rounded-xl border border-border/80 bg-card/90 p-2 shadow-md backdrop-blur-sm transition hover:scale-[1.03] hover:border-foreground/30 sm:top-4 sm:left-4">
        <PanelLeft className="size-4" />
      </SidebarTrigger>
    </>
  )
}

export default SidebarTG
