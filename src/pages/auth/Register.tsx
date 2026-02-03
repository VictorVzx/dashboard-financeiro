import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    return(
        <div className="p-4 sm:p-7 flex flex-col justify-center items-center w-full min-h-screen bg-gray-100">
        
        <div className="w-full max-w-md flex flex-col p-6 sm:p-10 rounded-2xl shadow-2xl bg-white">
          <h2 className="font-bold text-2xl sm:text-4xl text-center">Registrar-se</h2>
          <p className="mb-4 text-center text-lg sm:text-xl">Crie a sua conta para entrar!</p>
          <div>
            <label htmlFor="fieldgroup-name">Nome</label>
            <Input id="fieldgroup-name" placeholder="João Silva" />
          </div>
          <div>
            <label htmlFor="fieldgroup-email">Email</label>
            <Input
              id="fieldgroup-email"
              type="email"
              placeholder="name@example.com"
            />
            <label htmlFor="fieldgroup-email">Senha</label>
            <div className="relative">
              <Input
                id="fieldgroup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Your strong password"
                className="pr-10"
              />
              <Button type="button" onClick={() => setShowPassword(!showPassword)} variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1"> {showPassword ? <EyeOff size={16} /> : <Eye size={16} />} </Button>
            </div>
            <label htmlFor="fieldgroup-confirm">Confirmar senha</label>
            <div className="relative">
              <Input
                id="fieldgroup-confirm"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="pr-10"
              />
              <Button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1"> {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />} </Button>
            </div>
            <div className="mt-2 text-center">
              <a className="hover:underline" href="/login">Login</a>
            </div>
          </div>
          <div className="mt-4">
            <Button type="submit" className="w-full cursor-pointer">Submit</Button>
          </div>

        </div>
    </div>
    )
}

export default Register