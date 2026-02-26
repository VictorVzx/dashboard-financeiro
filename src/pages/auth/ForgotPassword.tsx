import type { FormEvent } from "react"
import { Link } from "react-router-dom"
import { Mail } from "lucide-react"
import AuthShell from "@/components/AuthShell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function ForgotPassword() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
  }

  return (
    <AuthShell title="Recuperar acesso" subtitle="Enviaremos um codigo para seu email">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="forgot-email" className="text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="forgot-email" type="email" placeholder="voce@email.com" className="pl-9" required />
          </div>
        </div>

        <Button type="submit" className="w-full cursor-pointer">
          Enviar codigo
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Link to="/login" className="text-foreground hover:underline">
            Voltar para login
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}

export default ForgotPassword
