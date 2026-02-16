import SidebarTG from "@/components/SidebarTG"
import Navigation from "@/components/Navigation"
import Balance from "@/components/MainPage/Balance"
import Upcomings from "@/components/MainPage/Upcomings"
import Spent from "@/components/MainPage/Spent"

function Home() {

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
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
