import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail } from "lucide-react"
import AuthShell from "@/components/AuthShell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getErrorMessage } from "@/lib/api"
import { requestPasswordReset, resetPassword } from "@/lib/auth"

function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState<"request" | "reset">("request")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleRequestCode = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) {
      setError("Informe um email válido.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await requestPasswordReset({ email: normalizedEmail })
      setStep("reset")
      setEmail(normalizedEmail)
      setSuccess(response.message)
    } catch (apiError) {
      const message = getErrorMessage(apiError, "Não foi possível enviar o código de recuperação.")
      if (message === "Failed to fetch") {
        setError("Não foi possível conectar ao backend. Verifique se a API está rodando e liberando CORS.")
        return
      }
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) {
      setError("Informe um email válido.")
      return
    }

    if (code.trim().length !== 6) {
      setError("Informe o código de 6 dígitos.")
      return
    }

    if (newPassword.length < 6) {
      setError("A nova senha deve ter no mínimo 6 caracteres.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    setIsSubmitting(true)
    try {
      await resetPassword({
        email: normalizedEmail,
        code: code.trim(),
        newPassword,
      })
      navigate(`/login?reset=1&email=${encodeURIComponent(normalizedEmail)}`, { replace: true })
    } catch (apiError) {
      const message = getErrorMessage(apiError, "Não foi possível redefinir sua senha.")
      if (message === "Failed to fetch") {
        setError("Não foi possível conectar ao backend. Verifique se a API está rodando e liberando CORS.")
        return
      }
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell title="Recuperar acesso" subtitle="Enviaremos um código para seu email">
      {step === "request" ? (
        <form onSubmit={handleRequestCode} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="forgot-email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="forgot-email"
                type="email"
                placeholder="você@email.com"
                className="pl-9"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
          {success && <p className="text-xs text-emerald-600">{success}</p>}

          <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar código"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            <Link to="/login" className="text-foreground hover:underline">
              Voltar para login
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="reset-email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="reset-email"
                type="email"
                className="pl-9"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="reset-code" className="text-sm font-medium">
              Código de recuperação
            </label>
            <Input
              id="reset-code"
              placeholder="000000"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="new-password" className="text-sm font-medium">
              Nova senha
            </label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua nova senha"
                className="pr-10"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword((previous) => !previous)}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                <span className="sr-only">Mostrar ou ocultar senha</span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium">
              Confirmar nova senha
            </label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repita a nova senha"
                className="pr-10"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowConfirmPassword((previous) => !previous)}
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                <span className="sr-only">Mostrar ou ocultar senha</span>
              </Button>
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
          {success && <p className="text-xs text-emerald-600">{success}</p>}

          <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? "Redefinindo..." : "Redefinir senha"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            <button
              type="button"
              className="cursor-pointer text-foreground hover:underline"
              onClick={() => {
                setStep("request")
                setCode("")
                setNewPassword("")
                setConfirmPassword("")
                setError("")
                setSuccess("")
              }}
            >
              Solicitar novo código
            </button>
          </p>
        </form>
      )}
    </AuthShell>
  )
}

export default ForgotPassword
