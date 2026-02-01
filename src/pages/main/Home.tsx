import SidebarTG from "@/components/SidebarTG"
import Navigation from "@/components/Navigation"

function Home() {

  return (
    <div className="h-screen w-screen flex">
      <div className="flex h-full">
        <SidebarTG />
      </div>
      <div className="w-full h-full">
        <div>
          <Navigation />
        </div>
      </div>
    </div>
  )
}

export default Home
