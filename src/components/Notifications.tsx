import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Notification() {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-fit cursor-pointer">Notificações</Button>
        </PopoverTrigger>
        <PopoverContent align="center">
          <PopoverHeader>
            <PopoverTitle>Notificações</PopoverTitle>
            <PopoverDescription>
              Nenhuma nova notificação.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </>
  )
}
