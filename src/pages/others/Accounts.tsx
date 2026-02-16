import SidebarTG from "@/components/SidebarTG"
import Navigation from "@/components/Navigation"
import Corrente from "@/components/Accounts/Corrente"
import CreditCard from "@/components/Accounts/CreditCard"
import Poupanca from "@/components/Accounts/Poupanca"
import { Button } from "@/components/ui/button"

function Accounts() {
  return (
    <div className="h-screen w-screen flex">
      <div className="flex h-full">
        <SidebarTG />
      </div>
      
      <div className="flex-1 flex flex-col h-full bg-gray-100 dark:bg-black overflow-y-auto">
        <div className="w-full h-full">
          <div className="sticky top-0 z-10">
            <Navigation />
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Corrente />
            <Poupanca />
            <CreditCard />
          </div>
          <div className="pl-10">
            <Button className="bg-black border-gray-500 border cursor-pointer text-white hover:bg-background">+ Adicionar Conta</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Accounts;