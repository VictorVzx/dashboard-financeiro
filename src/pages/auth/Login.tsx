import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica de autenticação, como enviar os dados para um servidor
    console.log("Dados enviados:", email, password);
    // Aqui chamar a api de login
  };

  return (
    <div className="relative p-4 sm:p-7 flex flex-col justify-center items-center w-full min-h-screen bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md flex flex-col p-6 sm:p-10 rounded-2xl shadow-2xl bg-card text-foreground">
        <h2 className="font-bold text-2xl sm:text-4xl text-center">Login</h2>
        <p className="mb-4 text-center text-lg sm:text-xl">
          Faça login para acessar sua conta
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="fieldgroup-email">Email</label>
          <Input
            id="fieldgroup-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="fieldgroup-password">Senha</label>
          <div className="relative">
            <Input
              id="fieldgroup-password"
              type={showPassword ? "text" : "password"}
              placeholder="Your strong password"
              className="pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1"
            >
              {" "}
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}{" "}
            </Button>
          </div>
          <div className="flex flex-col gap-2 mt-2 md:flex-row md:justify-between">
            <p>
              <a className="hover:underline" href="./register">
                Criar conta
              </a>
            </p>
            <p>
              <a className="hover:underline" href="./forgot">
                Esqueci minha senha
              </a>
            </p>
          </div>
          <div className="mt-4">
            <Button type="submit" className="w-full cursor-pointer">
              Entrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
