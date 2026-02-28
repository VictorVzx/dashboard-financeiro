import { useState, type FormEvent } from "react"
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import AuthShell from "@/components/AuthShell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getErrorMessage } from "@/lib/api"
import { isAuthenticated, login } from "@/lib/auth"

function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const registeredEmail = searchParams.get("email")?.trim().toLowerCase() ?? ""
  const registered = searchParams.get("registered") === "1"
  const resetSuccess = searchParams.get("reset") === "1"
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState(registeredEmail)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    setError("")
    setIsSubmitting(true)

    try {
      await login({
        email: normalizedEmail,
        password,
      })
      navigate("/")
    } catch (apiError) {
      const message = getErrorMessage(apiError, "Credenciais invalidas.")
      if (message === "Failed to fetch") {
        setError("Nao foi possivel conectar ao backend. Verifique se a API esta rodando e liberando CORS.")
        return
      }
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell title="Entrar" subtitle="Acesse sua conta para continuar no painel">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="login-email" className="text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="login-email"
              type="email"
              placeholder="voce@email.com"
              className="pl-9"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="login-password" className="text-sm font-medium">
            Senha
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Sua senha"
              className="pl-9 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              <span className="sr-only">Mostrar ou ocultar senha</span>
            </Button>
          </div>
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}
        {!error && registered && (
          <p className="text-xs text-emerald-600">
            Conta criada com sucesso. Faca login para continuar.
          </p>
        )}
        {!error && resetSuccess && (
          <p className="text-xs text-emerald-600">
            Senha redefinida com sucesso. Entre com a nova senha.
          </p>
        )}

        <div className="flex items-center justify-between text-sm">
          <Link to="/register" className="text-muted-foreground transition hover:text-foreground">
            Criar conta
          </Link>
          <Link to="/forgot" className="text-muted-foreground transition hover:text-foreground">
            Esqueci minha senha
          </Link>
        </div>

        <Button type="submit" className="mt-2 w-full cursor-pointer" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </AuthShell>
  )
}

export default Login
