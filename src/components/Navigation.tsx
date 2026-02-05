import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

function Navigation() {
  const user = "Victor";

  return (
    <div className="w-full h-full flex items-center">
      <div className="w-full h-1/19 bg-white flex items-center justify-between px-6 py-3 ">
        <h2 className="text-xl font-semibold">Bem-vindo(a) de volta, {user}!</h2>
        <div className="flex items-center gap-4">
          <Bell className="size-5 cursor-pointer hover:opacity-65" />
          <a href="/profile">
            <Button className="bg-white text-black hover:bg-gray-100 border border-gray-300 cursor-pointer">
              Perfil
            </Button>
          </a>
          <Avatar className="size-10">
            <AvatarImage
              className="rounded-full"
              src="https://github.com/shadcn.png"
            />
            <AvatarFallback>Img</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}

export default Navigation;
