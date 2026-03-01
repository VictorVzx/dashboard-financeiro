import { useState, type ChangeEvent, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, User, Calendar, IdCard } from "lucide-react"
import AuthShell from "@/components/AuthShell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getErrorMessage } from "@/lib/api"
import { register } from "@/lib/auth"

type RegisterForm = {
  name: string
  email: string
  cpf: string
  birthDate: string
  password: string
  confirmPassword: string
}

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

function getAgeFromBirthDate(birthDate: string) {
  const today = new Date()
  const birth = new Date(`${birthDate}T00:00:00`)

  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  const hasNotHadBirthdayYet =
    monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())

  if (hasNotHadBirthdayYet) age -= 1
  return age
}

function formatBirthDateToBackend(value: string) {
  const [year, month, day] = value.split("-")
  if (!year || !month || !day) return ""
  return `${day}-${month}-${year}`
}

function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    cpf: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (field: keyof RegisterForm) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = field === "cpf" ? formatCpf(e.target.value) : e.target.value
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    const cpfDigits = formData.cpf.replace(/\D/g, "")
    if (cpfDigits.length !== 11) {
      setError("Informe um CPF válido com 11 dígitos.")
      return
    }

    if (!formData.birthDate) {
      setError("Informe sua data de nascimento.")
      return
    }

    const age = getAgeFromBirthDate(formData.birthDate)
    if (Number.isNaN(age) || age < 0) {
      setError("Data de nascimento inválida.")
      return
    }

    if (age < 18) {
      setError("Não é possível criar a conta para menores de 18 anos.")
      return
    }

    setIsSubmitting(true)

    try {
      const normalizedEmail = formData.email.trim().toLowerCase()
      await register({
        name: formData.name.trim(),
        email: normalizedEmail,
        cpf: cpfDigits,
        birthdate: formatBirthDateToBackend(formData.birthDate),
        password: formData.password,
      })
      navigate(`/login?registered=1&email=${encodeURIComponent(normalizedEmail)}`, { replace: true })
    } catch (apiError) {
      const message = getErrorMessage(apiError, "Não foi possível concluir o cadastro.")
      if (message === "Failed to fetch") {
        setError("Não foi possível conectar ao backend. Verifique se a API está rodando e liberando CORS.")
        return
      }
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const senhasDiferentes =
    formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword

  return (
    <AuthShell title="Criar conta" subtitle="Cadastre-se para usar o painel financeiro">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="register-name" className="text-sm font-medium">
            Nome
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="register-name"
              placeholder="Seu nome"
              className="pl-9"
              value={formData.name}
              onChange={handleChange("name")}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="register-email" className="text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="register-email"
              type="email"
              placeholder="você@email.com"
              className="pl-9"
              value={formData.email}
              onChange={handleChange("email")}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="register-birth-date" className="text-sm font-medium">
            Data de nascimento
          </label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="register-birth-date"
              type="date"
              className="pl-9"
              value={formData.birthDate}
              onChange={handleChange("birthDate")}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="register-cpf" className="text-sm font-medium">
            CPF
          </label>
          <div className="relative">
            <IdCard className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="register-cpf"
              type="text"
              placeholder="000.000.000-00"
              className="pl-9"
              value={formData.cpf}
              onChange={handleChange("cpf")}
              inputMode="numeric"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="register-password" className="text-sm font-medium">
            Senha
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              placeholder="Crie uma senha"
              className="pl-9 pr-10"
              value={formData.password}
              onChange={handleChange("password")}
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

        <div className="space-y-2">
          <label htmlFor="register-confirm" className="text-sm font-medium">
            Confirmar senha
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="register-confirm"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repita a senha"
              className="pl-9 pr-10"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              <span className="sr-only">Mostrar ou ocultar senha</span>
            </Button>
          </div>
          {senhasDiferentes && <p className="text-xs text-destructive">As senhas não coincidem.</p>}
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login" className="text-foreground hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}

export default Register
