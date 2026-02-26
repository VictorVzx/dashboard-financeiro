import type { ReactNode } from "react"
import { Mail, Phone, MapPin, CreditCard, PencilLine, LogOut } from "lucide-react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type ProfileModalProps = {
  children: ReactNode
}

const userProfile = {
  name: "Victor Alves",
  role: "Desenvolvedor Full Stack",
  email: "victor.alves@email.com",
  phone: "+55 (11) 99876-4321",
  address: "Sao Paulo, SP",
  plan: "Plano Premium",
}

function ProfileModal({ children }: ProfileModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-h-[80vh] max-w-[calc(100%-1rem)] flex-col overflow-hidden border-border/70 bg-card p-0 sm:max-w-lg">
        <div className="border-b border-border/70 p-4 pr-12 sm:p-6">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="text-xl">Meu perfil</DialogTitle>
            <DialogDescription>
              Gerencie suas informacoes pessoais e preferencias.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 overflow-y-auto p-4 sm:space-y-6 sm:p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Avatar className="size-20 ring-2 ring-border/80">
              <AvatarImage src="https://github.com/shadcn.png" alt={userProfile.name} />
              <AvatarFallback>VA</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold text-foreground">{userProfile.name}</h3>
              <p className="text-sm text-muted-foreground">{userProfile.role}</p>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-3 rounded-md border border-border/70 bg-background/60 px-3 py-2">
              <Mail className="size-4 text-muted-foreground" />
              <span className="break-all text-sm">{userProfile.email}</span>
            </div>
            <div className="flex items-center gap-3 rounded-md border border-border/70 bg-background/60 px-3 py-2">
              <Phone className="size-4 text-muted-foreground" />
              <span className="text-sm">{userProfile.phone}</span>
            </div>
            <div className="flex items-center gap-3 rounded-md border border-border/70 bg-background/60 px-3 py-2">
              <MapPin className="size-4 text-muted-foreground" />
              <span className="text-sm">{userProfile.address}</span>
            </div>
            <div className="flex items-center gap-3 rounded-md border border-border/70 bg-background/60 px-3 py-2">
              <CreditCard className="size-4 text-muted-foreground" />
              <span className="text-sm">{userProfile.plan}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-border/70 bg-muted/40 p-4 sm:justify-between">
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button variant="outline" className="w-full cursor-pointer sm:w-auto">
              <PencilLine className="size-4" />
              Editar perfil
            </Button>
            <DialogClose asChild>
              <Button asChild variant="destructive" className="w-full cursor-pointer sm:w-auto">
                <Link to="/login">
                  <LogOut className="size-4" />
                  Sair da conta
                </Link>
              </Button>
            </DialogClose>
          </div>
          <Button className="w-full cursor-pointer sm:w-auto">Salvar alteracoes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileModal
