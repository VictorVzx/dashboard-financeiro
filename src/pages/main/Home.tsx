import SidebarTG from "@/components/SidebarTG"
import Navigation from "@/components/Navigation"
import Balance from "@/components/Balance"
import Upcomings from "@/components/Upcomings"
import Spent from "@/components/Spent"

function Home() {

  return (
    <div className="h-screen w-screen flex">
      <div className="flex h-full">
        <SidebarTG />
      </div>
      
      <div className="flex-1 flex flex-col h-full bg-gray-100 overflow-y-auto">
        <div className="w-full h-full">
          <div className="sticky top-0 z-10">
            <Navigation />
          </div>
          <div className="flex-1 p-6 flex justify-center flex-row gap-4">
            <Balance />
            <Upcomings />
            <Spent />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
