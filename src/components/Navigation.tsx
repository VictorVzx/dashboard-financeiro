import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSidebar } from "@/components/ui/sidebar"
import { Notification } from "./Notifications.tsx"
import ProfileModal from "./ProfileModal"

function Navigation() {
  const user = "Victor"
  const { isMobile, open } = useSidebar()
  const desktopLeft = open ? "var(--sidebar-width)" : "0px"

  return (
    <div
      className="fixed top-0 z-5 border-b border-border/70 bg-card/85 px-2 py-2 backdrop-blur-md transition-[left,width] duration-200 sm:px-4 sm:py-3 md:px-6"
      style={
        isMobile
          ? { left: 0, right: 0, width: "100%" }
          : { left: desktopLeft, right: 0, width: `calc(100% - ${desktopLeft})` }
      }
    >
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 sm:gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1 pl-11 sm:pl-14 md:pl-0 sm:flex-row sm:items-center sm:gap-2 md:gap-3">
          <h2 className="truncate text-sm font-semibold text-foreground sm:text-base md:text-lg lg:text-xl ml-7">
            Bem-vindo de volta, {user}!
          </h2>
        </div>
        <div className="flex w-auto shrink-0 items-center justify-end gap-1.5 sm:gap-3">
          <div>
            <Notification />
          </div>
          <ProfileModal>
            <button
              type="button"
              className="group size-9 cursor-pointer rounded-full border border-border/80 bg-background/80 p-0.5 shadow-sm transition hover:scale-[1.02] hover:border-foreground/40 sm:size-10"
            >
              <Avatar className="size-8 sm:size-9">
                <AvatarImage
                  className="rounded-full"
                  src="https://github.com/shadcn.png"
                  alt={`${user} profile picture`}
                />
                <AvatarFallback>VA</AvatarFallback>
              </Avatar>
            </button>
          </ProfileModal>
        </div>
      </div>
    </div>
  )
}

export default Navigation
