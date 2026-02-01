import SidebarTG from "@/components/SidebarTG"
import Navigation from "@/components/Navigation"

function Home() {

  return (
    <div className="h-screen w-screen flex">
      <div className="flex h-full">
        <SidebarTG />
      </div>
      <div className="w-full h-full">
        <div className="sticky top-0 z-10">
          <Navigation />
        </div>
        <div className="flex-1 h-full w-full bg-gray-100 p-4">
          {/* Main content goes here */}
        </div>
      </div>
    </div>
  )
}

export default Home
