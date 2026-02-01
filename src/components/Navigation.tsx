import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Bell } from "lucide-react";

function Navigation() {
  return (
    <div className="w-full h-full flex items-center">
      <div className="w-full h-1/19 bg-white flex items-center justify-between px-6 py-3 ">
        <h2 className="text-xl font-semibold">Welcome back, João!</h2>
        <div className="flex items-center gap-4">
          <Bell className="size-5 cursor-pointer" />
          <Avatar className="size-10">
            <AvatarImage className="rounded-full" src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}

export default Navigation;
