import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarGroup } from "@/components/ui/sidebar"
import { PanelLeft } from "lucide-react"

function SidebarTG(){
  return (
    <div>
        <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="font-bold px-4 py-2 text-xl flex items-left justify-center">
            Olá, user!
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              {/* Add your menu items here */
                <div>
                  <p className="px-4 py-2 hover:bg-accent rounded-md cursor-pointer">Dashboard</p>
                </div>
              }
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter />
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