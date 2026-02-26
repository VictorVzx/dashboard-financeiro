import { useState, type ChangeEvent, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import AuthShell from "@/components/AuthShell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type RegisterForm = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (field: keyof RegisterForm) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) return
    console.log("Dados do registro:", formData)
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
              placeholder="voce@email.com"
              className="pl-9"
              value={formData.email}
              onChange={handleChange("email")}
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
          {senhasDiferentes && <p className="text-xs text-destructive">As senhas nao coincidem.</p>}
        </div>

        <Button type="submit" className="w-full cursor-pointer">
          Criar conta
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Ja tem conta?{" "}
          <Link to="/login" className="text-foreground hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}

export default Register
