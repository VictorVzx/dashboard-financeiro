import { useRef, useState, type ChangeEvent, type ReactNode } from "react"
import { Mail, Phone, MapPin, CreditCard, Save, Camera, LogOut, ShieldCheck } from "lucide-react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/api"
import { getStoredProfile, logout } from "@/lib/auth"
import { getProfile, updateProfile } from "@/lib/dashboard-api"
import { Input } from "@/components/ui/input"
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

type ProfileForm = {
  name: string
  phone: string
  address: string
  avatarUrl: string
  email: string
  role: string
  plan: string
}

const emptyForm: ProfileForm = {
  name: "",
  phone: "",
  address: "",
  avatarUrl: "",
  email: "",
  role: "",
  plan: "",
}

function toSafeText(value: unknown) {
  return typeof value === "string" ? value : ""
}

type ProfileFormInput = {
  name?: unknown
  phone?: unknown
  address?: unknown
  avatarUrl?: unknown
  email?: unknown
  role?: unknown
  plan?: unknown
}

function toProfileForm(input: ProfileFormInput | null | undefined): ProfileForm {
  if (!input) return emptyForm

  return {
    name: toSafeText(input.name),
    phone: toSafeText(input.phone),
    address: toSafeText(input.address),
    avatarUrl: toSafeText(input.avatarUrl),
    email: toSafeText(input.email),
    role: toSafeText(input.role),
    plan: toSafeText(input.plan),
  }
}

function getUserInitials(name: unknown) {
  const normalizedName = toSafeText(name).trim()
  if (!normalizedName) return "US"

  return normalizedName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function ProfileModal({ children }: ProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [form, setForm] = useState<ProfileForm>(() => {
    const storedProfile = getStoredProfile()
    if (!storedProfile) return emptyForm

    return toProfileForm({
      name: storedProfile.name,
      phone: storedProfile.phone,
      address: storedProfile.address,
      avatarUrl: storedProfile.avatarUrl,
      email: storedProfile.email,
      role: storedProfile.role,
      plan: storedProfile.plan,
    })
  })
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const loadProfile = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const profile = await getProfile()
      setForm(
        toProfileForm({
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
          avatarUrl: profile.avatarUrl,
          email: profile.email,
          role: profile.role,
          plan: profile.plan,
        }),
      )
    } catch (apiError) {
      setError(getErrorMessage(apiError, "Não foi possível carregar os dados do perfil."))
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setIsOpen(nextOpen)
    if (nextOpen) {
      void loadProfile()
    }
  }

  const handleChange =
    (field: "name" | "phone" | "address") => (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setForm((previous) => ({ ...previous, [field]: value }))
    }

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem válido.")
      return
    }

    if (file.size > 1024 * 1024 * 4) {
      setError("A imagem deve ter no máximo 4MB.")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      setForm((previous) => ({
        ...previous,
        avatarUrl: result,
      }))
      setError("")
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setError("")
    setSuccess("")

    const normalizedName = toSafeText(form.name).trim()
    if (!normalizedName) {
      setError("Informe o nome.")
      return
    }

    setIsSaving(true)

    try {
      await updateProfile({
        name: normalizedName,
        phone: toSafeText(form.phone).trim() || null,
        address: toSafeText(form.address).trim() || null,
        avatarUrl: toSafeText(form.avatarUrl).trim() || null,
      })
      setSuccess("Perfil atualizado com sucesso.")
    } catch (apiError) {
      setError(getErrorMessage(apiError, "Não foi possível salvar o perfil."))
    } finally {
      setIsSaving(false)
    }
  }

  const userInitials = getUserInitials(form.name)

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-h-[90vh] max-w-[calc(100%-1rem)] flex-col overflow-hidden border-border/70 bg-card p-0 sm:max-w-lg">
        <div className="border-b border-border/70 p-4 pr-12 sm:p-6">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="text-xl">Meu perfil</DialogTitle>
            <DialogDescription>Atualize suas informações e foto de perfil.</DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Avatar className="size-20 ring-2 ring-border/80">
              <AvatarImage src={form.avatarUrl || undefined} alt={form.name || "Usuário"} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="size-4" />
                Alterar foto
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
              <p className="text-xs text-muted-foreground">PNG/JPG até 4MB.</p>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground" htmlFor="profile-name">
                Nome
              </label>
              <Input
                id="profile-name"
                value={form.name}
                onChange={handleChange("name")}
                disabled={isLoading || isSaving}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground" htmlFor="profile-phone">
                Telefone
              </label>
              <Input
                id="profile-phone"
                value={form.phone}
                onChange={handleChange("phone")}
                placeholder="+55 (11) 99999-9999"
                disabled={isLoading || isSaving}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground" htmlFor="profile-address">
                Endereco
              </label>
              <Input
                id="profile-address"
                value={form.address}
                onChange={handleChange("address")}
                placeholder="Cidade, Estado"
                disabled={isLoading || isSaving}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-3 rounded-md border border-border/70 bg-background/60 px-3 py-2">
              <Mail className="size-4 text-muted-foreground" />
              <span className="break-all text-sm">{form.email || "-"}</span>
            </div>
            <div className="flex items-center gap-3 rounded-md border border-border/70 bg-background/60 px-3 py-2">
              <Phone className="size-4 text-muted-foreground" />
              <span className="text-sm">{form.phone || "-"}</span>
            </div>
            <div className="flex items-center gap-3 rounded-md border border-border/70 bg-background/60 px-3 py-2">
              <MapPin className="size-4 text-muted-foreground" />
              <span className="text-sm">{form.address || "-"}</span>
            </div>
            <div className="flex items-center gap-3 rounded-md border border-border/70 bg-background/60 px-3 py-2">
              <ShieldCheck className="size-4 text-muted-foreground" />
              <span className="text-sm">{form.role || "Usuário"}</span>
            </div>
            <div className="flex items-center gap-3 rounded-md border border-border/70 bg-background/60 px-3 py-2">
              <CreditCard className="size-4 text-muted-foreground" />
              <span className="text-sm">{form.plan || "Plano Padrao"}</span>
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
          {success && <p className="text-xs text-emerald-600">{success}</p>}
        </div>

        <DialogFooter className="border-t border-border/70 bg-muted/40 p-4 sm:justify-between">
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <DialogClose asChild>
              <Button asChild variant="destructive" className="w-full cursor-pointer sm:w-auto">
                <Link to="/login" onClick={logout}>
                  <LogOut className="size-4" />
                  Sair da conta
                </Link>
              </Button>
            </DialogClose>
          </div>
          <Button className="w-full cursor-pointer sm:w-auto" onClick={handleSave} disabled={isSaving || isLoading}>
            <Save className="size-4" />
            {isSaving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileModal
