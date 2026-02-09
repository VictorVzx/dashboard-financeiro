import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Notification } from "./Notifications.tsx";

function Navigation() {
  const user = "Victor";

  return (
    <div className="w-full h-full flex items-center">
      <div className="w-full h-1/19 bg-white flex items-center justify-between px-6 py-3 ">
        <h2 className="text-xl font-semibold">
          Bem-vindo(a) de volta, {user}!
        </h2>
        <div className="flex items-center gap-4">
          <div className="mr-5">
            <Notification />
          </div>
          <a href="/profile" className="size-10">
            <Avatar className="size-10 cursor-pointer">
              <AvatarImage
                className="rounded-full"
                src="https://github.com/shadcn.png"
                />
              <AvatarFallback>Img</AvatarFallback>
            </Avatar>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Navigation;
