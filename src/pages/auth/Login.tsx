import React from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function Login() {
  return (
    <div className="p-7 flex flex-col justify-center items-center w-full min-h-screen border-r-2 bg-gray-100">
        
        <div className="w-100 h-140 flex flex-col p-10 rounded-2xl shadow-2xl bg-white">
          <h2 className="font-bold text-4xl text-center">Login</h2>
          <p className=" mb-4 text-center text-xl">Faça login para acessar sua conta</p>
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
            <Input
              id="fieldgroup-email"
              type="password"
              placeholder="Your strong password"
            />
            <div className="flex flex-col gap-2 mt-2 md:flex-row md:justify-between">
              <p><a className="hover:underline" href="./Register">Criar conta</a></p>
              <p>
                <a className="hover:underline" href="#">Esqueci minha senha</a>
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Button type="submit" className="w-full cursor-pointer">Submit</Button>
          </div>

        </div>
    </div>
  );
}

export default Login;
