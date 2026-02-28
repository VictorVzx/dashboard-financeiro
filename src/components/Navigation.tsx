import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSidebar } from "@/components/ui/sidebar"
import { Notification } from "./Notifications.tsx"
import ProfileModal from "./ProfileModal"
import { getStoredProfile, getStoredUser, onAuthUpdated, onProfileUpdated, type UserProfile } from "@/lib/auth"

function getInitials(name: unknown) {
  const normalizedName = typeof name === "string" ? name.trim() : ""
  if (!normalizedName) return "US"
  return normalizedName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function resolveProfile(): Pick<UserProfile, "name" | "avatarUrl"> {
  const storedProfile = getStoredProfile()
  if (storedProfile) {
    return {
      name: storedProfile.name,
      avatarUrl: storedProfile.avatarUrl,
    }
  }

  const user = getStoredUser()
  return {
    name: user?.name ?? "Usuario",
    avatarUrl: null,
  }
}

function Navigation() {
  const { isMobile, open } = useSidebar()
  const desktopLeft = open ? "var(--sidebar-width)" : "0px"
  const [profile, setProfile] = useState(resolveProfile)

  useEffect(() => {
    const sync = () => setProfile(resolveProfile())
    const unlistenAuth = onAuthUpdated(sync)
    const unlistenProfile = onProfileUpdated(sync)
    return () => {
      unlistenAuth()
      unlistenProfile()
    }
  }, [])

  const userName = profile.name || "Usuario"
  const initials = getInitials(userName)

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
          <h2 className="ml-7 truncate text-sm font-semibold text-foreground sm:text-base md:text-lg lg:text-xl">
            Bem-vindo de volta, {userName}!
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
                  src={profile.avatarUrl || undefined}
                  alt={`${userName} profile picture`}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </button>
          </ProfileModal>
        </div>
      </div>
    </div>
  )
}

export default Navigation
