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
              {/* Add your menu items here */
                <div>
                  <p className="px-4 py-2 hover:bg-accent rounded-md cursor-pointer flex items-center gap-2"><LayoutDashboard className="size-4" /> Dashboard</p>
                  <p className="px-4 py-2 hover:bg-accent rounded-md cursor-pointer flex items-center gap-2"><Users className="size-4" /> Accounts</p>
                  <p className="px-4 py-2 hover:bg-accent rounded-md cursor-pointer flex items-center gap-2"><Receipt className="size-4" /> Transactions</p>
                  <p className="px-4 py-2 hover:bg-accent rounded-md cursor-pointer flex items-center gap-2"><PiggyBank className="size-4" /> Budgets</p>
                  <p className="px-4 py-2 hover:bg-accent rounded-md cursor-pointer flex items-center gap-2"><Target className="size-4" /> Goals</p>
                </div>
                
              }
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <p className="px-4 py-2 hover:bg-accent rounded-md cursor-pointer flex items-center gap-2"><Settings className="size-4" /> Configurações</p>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 p-4">
          <SidebarTrigger className="cursor-pointer">
            <PanelLeft className="size-4" />
          </SidebarTrigger>
        </main>
      </SidebarProvider>
    </div>
  )
}

export default SidebarTG;