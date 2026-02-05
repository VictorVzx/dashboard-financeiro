import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  

  // 1. Gerenciando todos os dados em um único objeto
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Função para atualizar os campos dinamicamente
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // O id deve bater com o nome da chave no objeto (ex: fieldgroup-name -> name)
    const fieldName = id.replace("fieldgroup-", "");
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    // Validação básica de confirmação de senha
    if (formData.password !== formData.confirmPassword) {
      
      return;
    }

    console.log("Dados do Registro:", formData);
    // Envie para seu backend aqui
  };

  const passWordsDontMatch = 
    formData.confirmPassword.length > 0 && 
    formData.password !== formData.confirmPassword;

  return (
    <div className="p-4 sm:p-7 flex flex-col justify-center items-center w-full min-h-screen bg-gray-100">
      <div className="w-full max-w-md flex flex-col p-6 sm:p-10 rounded-2xl shadow-2xl bg-white">
        <h2 className="font-bold text-2xl sm:text-4xl text-center">Registrar-se</h2>
        <p className="mb-4 text-center text-lg sm:text-xl text-gray-600">
          Crie a sua conta para entrar!
        </p>

        {/* Início do Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="fieldgroup-name">Nome</label>
            <Input 
                id="fieldgroup-name" 
                placeholder="João Silva" 
                value={formData.name}
                onChange={handleChange}
                required 
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="fieldgroup-email">Email</label>
            <Input
              id="fieldgroup-email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="fieldgroup-password">Senha</label>
            <div className="relative">
              <Input
                id="fieldgroup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha forte"
                className="pr-10"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1"
              > 
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />} 
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="fieldgroup-confirmPassword">Confirmar senha</label>
            <div className="relative">
              <Input
                id="fieldgroup-confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`pr-10 ${
                  passWordsDontMatch ? "border-red-500" : "border-gray-300"
                }`}
              />
              <Button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1"
              > 
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />} 
              </Button>
            </div>
            {passWordsDontMatch && (
              <p className="text-red-500 text-sm mt-1">As senhas não coincidem.</p>
            )}
          </div>

          <div className="mt-2 text-center">
            <a className="text-sm text-sky-600 hover:underline" href="/login">
              Já tem uma conta? Faça login
            </a>
          </div>

          <Button type="submit" className="w-full mt-4 cursor-pointer">
            Criar Conta
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Register;