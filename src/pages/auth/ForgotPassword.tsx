import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function ForgotPassword() {
  return (
    <div className="p-7 flex flex-col justify-center items-center w-full min-h-screen border-r-2 bg-gray-100">
        <div className="w-100 h-140 flex flex-col p-10 rounded-2xl shadow-2xl bg-white">
          <h2 className="font-bold text-3xl text-center">Recuperar Acesso</h2>
          <p className=" mb-4 text-center text-xl">Enviar um codigo para o seu email</p>
          <div className="w-full h-full flex flex-col align-center">
            <label htmlFor="fieldgroup-email">Email</label>
                <Input
                id="fieldgroup-email"
                type="email"
                placeholder="name@example.com"
                />
                <Button type="submit" className="mt-4 cursor-pointer">Enviar</Button>
                <a className="hover:underline ml-69 mt-2" href="/login">Voltar</a>
            </div>
        </div>
    </div>
  );
}

export default ForgotPassword;
