import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarGroup } from "@/components/ui/sidebar"
import { PanelLeft, LayoutDashboard, Users, Receipt, PiggyBank, Target, Settings } from "lucide-react"

function SidebarTG(){
  return (
    <div>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="font-bold px-4 py-2 text-xl flex items-center justify-start gap-2">
            <LayoutDashboard className="size-5" />
            Dashboard
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
                <div>
                  <a href="/">
                    <p className="px-4 py-2 hover:bg-accent rounded-md cursor-pointer flex items-center gap-2"><LayoutDashboard className="size-4" /> Dashboard</p>
                  </a>
                  <a href="#">
                    <p className="px-4 py-2 hover:bg-accent rounded-md cursor-pointer flex items-center gap-2"><Users className="size-4" /> Accounts</p>
                  </a>
                  <a href="#">
                    <p className="px-4 py-2 hover:bg-accent rounded-md cursor-pointer flex items-center gap-2"><Receipt className="size-4" /> Transactions</p>
                  </a>
                  <a href="#">
                    <p className="px-4 py-2 hover:bg-accent rounded-md cursor-pointer flex items-center gap-2"><PiggyBank className="size-4" /> Budgets</p>
                  </a>
                  <a href="#">
                    <p className="px-4 py-2 hover:bg-accent rounded-md cursor-pointer flex items-center gap-2"><Target className="size-4" /> Goals</p>
                  </a>
                </div>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <a href="#">
              <p className="px-4 py-2 hover:bg-accent rounded-md cursor-pointer flex items-center gap-2"><Settings className="size-4" /> Configurações</p>
            </a>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 p-4">
          <SidebarTrigger className="fixed top-4 left-4 z-20 cursor-pointer">
            <PanelLeft className="size-4" />
          </SidebarTrigger>
        </main>
      </SidebarProvider>
    </div>
  )
}

export default SidebarTG;