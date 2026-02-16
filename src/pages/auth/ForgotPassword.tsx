import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

function ForgotPassword() {
  return (
    <div className="relative p-4 sm:p-7 flex flex-col justify-center items-center w-full min-h-screen bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md flex flex-col p-6 sm:p-10 rounded-2xl shadow-2xl bg-card text-foreground">
        <h2 className="font-bold text-2xl sm:text-3xl text-center">
          Recuperar Acesso
        </h2>
        <p className="mb-4 text-center text-lg sm:text-xl">
          Enviar um codigo para o seu email
        </p>
        <div className="w-full flex flex-col align-center">
          <label htmlFor="fieldgroup-email">Email</label>
          <Input
            id="fieldgroup-email"
            type="email"
            placeholder="name@example.com"
          />
          <Button type="submit" className="mt-4 cursor-pointer">
            Enviar
          </Button>
          <div className="mt-2 text-center">
            <a className="hover:underline" href="/login">
              Voltar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
